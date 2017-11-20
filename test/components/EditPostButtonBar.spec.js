import test from 'ava';
import React from 'react';
import Axios from 'axios';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { IconButton } from 'material-ui';
import EditPostButtonBarContainer, { mapDispatchToProps } from '../../src/components/EditPostButtonBarContainer';
import EditPostButtonBar from '../../src/components/EditPostButtonBar';
import { firstPost, posts } from '../helpers/posts';
import { afterEach, beforeEach, mountWithContext } from '../helpers/setup';
import { ADD_BLOCK, UPDATE_POST_FAILURE } from '../../src/constants/index';

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
  t.is(_.head(actions).type, UPDATE_POST_FAILURE);
});

test.serial('update post may fail if post exists', async (t) => {
  const resolved = Promise.reject({});
  t.context.sandbox.stub(Axios, 'post').returns(resolved);
  const store = mockStore({ });
  const props = mapDispatchToProps(store.dispatch);
  await props.savePost(firstPost, []);
  const actions = store.getActions();
  t.is(_.head(actions).type, UPDATE_POST_FAILURE);
});


test.serial('add block', async (t) => {
  const resolved = new Promise(r => r({
    data: {
      data: { },
    },
  }));
  t.context.sandbox.stub(Axios, 'put').returns(resolved);
  const store = mockStore({ });
  const props = mapDispatchToProps(store.dispatch);
  await props.addBlock(firstPost.id, 'markdown', '## Heading');
  const actions = store.getActions();
  t.is(_.head(actions).type, ADD_BLOCK);
});

test('render container', (t) => {
  const store = mockStore({
    posts: {
      posts: {
        all: Immutable.Set(posts),
      },
    },
  });
  const enzymeWrapper = mountWithContext(t,
    <Provider store={store}>
      <EditPostButtonBarContainer />
    </Provider>,
  );
  const iconButtons = enzymeWrapper.find(IconButton);
  t.is(iconButtons.length, 4);
});

test('trigger savePost', (t) => {
  let didSave = false;
  const wrapper = shallow(<EditPostButtonBar savePost={() => { didSave = true; }} />);
  wrapper.find(IconButton).first().simulate('click');
  t.true(didSave);
});

test('trigger savePost and exit', (t) => {
  let didSave = false;
  const wrapper = shallow(<EditPostButtonBar savePost={() => { didSave = true; }} />);
  wrapper.find(IconButton).at(1).simulate('click');
  t.true(didSave);
});

test('trigger exportPost', (t) => {
  let didExport = false;
  const wrapper = shallow(<EditPostButtonBar exportPost={() => { didExport = true; }} />);
  wrapper.find(IconButton).at(2).simulate('click');
  t.true(didExport);
});

test('trigger importPost', (t) => {
  let importPost = false;
  const wrapper = shallow(<EditPostButtonBar importPost={() => { importPost = true; }} />);
  wrapper.find(IconButton).at(3).simulate('click');
  t.true(importPost);
});

test('trigger upload', (t) => {
  let didUpload = false;
  const wrapper = shallow(<EditPostButtonBar upload={() => { didUpload = true; }} />);
  wrapper.find('input').first().simulate('change', { target: { files: [0] } });
  t.true(didUpload);
});

