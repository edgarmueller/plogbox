import test from 'ava';
import auth from '../../src/reducers/auth';
import '../helpers/setup';
import { afterEach, beforeEach } from '../helpers/setup';
import { USER_LOGIN_SUCCESS } from '../../src/constants';
import token from '../helpers/token';
import { USER_LOGIN_FAILURE, USER_LOGOUT_SUCCESS } from '../../src/constants/index';

test.beforeEach(async t => await beforeEach(t));

test.afterEach(t => afterEach(t));

test.serial('login user successfully', (t) => {
    // arrange, make sure we have no token set
  localStorage.setItem('token', null);
  const before = {
    isAuthenticating: false,
    isAuthenticated: false,
    statusText: null,
    token: null,
    user: null,
    userId: null,
  };

    // act
  const after = auth(before, {
    type: USER_LOGIN_SUCCESS,
    token,
    user: 'foo@example.com',
    userId: 0,
  });

    // assert
  t.is(after.user, 'foo@example.com');
  t.true(after.token !== null);
});

test.serial('login failure', (t) => {
    // arrange
  const before = {
    isAuthenticating: false,
    isAuthenticated: false,
    statusText: null,
    token: null,
    user: null,
    userId: null,
  };

    // act
  const after = auth(before, {
    type: USER_LOGIN_FAILURE,
    status: 404,
    statusText: 'Not found.',
  });

    // assert
  t.is(after.isAuthenticating, false);
  t.is(after.isAuthenticated, false);
  t.is(after.statusText, 'An authentication error occurred: Not found.');
  t.is(after.token, null);
  t.is(after.user, null);
  t.is(after.userId, null);
});

test.serial('logout successfully', (t) => {
    // arrange
  const before = {
    isAuthenticating: false,
    isAuthenticated: true,
    statusText: 'You have been logged in successfully.',
    token,
    user: 'foo@example.org',
    userId: 0,
  };

    // act
  const after = auth(before, {
    type: USER_LOGOUT_SUCCESS,
  });

    // assert
  t.is(after.isAuthenticating, false);
  t.is(after.isAuthenticated, false);
  t.is(after.statusText, 'You have been logged out successfully.');
  t.is(after.token, null);
  t.is(after.user, null);
  t.is(after.userId, null);
});
