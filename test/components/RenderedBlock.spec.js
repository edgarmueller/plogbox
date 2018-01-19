/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';
import * as _ from 'lodash';
import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';
import * as Immutable from 'immutable';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReactMarkdown from 'react-markdown';
import { Provider } from 'react-redux';
import { File } from 'file-api';
import RenderedBlock, { RenderedBlockContainer, mapDispatchToProps } from '../../src/containers/RenderedBlockContainer';
import { firstPost, posts } from '../helpers/posts';
import { BASE_URL } from '../../src/constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test('should render markdown', () => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const block = {
    id: 0,
    dialect: 'markdown',
    text: 'Some markdown text',
  };

  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <RenderedBlock
        postId={firstPost.id}
        block={block}
      />
    </Provider>,
  );
  const reactMd = enzymeWrapper.find(ReactMarkdown);
  expect(reactMd.length).toBe(1);
});


test('should render image', () => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const block = {
    id: 0,
    dialect: 'image',
    name: 'dog.jpg',
    text: 'dog.jpg',
  };
  // add to storage, so that download is not triggered
  localStorage.setItem(block.text, 'fake data');

  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <RenderedBlock
        postId={firstPost.id}
        block={block}
      />
    </Provider>,
  );
  const img = enzymeWrapper.find('img');
  expect(img.length).toBe(1);
});

test('trigger download during mount', () => {
  // remove any existing image
  localStorage.removeItem('block_0_image');
  const block = {
    id: 0,
    dialect: 'markdown',
    text: 'some text',
  };
  const response = {
    data: new File('test/exported-posts.json'),
  };
  const mock = new MockAdapter(Axios);
  mock.onGet(`${BASE_URL}/api/posts/0/blocks`)
    .reply(200, response);

  let didDownload = false;
  const enzymeWrapper = shallow(
    <RenderedBlockContainer
      postId={firstPost.id}
      block={block}
      downloadFile={() => {
        didDownload = true;
      }}
    />,
    { lifecycleExperimental: true },
  );
  const block2 = {
    id: 1,
    dialect: 'image',
    text: 'text text text',
    name: 'dog.png',
  };
  enzymeWrapper.setProps({
    block: block2,
  });
  expect(didDownload).toBeTruthy();
});

test('downloadFile', async () => {
  const store = mockStore({ });
  const response = Promise.resolve({
    data: new File('test/exported-posts.json'),
  });
  const mock = new MockAdapter(Axios);
  mock.onGet(`${BASE_URL}/api/posts/0/blocks`)
    .reply(200, response);

  const props = mapDispatchToProps(store.dispatch);
  await props.downloadFile(
    0,
    {
      id: 0,
      text: 'dummy',
    },
    () => { },
  );
  expect(localStorage.getItem('dummy')).not.toBe(undefined);
});

test('downloadFile failure', async () => {
  const store = mockStore({ });
  const response = { status: 'error' };
  const mock = new MockAdapter(Axios);
  mock.onGet(`${BASE_URL}/api/posts/0/blocks/file/dummy`)
    .reply(403, response);
  const props = mapDispatchToProps(store.dispatch);
  await props.downloadFile(
    0,
    {
      id: 0,
      text: 'dummy',
    },
    () => {},
  );
  const storedActions = store.getActions();
  expect(_.last(storedActions).type).toBe('UPDATE_BLOCK_FAILURE');
});
