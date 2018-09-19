/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';
import React from 'react';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';
import { TextField } from 'material-ui';
import auth from '../../src/reducers/auth';
import SignUpPage from '../../src/pages/SignUpPage';

test('Sign-up page should render', async () => {
  let promiseResolve;
  const promise = new Promise((resolve) => {
    promiseResolve = resolve;
  });
  let fields = 0;
  const store = createStore(combineReducers({ auth }));
  const props = {
    handleSubmit() {
    },
    isAuthenticated: false,
  };
  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <SignUpPage {...props} />
    </Provider>,
  );
  fields = enzymeWrapper.find(TextField).length;
  promiseResolve();
  await promise;
  expect(fields > 0).toBeTruthy();
});
