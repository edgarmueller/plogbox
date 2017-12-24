/* eslint-disable import/first */
import '../helpers/setup';
import * as _ from 'lodash';
import MockAdapter from 'axios-mock-adapter';
import Axios from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../../src/actions';
import {
  BASE_URL,
  SIGN_UP_USER_FAILURE,
  SIGN_UP_USER_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGIN_SUCCESS,
} from '../../src/constants';
import TOKEN from '../helpers/token';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test('login user', async () => {
  global.localStorage.setItem('token', TOKEN);
  const response = {
    data: {
      token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxLXVnZ3pMZFdCZ2N1VkxZXC8ySWpMXC93YkFrZlwvcGtzTmVjNXlQc0cxVm1ZYzNLMzFHV0drQllhbDVvOEdKNSs1SFNack5HdGhuQlA2b1BPNDF3bDhzb2lZVGo5dUVvckhJRG1QVWhsZz09Iiwicm9sZSI6ImFkbWluIiwiaXNzIjoiYmlseXRpYy1zaWxob3VldHRlIiwiZXhwIjoxNDgxMDQ1MjQ5LCJpYXQiOjE0ODEwMzgwNDksInVzZXJJZCI6MSwianRpIjoiMWQ0NzdjZmM5MGExNmY3OTdkYzhkZGZlYjA3OGM5OWM0YjQ3NTc1MzI2YjRkYjAyMDA5NTNhMWQxMDNmM2IxNTU2NWFlYzk5YzNiNDJiODBhNDBkYjAyMDMxMzRlMDY3NmVmNzI1MjkzMTYyYjIyMmVjZjI5OGRiOGYzMmNlYzUyYjMzMzM2ZDNjNDE4MmM2NDZmYmYzMWUzNTcwNjFkMGY1NDNhZWU1MjIzOWEzMmY5OTE0MzBiNjI2YjU0NGQ2MzY2ZDBmYmY3YzQ3NTkzYzA2MDZiZjgwZmM3NTMyNjNiYWRhZjk2YzMzZGFkZmEzZTRlNTAxYjhmOTk0YTZlMiIsImVtYWlsIjoiZm9vQGV4YW1wbGUuY29tIn0.SMM6335OdXnHvlfHLWQT57F_FBw19lUJ-cNFs6ohjE8',
    },
  };
  const mock = new MockAdapter(Axios);
  mock.onPost(`${BASE_URL}/sign-in`).reply(200, response);

  const store = mockStore({ });
  // TODO: token is read within login action
  await store.dispatch(
    actions.loginUser({
      email: 'foo@bar.com',
      password: 'password',
    }));
  const headAction = _.nth(store.getActions(), 1);
  expect(headAction.type).toBe(USER_LOGIN_SUCCESS);
});

test('login user failure', async () => {
  // const resolved = Promise.reject({});
  // t.context.sandbox.stub(Axios, 'post').returns(resolved);
  const response = {
    status: 'error',
  };
  const mock = new MockAdapter(Axios);
  mock.onPost(`${BASE_URL}/sign-in`).reply(403, response);
  const store = mockStore({ });
  // TODO: token is read within login action
  await store.dispatch(actions.loginUser({
    email: 'foo@bar.com',
    password: 'password',
  }));
  const headAction = _.nth(store.getActions(), 1);
  expect(headAction.type).toBe(USER_LOGIN_FAILURE);
});

test('errorHandler with data.statusText property set', () => {
  const store = mockStore({});
  actions.errorHandler(store.dispatch, {
    response: {
      data: {
        messages: ['This is an statusText.'],
      },
    },
  }, 'ERROR_TYPE');
  const storedActions = store.getActions();
  expect(_.head(storedActions)).toEqual({
    type: 'ERROR_TYPE',
    statusText: 'This is an statusText.',
  });
});

test('errorHandler with data property set', () => {
  const store = mockStore({});
  actions.errorHandler(store.dispatch, {
    response: {
      data: 'This is an statusText.',
    },
  }, 'ERROR_TYPE');
  const storedActions = store.getActions();
  expect(_.head(storedActions))
    .toEqual({
      type: 'ERROR_TYPE',
      statusText: 'This is an statusText.',
    });
});

test('register user', async () => {
  const response = {
    data: {
      statusText: 'success',
      data: {
        msg: 'Please check your inbox',
      },
    },
  };
  const mock = new MockAdapter(Axios);
  mock.onPost(`${BASE_URL}/sign-up`).reply(200, response);
  const store = mockStore({});
  await store.dispatch(actions.registerUser({
    email: 'foo@example.org',
    firstName: 'John',
    lastName: 'Doe',
    password: 'iliketacos',
  }));
  expect(_.head(store.getActions()))
    .toEqual({
      type: SIGN_UP_USER_SUCCESS,
    });
});

test('register user - statusText case', async () => {
  const response = {
    status: 'error',
    messages: ['An error occurred.'],
  };
  const mock = new MockAdapter(Axios);
  mock.onPost(`${BASE_URL}/sign-up`).reply(409, response);
  const store = mockStore({});
  await store.dispatch(actions.registerUser({
    email: 'foo@example.org',
    firstName: 'John',
    lastName: 'Doe',
    password: 'iliketacos',
  }));
  const headAction = _.head(store.getActions());
  expect(headAction).toEqual({
    type: SIGN_UP_USER_FAILURE,
    statusText: 'An error occurred.',
  });
});
