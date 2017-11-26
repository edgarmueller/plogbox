import test from 'ava';
import React from 'react';
import Axios from 'axios';
import * as _ from 'lodash';
import thunk from 'redux-thunk';
import { shallow } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import { IconButton } from 'material-ui';
import path from 'path';
import fakeProps from 'react-fake-props';
import sinon from 'sinon';
import { EditPostButtonBarContainer, mapDispatchToProps } from '../../src/components/EditPostButtonBarContainer';
import EditPostButtonBar from '../../src/components/EditPostButtonBar';
import { firstPost } from '../helpers/posts';
import { afterEach, beforeEach } from '../helpers/setup';
import { ADD_BLOCK, UPDATE_POST_FAILURE } from '../../src/constants/index';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const componentPath = path.join(__dirname, '../../src/components/EditPostButtonBar.js');

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
  const props = fakeProps(componentPath);
  const enzymeWrapper = shallow(
    <EditPostButtonBarContainer {...props} />,
  );
  const buttonBar = enzymeWrapper.find(EditPostButtonBar);
  t.is(buttonBar.length, 1);
});

test('trigger savePost', (t) => {
  const savePost = sinon.spy();
  const props = fakeProps(componentPath);
  const wrapper = shallow(
    <EditPostButtonBar
      {...props}
      savePost={savePost}
    />,
  );
  wrapper.find(IconButton).first().simulate('click');
  t.true(savePost.calledOnce);
});

test('trigger savePost and exit', (t) => {
  const savePost = sinon.spy();
  const props = fakeProps(componentPath);
  const wrapper = shallow(
    <EditPostButtonBar
      {...props}
      savePost={savePost}
    />,
  );
  wrapper.find(IconButton).at(1).simulate('click');
  t.true(savePost.calledOnce);
});

test('trigger exportPost', (t) => {
  const props = fakeProps(componentPath);
  const exportPost = sinon.spy();
  const wrapper = shallow(
    <EditPostButtonBar
      {...props}
      exportPost={exportPost}
    />,
  );
  wrapper.find(IconButton).at(2).simulate('click');
  t.true(exportPost.calledOnce);
});

test('trigger importPost', (t) => {
  const props = fakeProps(componentPath);
  const importPost = sinon.spy();
  const wrapper = shallow(
    <EditPostButtonBar
      {...props}
      importPost={importPost}
    />,
  );
  wrapper.find(IconButton).at(3).simulate('click');
  t.true(importPost.calledOnce);
});

test('trigger upload', (t) => {
  const props = fakeProps(componentPath);
  const upload = sinon.spy();
  const wrapper = shallow(
    <EditPostButtonBar
      {...props}
      upload={upload}
    />,
  );
  wrapper.find('input').first().simulate('change', { target: { files: [0] } });
  t.true(upload.calledOnce);
});

