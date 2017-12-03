import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto/index.css';
import { AppContainer } from 'react-hot-loader';
import * as _ from 'lodash';

import './base.css';
import configureStore from './components/configureStore';
import Root from './components/Root';
import { selectPost } from './actions';
import { USER_LOGIN_SUCCESS, USER_LOGIN_FAILURE } from './constants';
import { testToken } from './api/index';
import registerServiceWorker from './registerServiceWorker';


// ID of the DOM element to mount app on
const DOM_APP_EL_ID = 'root';
const store = configureStore();

const loadTokenFromStorage = (dispatch) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem(('user'));

  if (token) {
    testToken(token)
      .then(
        (resp) => {
          if (_.isEmpty(resp.data.data)) {
            dispatch({
              type: USER_LOGIN_FAILURE,
            });
          } else {
            dispatch({
              type: USER_LOGIN_SUCCESS,
              token,
              user,
            });
          }
        },
        () => {
          dispatch({
            type: USER_LOGIN_FAILURE,
          });
        },
      );
  }
};

const loadSelectedPost = () => {
  const selectedPost = localStorage.getItem('selectedPost');
  if (selectedPost) {
    store.dispatch(selectPost(JSON.parse(selectedPost)));
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
  loadTokenFromStorage(dispatch);
  loadSelectedPost();
  render(Root);
  registerServiceWorker();
};

init(store.dispatch);

if (module.hot) {
  module.hot.accept('./components/Root', () => render(Root));
}
