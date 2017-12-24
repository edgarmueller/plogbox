/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';
import React from 'react';
import Axios from 'axios';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import Dialog from 'material-ui/Dialog';
import { applyMiddleware, createStore } from 'redux';
import path from 'path';
import fakeProps from 'react-fake-props';
import EditPostContainer, { mapDispatchToProps } from '../../src/components/EditPostContainer';
import {
  FETCH_BLOCKS_SUCCESS,
  UPDATE_POST_TITLE,
  RESET_ERROR_MESSAGE,
  BASE_URL,
} from '../../src/constants';
import { firstPost, posts } from '../helpers/posts';
import app from '../../src/reducers/index';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const componentPath = path.join(__dirname, '../../src/components/EditPostContainer.js');

test('update title of a post', async () => {
  const store = mockStore({
    posts: {
      posts: {
        selectedPost: {
          title: 'Hey there!',
        },
      },
    },
  });
  const props = mapDispatchToProps(store.dispatch);
  props.updatePostTitle('Yo, wat up');
  const actions = store.getActions();
  expect(actions.length).toBe(1);
  expect(_.head(actions).type).toBe(UPDATE_POST_TITLE);
});

test('fetch blocks', async () => {
  const mock = new MockAdapter(Axios);
  const data = {
    data: [],
  };
  mock.onGet(`${BASE_URL}/api/posts/0/blocks`)
    .reply(200, data);
  const store = mockStore({
    posts: {
      posts: {
        selectedPost: firstPost,
      },
    },
  });
  const props = mapDispatchToProps(store.dispatch);
  await props.fetchBlocks(firstPost);
  const actions = store.getActions();
  expect(actions.length).toBe(1);
  expect(_.head(actions).type).toBe(FETCH_BLOCKS_SUCCESS);
});

test('should show error', () => {
  const mock = new MockAdapter(Axios);
  const data = {
    data: [],
  };
  mock.onGet(`${BASE_URL}/api/posts/0/blocks`)
    .reply(200, data);

  const props = fakeProps(componentPath);
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
      errorMessage: 'An error occurred',
    },
    blocks: {
      isFetchingBlock: false,
    },
    auth: {
      userId: 0,
    },
  });

  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <EditPostContainer
        {...props}
        selectedPost={firstPost}
      />
    </Provider>,
  );
  const dialog = enzymeWrapper.find(Dialog);
  expect(dialog.length).toBe(1);
});

test('should not show error if error message has been reset', () => {
  const props = fakeProps(componentPath);
  const store = createStore(
    app,
    {
      posts: {
        posts: {
          all: Immutable.Set(posts),
        },
        errorMessage: 'An error occurred',
      },
      auth: {
        userId: 0,
      },
    },
    applyMiddleware(thunk),
  );

  store.dispatch({
    type: RESET_ERROR_MESSAGE,
  });

  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <EditPostContainer
        {...props}
        selectedPost={firstPost}
      />
    </Provider>,
  );
  const dialog = enzymeWrapper.find(Dialog);
  expect(dialog.props().open).toBeFalsy();
});
