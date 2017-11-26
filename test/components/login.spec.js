import test from 'ava';
import React from 'react';
import { reducer as formReducer } from 'redux-form';
import { Provider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { routerActions } from 'react-router-redux';

import authReducer from '../../src/reducers/auth';
import LoginFormContainer, { LoginForm } from '../../src/views/LoginView';

import { afterEach, beforeEach, mountWithContext } from '../helpers/setup';
import { USER_LOGOUT_SUCCESS } from '../../src/constants/index';

test.beforeEach(t => beforeEach(t));

test.afterEach(t => afterEach(t));

test.serial('login form should render', async (t) => {
  const store = createStore(combineReducers({ form: formReducer, auth: authReducer }));
  const props = {
    handleSubmit() {
    },
    isAuthenticated: false,
    location: {
      query: {
        redirect: '/',
      },
    },
  };
  const enzymeWrapper = mountWithContext(
        t,
    <Provider store={store}>
      <LoginFormContainer {...props} />
    </Provider>,
    );
  const fields = enzymeWrapper.find(LoginForm).length;
  t.true(fields > 0);
});

test.serial('login form should redirect', async (t) => {
  let didReplace = false;

  const store = createStore(combineReducers({ form: formReducer, auth: authReducer }), {
    auth: {
      isAuthenticated: true,
    },
  });
  const props = {
    handleSubmit() {
    },
    location: {
      query: {
        redirect: '/foo',
      },
    },
  };
    // TODO: replace returns with function body
  t.context.sandbox.stub(routerActions, 'replace').returns(didReplace = !didReplace);
  mountWithContext(
        t,
    <Provider store={store}>
      <LoginFormContainer {...props} />
    </Provider>,
    );
  t.true(didReplace);
});

test.serial('login form should redirect via UNAUTH', async (t) => {
  let didReplace = false;

  const store = createStore(combineReducers({ form: formReducer, auth: authReducer }), {
    auth: {
      isAuthenticated: true,
    },
  });
  const props = {
    handleSubmit() {
    },
    location: {
      query: {
        redirect: '/foo',
      },
    },
  };
    // TODO: replace returns with function body
  t.context.sandbox.stub(routerActions, 'replace').returns(didReplace = !didReplace);
  mountWithContext(
        t,
    <Provider store={store}>
      <LoginFormContainer {...props} />
    </Provider>,
    );
  store.dispatch({
    type: USER_LOGOUT_SUCCESS,
  });
  t.true(didReplace);
});
