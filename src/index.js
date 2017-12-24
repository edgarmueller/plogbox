import React from 'react';
import * as _ from 'lodash';
import ReactDOM from 'react-dom';
import 'typeface-roboto/index.css';
import { AppContainer } from 'react-hot-loader';
import * as routerActions from 'react-router-redux';

import './base.css';
import configureStore from './components/configureStore';
import Root from './components/Root';
import { USER_LOGIN_SUCCESS, USER_LOGIN_FAILURE } from './constants';
import { testToken } from './api/index';
import registerServiceWorker from './registerServiceWorker';
import {fetchPosts} from "./actions";


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
            statusText: 'You need to login',
          });
        },
      );
  }

  return token;
};

const loadSelectedPost = () => {
  const selectedPostId = localStorage.getItem('selectedPostId');
  if (selectedPostId) {
    console.log('loadSelectedPost', selectedPostId);
    store.dispatch(routerActions.push(`/posts/${selectedPostId}`));
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
  const token = loadTokenFromStorage(dispatch);
  if (token) {
    dispatch(fetchPosts())
      .then(
        () => {
          render(Root);
          loadSelectedPost();
        }
      )
  } else {
    render(Root);
  }
};

init(store.dispatch);

if (module.hot) {
  module.hot.accept('./components/Root', () => render(Root));
}
