import test from 'ava';
import React from 'react';
import Axios from 'axios';
import * as _ from 'lodash';
import * as Immutable from 'immutable';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { TableBody } from 'material-ui/Table';
import PostList, { mapDispatchToProps } from '../../src/components/PostListContainer';
import { firstPost, posts } from '../helpers/posts';
import { afterEach, beforeEach, mountWithContext } from '../helpers/setup';
import { CREATE_POST_SUCCESS, DELETE_POST_SUCCESS, RESET_ERROR_MESSAGE, SELECT_POST } from '../../src/constants/index';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test('PostListContainer should render', (t) => {
  const props = {
    posts,
    deletePost() {},
  };

  const resolved = new Promise(r => r({
    data: {
      data: posts,
    },
  }));
  t.context.sandbox.stub(Axios, 'get').returns(resolved);
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });

  const enzymeWrapper = mountWithContext(
    t,
    <Provider store={store}>
      <PostList {...props} />
    </Provider>,
  );
  const tableBody = enzymeWrapper.find(TableBody);

  t.is(tableBody.length, 1);
});


test('add post', async (t) => {
  const resolved = new Promise(r => r({
    data: {
      data: firstPost,
    },
  }));
  t.context.sandbox.stub(Axios, 'put').returns(resolved);
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  await props.addPost(firstPost);
  const actions = store.getActions();
  t.is(actions.length, 1);
  t.is(CREATE_POST_SUCCESS, _.head(actions).type);
});

test('delete post', async (t) => {
  const resolved = new Promise(r => r({
    data: {
      data: 'OK',
    },
  }));
  t.context.sandbox.stub(Axios, 'delete').returns(resolved);
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  await props.deletePost(firstPost);
  const actions = store.getActions();
  t.is(actions.length, 1);
  t.is(DELETE_POST_SUCCESS, _.head(actions).type);
});

test('reset error', (t) => {
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  props.resetErrorMessage();
  const actions = store.getActions();
  t.is(actions.length, 1);
  t.is(RESET_ERROR_MESSAGE, _.head(actions).type);
});

test('select post', (t) => {
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  props.selectPost();
  const actions = store.getActions();
  t.is(actions.length, 2);
  t.is(SELECT_POST, _.head(actions).type);
});
