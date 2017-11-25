import test from 'ava';
import React from 'react';
import Axios from 'axios';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import { File } from 'file-api';
import 'jsdom/lib/jsdom';
import ButtonBar, { mapDispatchToProps } from '../../src/components/ButtonBarContainer';
import { firstPost, posts } from '../helpers/posts';
import { afterEach, beforeEach, mountWithContext, setupDom } from '../helpers/setup';
import { CREATE_POST_SUCCESS, EXPORT_POSTS_FAILURE } from '../../src/constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test.serial('ButtonBar should render', (t) => {
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

test.serial.cb('exportPosts via mapDispatchToProps', (t) => {
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
  setupDom(async () => {
    const props = mapDispatchToProps(store.dispatch);
    props.exportPosts(posts)
      .then((exportedPosts) => {
        t.is(exportedPosts.length, 1);
        t.end();
      });
  });
});

test.serial.cb('exportPosts via mapDispatchToProps fetch failure', (t) => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const resolved = Promise.reject({});
  t.context.sandbox.stub(Axios, 'get').returns(resolved);
  setupDom(async () => {
    const props = mapDispatchToProps(store.dispatch);
    props.exportPosts(posts)
      .then(() => {
        t.is(_.head(store.getActions()).type, EXPORT_POSTS_FAILURE);
        t.end();
      });
  });
});

test.serial.cb('importPosts via mapDispatchToProps', (t) => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const resolved = new Promise(r => r({
    data: {
      data: firstPost,
    },
  }));
  t.context.sandbox.stub(Axios, 'put').returns(resolved);
  const f = new File('test/exported-posts.json');
  setupDom(async () => {
    const props = mapDispatchToProps(store.dispatch);
    props.importPostsFromFile(f)
      .then(() => {
        t.is(_.head(store.getActions()).type, CREATE_POST_SUCCESS);
        t.end();
      });
  });
});
