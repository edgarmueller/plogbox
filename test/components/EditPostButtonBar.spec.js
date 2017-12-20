/* eslint-disable import/first */
import '../helpers/setup';
import MockAdapter from 'axios-mock-adapter';
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
import {
  ADD_BLOCK,
  BASE_URL,
  UPDATE_POST_FAILURE,
  UPDATE_POST_SUCCESS,
} from '../../src/constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const componentPath = path.join(__dirname, '../../src/components/EditPostButtonBar.js');

test('save post via save', async () => {
  const response = {
    data: {
      data: { status: 'success' },
    },
  };
  const mock = new MockAdapter(Axios);
  mock.onPost(`${BASE_URL}/api/posts/0`).reply(200, response);
  const store = mockStore({});
  const props = mapDispatchToProps(store.dispatch);
  await props.savePost(firstPost, [], undefined);
  expect(_.head(store.getActions()).type).toBe(UPDATE_POST_SUCCESS);
});

test('update post via save may fail', async () => {
  const response = {
    status: 'error',
  };
  const mock = new MockAdapter(Axios);
  mock.onPost(`${BASE_URL}/api/posts/0`).reply(403, response);
  const store = mockStore({ });
  const props = mapDispatchToProps(store.dispatch);
  await props.savePost(firstPost, []);
  const actions = store.getActions();
  expect(_.head(actions).type).toBe(UPDATE_POST_FAILURE);
});

test('add block', async () => {
  const response = {
    status: 'success',
  };
  const mock = new MockAdapter(Axios);
  mock.onPut(`${BASE_URL}/api/posts/0/blocks`).reply(200, response);
  const store = mockStore({ });
  const props = mapDispatchToProps(store.dispatch);
  await props.addBlock(firstPost.id, 'markdown', '## Heading');
  const actions = store.getActions();
  expect(_.head(actions).type).toBe(ADD_BLOCK);
});

test('render container', () => {
  const props = fakeProps(componentPath);
  const enzymeWrapper = shallow(
    <EditPostButtonBarContainer {...props} />,
  );
  const buttonBar = enzymeWrapper.find(EditPostButtonBar);
  expect(buttonBar.length).toBe(1);
});

test('trigger savePost', () => {
  const savePost = sinon.spy();
  const props = fakeProps(componentPath);
  const wrapper = shallow(
    <EditPostButtonBar
      {...props}
      savePost={savePost}
    />,
  );
  wrapper.find(IconButton).first().simulate('click');
  expect(savePost.calledOnce).toBeTruthy();
});

test('trigger savePost and exit', () => {
  const savePost = sinon.spy();
  const props = fakeProps(componentPath);
  const wrapper = shallow(
    <EditPostButtonBar
      {...props}
      savePost={savePost}
    />,
  );
  wrapper.find(IconButton).at(1).simulate('click');
  expect(savePost.calledOnce).toBeTruthy();
});

test('trigger exportPost', () => {
  const props = fakeProps(componentPath);
  const exportPost = sinon.spy();
  const wrapper = shallow(
    <EditPostButtonBar
      {...props}
      exportPost={exportPost}
    />,
  );
  wrapper.find(IconButton).at(2).simulate('click');
  expect(exportPost.calledOnce).toBeTruthy();
});

test('trigger importPost', () => {
  const props = fakeProps(componentPath);
  const importPost = sinon.spy();
  const wrapper = shallow(
    <EditPostButtonBar
      {...props}
      importPost={importPost}
    />,
  );
  wrapper.find(IconButton).at(3).simulate('click');
  expect(importPost.calledOnce).toBeTruthy();
});

test('trigger upload', () => {
  const props = fakeProps(componentPath);
  const upload = sinon.spy();
  const wrapper = shallow(
    <EditPostButtonBar
      {...props}
      upload={upload}
    />,
  );
  wrapper.find('input').first().simulate('change', { target: { files: [0] } });
  expect(upload.calledOnce).toBeTruthy();
});

