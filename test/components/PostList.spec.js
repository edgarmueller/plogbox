/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';

import React from 'react';
import Axios from 'axios';
import * as _ from 'lodash';
import * as Immutable from 'immutable';
import configureMockStore from 'redux-mock-store';
import AxiosMockAdapter from 'axios-mock-adapter';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { TableBody } from 'material-ui/Table';
import PostList, { mapDispatchToProps } from '../../src/containers/PostListContainer';
import { firstPost, posts } from '../helpers/posts';
import {
  BASE_URL,
  CREATE_POST_SUCCESS,
  DELETE_POST_SUCCESS,
  RESET_ERROR_MESSAGE,
} from '../../src/constants/index';
import { MemoryRouter } from 'react-router';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test('PostListContainer should render', () => {
  const props = {
    posts,
    deletePost() {},
  };
  const response = {
    data: {
      data: posts,
    },
  };
  const mock = new AxiosMockAdapter(Axios);
  mock.onGet(`${BASE_URL}`).reply(200, response);
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });

  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <MemoryRouter>
        <PostList {...props} />
      </MemoryRouter>
    </Provider>,
  );
  const tableBody = enzymeWrapper.find(TableBody);
  expect(tableBody.length).toBe(1);
});


test('add post', async () => {
  const response = {
    data: {
      data: firstPost,
    },
  };
  const mock = new AxiosMockAdapter(Axios);
  mock.onPut(`${BASE_URL}/api/posts`).reply(200, response);
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  await props.addPost(firstPost);
  const actions = store.getActions();
  expect(actions.length).toBe(1);
  expect(_.head(actions).type).toBe(CREATE_POST_SUCCESS);
});

test('delete post', async () => {
  const response = {
    status: 'success',
  };
  const mock = new AxiosMockAdapter(Axios);
  mock.onDelete(`${BASE_URL}/api/posts/0`).reply(200, response);

  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  await props.deletePost(firstPost);
  const actions = store.getActions();
  expect(actions.length).toBe(1);
  expect(_.head(actions).type).toBe(DELETE_POST_SUCCESS);
});

test('reset error', () => {
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  props.resetErrorMessage();
  const actions = store.getActions();
  expect(actions.length).toBe(1);
  expect(_.head(actions).type).toBe(RESET_ERROR_MESSAGE);
});
