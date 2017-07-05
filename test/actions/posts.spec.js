import test from 'ava';
import * as _ from 'lodash';
import Axios from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as api from '../../src/api';
import * as actions from '../../src/actions';
import { afterEach, beforeEach } from '../helpers/setup';
import { firstPost, posts } from '../helpers/posts';
import { DELETE_POST_SUCCESS } from '../../src/constants';
import { FETCH_POSTS_FAILURE, FETCH_POSTS_SUCCESS } from '../../src/constants/index';
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test.beforeEach(async t => await beforeEach(t));

test.afterEach(t => afterEach(t));

test.serial('delete post', async (t) => {
  const resolved = new Promise(r => r({
    data: {
      statusText: 'success',
    },
  }));
  t.context.sandbox.stub(Axios, 'delete').returns(resolved);
  const store = mockStore({ });
  await store.dispatch(actions.deletePost(firstPost));
  t.deepEqual(_.head(store.getActions()), {
    type: DELETE_POST_SUCCESS,
    post: firstPost,
  });
  const response = await api.deletePost(firstPost);
  t.deepEqual(response.data.statusText, 'success');
});

test.serial('fetch posts', async (t) => {
  const resolved = new Promise(r => r({
    data: {
      data: posts,
    }
  }));
  t.context.sandbox.stub(Axios, 'get').returns(resolved);
  const store = mockStore({
    posts: { },
  });
  await store.dispatch(actions.fetchPosts());

    // request action + success action
  t.is(store.getActions().length, 2);
  t.deepEqual(_.last(store.getActions()), {
    type: FETCH_POSTS_SUCCESS,
    posts,
  });
});

test.serial('fetch posts is loading', async (t) => {
  const resolved = new Promise((r) => {});
  t.context.sandbox.stub(Axios, 'get').returns(resolved);
  const store = mockStore({
    posts: {
      isFetching: true,
    },
  });
  await store.dispatch(actions.fetchPosts());
  t.is(store.getActions().length, 0);
});

test.serial('fetch posts failure', async (t) => {
  const resolved = Promise.reject({
    response: {
      data: {
        statusText: 'error',
        messages: ['An statusText occurred while fetching posts'],
      },
    },
  });
  t.context.sandbox.stub(Axios, 'get').returns(resolved);

  const store = mockStore({
    posts: { },
  });
  await store.dispatch(actions.fetchPosts());
  const action = _.nth(store.getActions(), 1);

    // request action + success action
  t.is(store.getActions().length, 2);
  t.deepEqual(action, {
    type: FETCH_POSTS_FAILURE,
    statusText: 'An statusText occurred while fetching posts',
  });
});
