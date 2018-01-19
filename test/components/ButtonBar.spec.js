/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';
import React from 'react';
import Axios from 'axios';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { File } from 'file-api';
import { IconButton } from 'material-ui';
import ButtonBar, { mapDispatchToProps } from '../../src/containers/ButtonBarContainer';
import { firstPost, posts } from '../helpers/posts';
import {
  BASE_URL,
  CREATE_POST_SUCCESS,
  EXPORT_POSTS_FAILURE,
} from '../../src/constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test('should render', () => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <ButtonBar />
    </Provider>,
  );
  const buttons = enzymeWrapper.find(IconButton);
  expect(buttons.length).toBe(2);
});

test('exportPosts via mapDispatchToProps', async () => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const data = {
    data: posts,
  };
  const mock = new MockAdapter(Axios);
  mock.onGet(`${BASE_URL}/api/posts/0/blocks`).reply(200, data);
  const props = mapDispatchToProps(store.dispatch);
  const exportedPosts = await props.exportPosts(posts);
  expect(exportedPosts.length).toBe(1);
});

test('exportPosts via mapDispatchToProps fetch failure', async () => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const mock = new MockAdapter(Axios);
  mock.onGet(`${BASE_URL}/api/posts/0/blocks`).reply(404, { status: 'error' });
  const props = mapDispatchToProps(store.dispatch);
  await props.exportPosts(posts);
  expect(_.head(store.getActions()).type).toBe(EXPORT_POSTS_FAILURE);
});

test('importPosts via mapDispatchToProps', async () => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const response = {
    data: firstPost,
  };
  const mock = new MockAdapter(Axios);
  mock.onPut(`${BASE_URL}/api/posts`).reply(200, response);
  mock.onPut(`${BASE_URL}/api/posts/${firstPost.id}/blocks`).reply(
    200,
    { status: 'success' },
  );
  const f = new File('test/exported-posts.json');
  const props = mapDispatchToProps(store.dispatch);
  await props.importPostsFromFile(f);
  expect(_.head(store.getActions()).type).toBe(CREATE_POST_SUCCESS);
});
