import test from 'ava';
import React from 'react';
import Axios from 'axios';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import Latex from 'react-latex';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import ReactMarkdown from 'react-markdown';
import { Provider } from 'react-redux';
import { File } from 'file-api';
import Block, { mapDispatchToProps } from '../../src/components/BlockContainer';
import { firstPost, posts } from '../helpers/posts';
import { afterEach, beforeEach, mountWithContext, setupDom } from '../helpers/setup';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test.beforeEach(async (t) => {
  beforeEach(t);
});

test.afterEach(t => afterEach(t));

test('Block should render markdown', (t) => {
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
    t,
    <Provider store={store}>
      <Block
        postId={firstPost.id}
        block={block}
      />
    </Provider>,
  );
  const reactMd = enzymeWrapper.find(ReactMarkdown);
  t.is(reactMd.length, 1);
});


test('Block should render image', (t) => {
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
    name: 'dog.npg',
    text: 'binary image data would go here',
  };

  const enzymeWrapper = mountWithContext(
    t,
    <Provider store={store}>
      <Block
        postId={firstPost.id}
        block={block}
      />
    </Provider>,
  );
  const img = enzymeWrapper.find('img');
  t.is(img.length, 1);
});

test('BlockContainer should render latex', (t) => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const block = {
    id: 0,
    dialect: 'latex',
    text: '$1 + 1 = 2$',
  };

  const enzymeWrapper = mountWithContext(
    t,
    <Provider store={store}>
      <Block
        postId={firstPost.id}
        block={block}
      />
    </Provider>,
  );
  const img = enzymeWrapper.find(Latex);
  t.is(img.length, 1);
});

test.serial('downloadFile', async (t) => {
  const store = mockStore({ });
  const resolved = new Promise(r => r({
    // data: {
    data: new File('test/exported-posts.json'),
    // },
  }));
  t.context.sandbox.stub(Axios, 'get').returns(resolved);
  const props = mapDispatchToProps(store.dispatch);
  let promiseResolve;
  const promise = new Promise((resolve, reject) => {
    promiseResolve = resolve;
    setTimeout(reject, 1000).ref();
  });

  setupDom(() => {
    props.downloadFile(
      0,
      {
        id: 0,
        text: 'dummy',
      },
      promiseResolve,
    );
  });
  await promise;
  t.not(localStorage.getItem('block_0_image'), undefined);
});

test.serial('downloadFile failure', async (t) => {
  const store = mockStore({ });
  const resolved = Promise.reject({});
  t.context.sandbox.stub(Axios, 'get').returns(resolved);
  const props = mapDispatchToProps(store.dispatch);

  await props.downloadFile(0, {
    id: 0,
    text: 'dummy',
  });
  const storedActions = store.getActions();
  t.is(_.last(storedActions).type, 'UPDATE_BLOCK_FAILURE');
});
