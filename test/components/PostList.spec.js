import test from 'ava';
import React from 'react';
import Axios from 'axios';
import * as Immutable from 'immutable';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { TableBody } from 'material-ui/Table';
import PostListContainer from '../../src/components/PostListContainer';
import { posts } from '../helpers/posts';
import { afterEach, beforeEach, mountWithContext } from '../helpers/setup';

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
      <PostListContainer {...props} />
    </Provider>,
  );
  const tableBody = enzymeWrapper.find(TableBody);

  t.is(tableBody.length, 1);
});
