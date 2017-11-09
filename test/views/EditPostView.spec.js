import test from 'ava';
import React from 'react';
import Axios from 'axios';
import * as Immutable from 'immutable';
import { shallow } from 'enzyme';
import * as _ from 'lodash';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { EditPostView, EditPostPageContainer, mapDispatchToProps } from '../../src/views/EditPostView';
import { firstPost } from '../helpers/posts';
import { afterEach, beforeEach } from '../helpers/setup';
import {
  FETCH_BLOCKS_SUCCESS,
  UPDATE_POST_FAILURE,
  UPDATE_POST_TITLE,
  UPDATE_BLOCK_DIALECT,
  UPDATE_BLOCK_TEXT,
} from '../../src/constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test.serial('create post via save', (t) => {
  const resolved = new Promise(r => r({
    data: {
      data: { },
    },
  }));
  let didPut = false;
  t.context.sandbox.stub(Axios, 'post', () => {
    didPut = true;
    return resolved;
  });
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  props.savePost(firstPost, [], undefined);
  t.true(didPut);
});

test.serial('update post via save', async (t) => {
  const resolved = new Promise(r => r({
    data: {
      data: { },
    },
  }));
  let didPost = false;
  t.context.sandbox.stub(Axios, 'post', () => {
    didPost = true;
    return resolved;
  });
  const store = mockStore({ });
  const props = mapDispatchToProps(store.dispatch);
    // set id to trigger update
  const clonedDataSource = _.clone(firstPost);
  clonedDataSource.id = 0;
  await props.savePost(clonedDataSource, [firstPost], undefined);
  t.true(didPost);
});

test.serial('update post may fail if post exists', async (t) => {
  const resolved = Promise.reject({});
  t.context.sandbox.stub(Axios, 'post').returns(resolved);
  const store = mockStore({ });
  const props = mapDispatchToProps(store.dispatch);
  await props.savePost(firstPost, []);
  const actions = store.getActions();
  t.is(
    _.head(actions).type,
    UPDATE_POST_FAILURE,
  );
});

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

test.serial('create post via save may fail', async (t) => {
  const resolved = Promise.reject({
    statusText: 'error',
    messages: ['expected'],
  });
  t.context.sandbox.stub(Axios, 'post').returns(resolved);
  const store = mockStore({ });
  const props = mapDispatchToProps(store.dispatch);
  await props.savePost(firstPost, []);
  const actions = store.getActions();
  t.is(
    _.head(actions).type,
    UPDATE_POST_FAILURE,
  );
});

test('should render', (t) => {
  const props = {
    fetchBlocks() { return []; },
  };

  const resolved = new Promise(r => r({
    data: {
      data: { },
    },
  }));
  t.context.sandbox.stub(Axios, 'get').returns(resolved);
  const enzymeWrapper = shallow(<EditPostPageContainer {...props} />);
  const postPage = enzymeWrapper.find(EditPostView);
  t.is(postPage.length, 1);
});
