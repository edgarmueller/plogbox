import test from 'ava';
import React from 'react';
import * as Immutable from 'immutable';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import { applyMiddleware, createStore } from 'redux';
import path from 'path';
import fakeProps from 'react-fake-props';
import EditPostView from '../../src/views/EditPostView';
import { afterEach, beforeEach, mountWithContext } from '../helpers/setup';
import { RESET_ERROR_MESSAGE } from '../../src/constants';
import { firstPost, posts } from '../helpers/posts';
import app from '../../src/reducers';

const componentPath = path.join(__dirname, '../../src/components/EditPostContainer.js');

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test.serial('should show error', (t) => {
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

  const enzymeWrapper = mountWithContext(t,
    <Provider store={store}>
      <EditPostView {...props} />
    </Provider>,
  );
  const dialog = enzymeWrapper.find(Dialog);
  t.is(dialog.length, 1);
});

test.serial('should not show error if error message has been reset', (t) => {
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

  store.dispatch({
    type: RESET_ERROR_MESSAGE,
  });

  const enzymeWrapper = mountWithContext(t,
    <Provider store={store}>
      <EditPostView {...props} />
    </Provider>,
  );
  const dialog = enzymeWrapper.find(Dialog);
  t.false(dialog.props().open);
});
