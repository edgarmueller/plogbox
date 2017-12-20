/* eslint-disable import/first */
import { mountWithContext } from '../helpers/setup';
import React from 'react';
import { Provider } from 'react-redux';
import LoginFormContainer, { LoginForm } from '../../src/views/LoginView';
import { MemoryRouter } from 'react-router';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import MockAdapter from 'axios-mock-adapter';
import Axios from 'axios';
import { logoutUser } from '../../src/actions';
import { BASE_URL } from '../../src/constants';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

test('login form should render', async () => {
  const store = mockStore({
    auth: {
      isAuthenticated: false,
    },
  });
  const props = {
    handleSubmit() {
    },
  };
  const enzymeWrapper = mountWithContext(
    <Provider store={store}>
      <MemoryRouter>
        <LoginFormContainer {...props} />
      </MemoryRouter>
    </Provider>,
  );
  const fields = enzymeWrapper.find(LoginForm).length;
  expect(fields > 0).toBeTruthy();
});


test('login form should redirect when logging out', async () => {
  const store = mockStore({
    auth: {
      isAuthenticated: true,
    },
  });
  const props = {
    handleSubmit() {
    },
  };
  const response = {
    status: 'success',
  };
  const mock = new MockAdapter(Axios);
  mock.onPost(`${BASE_URL}/sign-out`).reply(200, response);
  mountWithContext(
    <Provider store={store}>
      <MemoryRouter>
        <LoginFormContainer {...props} />
      </MemoryRouter>
    </Provider>,
  );
  await store.dispatch(logoutUser());
  // there should be a redirect action to the login page
  // after the logout happened
  expect(store.getActions()[1].payload.args[0]).toBe('login');
});
