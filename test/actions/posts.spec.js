/* eslint-disable import/first */
import '../helpers/setup';
import * as _ from 'lodash';
import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../../src/actions';
import { firstPost, posts } from '../helpers/posts';
import {
  BASE_URL,
  DELETE_POST_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_SUCCESS,
} from '../../src/constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test('delete post', async () => {
  const resolved = {
    data: {
      statusText: 'success',
    },
  };
  const mock = new MockAdapter(Axios);
  mock.onDelete(`${BASE_URL}/api/posts/0`)
    .reply(200, resolved);
  const store = mockStore({ });
  await store.dispatch(actions.deletePost(firstPost));
  expect(_.head(store.getActions()))
    .toEqual({
      type: DELETE_POST_SUCCESS,
      post: firstPost,
    });
});

test('fetch posts', async () => {
  const response = {
    status: 'success',
    data: posts,
  };
  const mock = new MockAdapter(Axios);
  mock.onGet(`${BASE_URL}/api/posts`).reply(200, response);
  const store = mockStore({
    posts: { },
  });
  await store.dispatch(actions.fetchPosts());

    // request action + success action
  expect(store.getActions().length).toBe(2);
  expect(_.last(store.getActions()))
    .toEqual({
      type: FETCH_POSTS_SUCCESS,
      posts,
    });
});

test('fetch posts is loading', async () => {
  const response = {
    status: 'success',
  };
  const mock = new MockAdapter(Axios);
  mock.onGet(`${BASE_URL}/api/posts`).reply(200, response);
  const store = mockStore({
    posts: {
      isFetching: true,
    },
  });
  await store.dispatch(actions.fetchPosts());
  expect(store.getActions().length).toBe(0);
});

test('fetch posts failure', async () => {
  const response = {
    status: 'error',
    messages: ['An statusText occurred while fetching posts'],
  };
  // t.context.sandbox.stub(Axios, 'get').returns(resolved);
  const mock = new MockAdapter(Axios);
  mock.onGet(`${BASE_URL}/api/posts`).reply(409, response);

  const store = mockStore({
    posts: { },
  });
  await store.dispatch(actions.fetchPosts());
  const action = _.nth(store.getActions(), 1);

    // request action + success action
  expect(store.getActions().length).toBe(2);
  expect(action).toEqual({
    type: FETCH_POSTS_FAILURE,
    statusText: 'An statusText occurred while fetching posts',
  });
});
