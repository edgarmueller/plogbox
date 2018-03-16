import '../helpers/setup';
import auth from '../../src/reducers/auth';
import {
  USER_LOGIN_FAILURE,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_SUCCESS,
} from '../../src/constants';
import token from '../helpers/token';

test('login user successfully', () => {
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
  expect(after.user).toBe('foo@example.com');
  expect(after.token !== null).toBeTruthy();
});

test('login failure', () => {
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
  expect(after.isAuthenticating).toBeFalsy();
  expect(after.isAuthenticated).toBeFalsy();
  expect(after.statusText).toBe('An authentication error occurred: Not found.');
  expect(after.token).toBeNull();
  expect(after.user).toBeNull();
  expect(after.userId).toBeNull();
});

test('logout successfully', () => {
    // arrange
  const before = {
    isAuthenticating: false,
    isAuthenticated: true,
    statusText: undefined,
    token,
    user: 'foo@example.org',
    userId: 0,
  };

    // act
  const after = auth(before, {
    type: USER_LOGOUT_SUCCESS,
  });

  // assert
  expect(after.isAuthenticating).toBeFalsy();
  expect(after.isAuthenticated).toBeFalsy();
  expect(after.statusText).toBe(undefined);
  expect(after.token).toBeNull();
  expect(after.user).toBeNull();
  expect(after.userId).toBeNull();
});
