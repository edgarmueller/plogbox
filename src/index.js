import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import dotenv from 'dotenv';

import configureStore from './store/configureStore';
import Root from './components/Root';
import registerServiceWorker from './registerServiceWorker';
import { DROPBOX_TOKEN_NAME, getUser, testToken } from './api/dropbox';
import { AUTH_FAILURE, AUTH_IN_PROGRESS, AUTH_SUCCESS } from './constants';

dotenv.config();

// ID of the DOM element to mount app on
const DOM_APP_EL_ID = 'root';
const store = configureStore();

const loadTokenFromStorage = (dispatch) => {
// eslint-disable-next-line no-console
  console.log('Checking for existing token...');
  dispatch({
    type: AUTH_IN_PROGRESS
  });

  const token = localStorage.getItem(DROPBOX_TOKEN_NAME);

  if (token) {
    testToken(token)
      .then((isValid) => {
        if (isValid) {
          getUser().then(user =>
            dispatch({
              type: AUTH_SUCCESS,
              token,
              user,
            }));
        } else {
          dispatch({
            type: AUTH_FAILURE
          });
        }
      });
  } else {
    dispatch({
      type: AUTH_FAILURE
    });
  }
};

// Render the router
const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      <Component store={store} />
    </AppContainer>,
    document.getElementById(DOM_APP_EL_ID),
  );
};

const init = (dispatch) => {
  registerServiceWorker();
  loadTokenFromStorage(dispatch);
  render(Root);
};

init(store.dispatch);

if (module.hot) {
  module.hot.accept('./components/Root', () => render(Root));
}
