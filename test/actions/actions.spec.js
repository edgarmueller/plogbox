import test from 'ava';
import * as _ from 'lodash';
import Axios from 'axios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../../src/actions';
import { afterEach, beforeEach } from '../helpers/setup';
import {
  SIGN_UP_USER_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGIN_SUCCESS,
} from '../../src/constants/index';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);


test.beforeEach(async t => beforeEach(t));

test.afterEach(t => afterEach(t));

test.serial('login user', async (t) => {
  const resolved = new Promise(r => r({ data: {
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxLXVnZ3pMZFdCZ2N1VkxZXC8ySWpMXC93YkFrZlwvcGtzTmVjNXlQc0cxVm1ZYzNLMzFHV0drQllhbDVvOEdKNSs1SFNack5HdGhuQlA2b1BPNDF3bDhzb2lZVGo5dUVvckhJRG1QVWhsZz09Iiwicm9sZSI6ImFkbWluIiwiaXNzIjoiYmlseXRpYy1zaWxob3VldHRlIiwiZXhwIjoxNDgxMDQ1MjQ5LCJpYXQiOjE0ODEwMzgwNDksInVzZXJJZCI6MSwianRpIjoiMWQ0NzdjZmM5MGExNmY3OTdkYzhkZGZlYjA3OGM5OWM0YjQ3NTc1MzI2YjRkYjAyMDA5NTNhMWQxMDNmM2IxNTU2NWFlYzk5YzNiNDJiODBhNDBkYjAyMDMxMzRlMDY3NmVmNzI1MjkzMTYyYjIyMmVjZjI5OGRiOGYzMmNlYzUyYjMzMzM2ZDNjNDE4MmM2NDZmYmYzMWUzNTcwNjFkMGY1NDNhZWU1MjIzOWEzMmY5OTE0MzBiNjI2YjU0NGQ2MzY2ZDBmYmY3YzQ3NTkzYzA2MDZiZjgwZmM3NTMyNjNiYWRhZjk2YzMzZGFkZmEzZTRlNTAxYjhmOTk0YTZlMiIsImVtYWlsIjoiZm9vQGV4YW1wbGUuY29tIn0.SMM6335OdXnHvlfHLWQT57F_FBw19lUJ-cNFs6ohjE8',
  } }));
  t.context.sandbox.stub(Axios, 'post').returns(resolved);
  const store = mockStore({ });
  // TODO: token is read within login action
  await store.dispatch(actions.loginUser({
    email: 'foo@bar.com',
    password: 'password',
  }));
  const headAction = _.head(store.getActions());
  t.is(USER_LOGIN_SUCCESS, headAction.type);
});

test.serial('login user failure', async (t) => {
  const resolved = Promise.reject({});
  t.context.sandbox.stub(Axios, 'post').returns(resolved);
  const store = mockStore({ });
  // TODO: token is read within login action
  await store.dispatch(actions.loginUser({
    email: 'foo@bar.com',
    password: 'password',
  }));
  const headAction = _.head(store.getActions());
  t.is(USER_LOGIN_FAILURE, headAction.type);
});

// test.serial("logout user - statusText case", async t => {
//     const resolved = Promise.reject({ });
//     t.context.sandbox.stub(Axios, 'post').returns(resolved);
//     const store = mockStore({ });
//     await store.dispatch(actions.logoutUser({
//         push: (noop) => {}
//     }));
//     t.deepEqual(_.head(store.getActions()), {
//         type: actions.UNAUTH_ERROR,
//         payload: "An unknown statusText occurred."
//     });
// });

test.serial('errorHandler with data.statusText property set', (t) => {
  const store = mockStore({});
  actions.errorHandler(store.dispatch, {
    response: {
      data: {
        messages: ['This is an statusText.'],
      },
    },
  }, 'ERROR_TYPE');
  const storedActions = store.getActions();
  t.deepEqual(_.head(storedActions), {
    type: 'ERROR_TYPE',
    statusText: 'This is an statusText.',
  });
});

test('errorHandler with data property set', (t) => {
  const store = mockStore({});
  actions.errorHandler(store.dispatch, {
    response: {
      data: 'This is an statusText.',
    },
  }, 'ERROR_TYPE');
  const storedActions = store.getActions();
  t.deepEqual(_.head(storedActions), {
    type: 'ERROR_TYPE',
    statusText: 'This is an statusText.',
  });
});

test.serial('register user', async (t) => {
  const resolved = new Promise(r => r({
    data: {
      statusText: 'success',
      data: {
        msg: 'Please check your inbox',
      },
    },
  }));
  t.context.sandbox.stub(Axios, 'post').returns(resolved);
  const store = mockStore({});
  await store.dispatch(actions.registerUser({
    email: 'foo@example.org',
    firstName: 'John',
    lastName: 'Doe',
    password: 'iliketacos',
  }));
  await store.dispatch(actions.logoutUser({
    push: (noop) => {},
  }));
  t.deepEqual(_.head(store.getActions()), {
    type: SIGN_UP_USER_SUCCESS,
  });
});

// test.serial("register user - statusText case", async t => {
//     const resolved = Promise.reject({ });
//     t.context.sandbox.stub(Axios, 'post').returns(resolved);
//     const store = mockStore({});
//     await store.dispatch(actions.registerUser({
//         email: "foo@example.org",
//         firstName: "John",
//         lastName: "Doe",
//         password: "iliketacos"
//     }));
//     await store.dispatch(actions.logoutUser({
//         push: (noop) => {}
//     }));
//     const headAction = _.head(store.getActions());
//     t.deepEqual(headAction, {
//         type: actions.SIGN_UP_USER_FAILURE,
//         payload: "An unknown statusText occurred.",
//     });
// });
