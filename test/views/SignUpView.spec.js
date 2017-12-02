import test from 'ava';
import React from 'react';
import { Field, reducer as formReducer } from 'redux-form';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import auth from '../../src/reducers/auth';
import SignUpPage from '../../src/views/SignUpView';

import { mountWithContext, setupDom } from '../helpers/setup';

test.serial('Sign-up page should render', async (t) => {
  let promiseResolve;
  const promise = new Promise((resolve) => {
    promiseResolve = resolve;
  });
  let fields = 0;
  setupDom(() => {
    const store = createStore(combineReducers({ form: formReducer, auth }));
    const props = {
      handleSubmit() {
      },
      isAuthenticated: false,
    };
    const enzymeWrapper = mountWithContext(
      t,
      <Provider store={store}>
        <SignUpPage {...props} />
      </Provider>,
    );
    fields = enzymeWrapper.find(Field).length;
    promiseResolve();
  });
  await promise;
  t.true(fields > 0);
});
