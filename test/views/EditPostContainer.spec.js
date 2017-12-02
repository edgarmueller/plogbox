import test from 'ava';
import React from 'react';
import Axios from 'axios';
import * as Immutable from 'immutable';
import { shallow } from 'enzyme';
import * as _ from 'lodash';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import { applyMiddleware, createStore } from 'redux';
import path from 'path';
import fakeProps from 'react-fake-props';
import EditPost from '../../src/components/EditPost';
import { EditPostContainer, mapDispatchToProps } from '../../src/components/EditPostContainer';
import { afterEach, beforeEach, mountWithContext } from '../helpers/setup';

import {
  FETCH_BLOCKS_SUCCESS,
  UPDATE_POST_TITLE,
  RESET_ERROR_MESSAGE,
} from '../../src/constants';
import { firstPost, posts } from '../helpers/posts';
import app from '../../src/reducers/index';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const componentPath = path.join(__dirname, '../../src/components/EditPostContainer.js');

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test.serial('addBlock', async (t) => {
  const resolved = new Promise(r => r({
    data: {
      data: {
        dialect: 'markdown',
        text: '# some markdown text',
      },
    },
  }));
  t.context.sandbox.stub(Axios, 'put').returns(resolved);
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  await props.addBlock(1, 'markdown', '# some markdown text');
  const actions = store.getActions();
  t.is(actions.length, 1);
});

test.serial('update title of a post', async (t) => {
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
  t.is(actions.length, 1);
  t.is(UPDATE_POST_TITLE, _.head(actions).type);
});

test.serial('fetch blocks', async (t) => {
  const b = {
    id: 1,
    dialect: 'markdown',
    text: '# some markdown text',
  };
  const resolved = new Promise(r => r({
    data: {
      data: b,
    },
  }));
  t.context.sandbox.stub(Axios, 'get').returns(resolved);
  const selectedPost = {
    id: 1,
    title: 'Hey there!',
  };
  const store = mockStore({
    posts: {
      posts: {
        selectedPost,
      },
    },
  });
  const props = mapDispatchToProps(store.dispatch);
  await props.fetchBlocks(selectedPost);
  const actions = store.getActions();
  t.is(actions.length, 1);
  t.is(FETCH_BLOCKS_SUCCESS, _.head(actions).type);
});


test.serial('should show error', (t) => {
  const props = fakeProps(componentPath);
  const store = mockStore({
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
  });

  const enzymeWrapper = mountWithContext(t,
    <Provider store={store}>
      <EditPostContainer {...props} />
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
      <EditPostContainer {...props} />
    </Provider>,
  );
  const dialog = enzymeWrapper.find(Dialog);
  t.false(dialog.props().open);
});


test('container should render', (t) => {
  const props = fakeProps(componentPath);
  const resolved = new Promise(r => r({
    data: {
      data: { },
    },
  }));
  t.context.sandbox.stub(Axios, 'get').returns(resolved);
  const enzymeWrapper = shallow(<EditPostContainer {...props} />);
  const postPage = enzymeWrapper.find(EditPost);
  t.is(postPage.length, 1);
});
