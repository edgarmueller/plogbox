import test from 'ava';
import React from 'react';
import Axios from 'axios';
import 'blob';
import * as Immutable from 'immutable';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ButtonBar, { mapDispatchToProps } from '../../src/components/ButtonBarContainer';
import { posts } from '../helpers/posts';
import { afterEach, beforeEach, mountWithContext } from '../helpers/setup';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test('ButtonBar should render', (t) => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });

  const resolved = new Promise(r => r({
    data: {
      data: posts,
    },
  }));
  t.context.sandbox.stub(Axios, 'get').returns(resolved);

  const enzymeWrapper = mountWithContext(
    t,
    <Provider store={store}>
      <ButtonBar />
    </Provider>,
  );

  const buttons = enzymeWrapper.find(FloatingActionButton);
  t.is(buttons.length, 2);
});

test('mapDispatchToProps', async (t) => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const props = mapDispatchToProps(store.dispatch);
  await props.exportPosts(posts);
  // should not fail
  t.pass();
});
