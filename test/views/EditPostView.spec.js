/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';
import React from 'react';
import * as Immutable from 'immutable';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import { applyMiddleware, createStore } from 'redux';
import path from 'path';
import fakeProps from 'react-fake-props';
import EditPostView from '../../src/views/EditPostView';
import { RESET_ERROR_MESSAGE } from '../../src/constants';
import { firstPost, posts } from '../helpers/posts';
import app from '../../src/reducers';
import { MemoryRouter } from 'react-router';
import configureMockStore from 'redux-mock-store';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const componentPath = path.join(__dirname, '../../src/components/EditPostContainer.js');

test('should show error', () => {
  const props = fakeProps(componentPath);
  const store = createStore(
    app,
    {
      posts: {
        posts: {
          all: Immutable.Set(posts),
          selectedPost: firstPost,
        },
        errorMessage: 'An error occurred',
      },
      auth: {
        userId: 0,
      },
    },
    applyMiddleware(thunk),
  );

  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <MemoryRouter>
        <EditPostView {...props} />
      </MemoryRouter>
    </Provider>,
  );
  const dialog = enzymeWrapper.find(Dialog);
  expect(dialog.length).toBe(1);
});

test('should not show error if error message has been reset', () => {
  const props = fakeProps(componentPath);
  const store = mockStore(
    {
      posts: {
        posts: {
          all: Immutable.Set(posts),
          selectedPost: firstPost,
        },
        errorMessage: 'An error occurred',
      },
      blocks: {
        blocks: Immutable.List(),
      },
      auth: {
        userId: 0,
      },
    },
  );

  store.dispatch({
    type: RESET_ERROR_MESSAGE,
  });

  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <MemoryRouter>
        <EditPostView {...props} />
      </MemoryRouter>
    </Provider>,
  );
  const dialog = enzymeWrapper.find(Dialog);
  expect(dialog.props().open).toBeTruthy();
});
