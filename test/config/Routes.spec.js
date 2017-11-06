import test from 'ava';
import React from 'react';
import { createMemoryHistory, Router } from 'react-router';
import * as Immutable from 'immutable';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { afterEach, beforeEach, mountWithContext } from '../helpers/setup';
import Routes from '../../src/config/Routes';
import { PostList } from '../../src/components/PostList';
import { posts } from '../helpers/posts';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test.serial('renders SelectPostPage page', (t) => {
  const store = mockStore(
    {
      auth: {
        isAuthenticated: true,
      },
      posts: {
        posts: {
          all: Immutable.Set(posts),
        },
      },
    },
  );

  const history = createMemoryHistory('/posts');
  const wrapper = mountWithContext(t,
    <Provider store={store}>
      <Router history={history}>
        {Routes}
      </Router>
    </Provider>,
  );

  t.is(1, wrapper.find(PostList).length);
});
