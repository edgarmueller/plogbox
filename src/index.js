import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
// import 'babel-polyfill';

import configureStore from './components/configureStore';
import Root from './components/Root';
import { selectPost } from './actions';
import { USER_LOGIN_SUCCESS } from './constants';

require('roboto-fontface');


// ID of the DOM element to mount app on
const DOM_APP_EL_ID = 'root';
const store = configureStore();

const loadTokenFromStorage = (dispatch) => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem(('user'));
  if (token) {
    dispatch({
      type: USER_LOGIN_SUCCESS,
      token,
      user,
    });
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
        document.getElementById(DOM_APP_EL_ID));
};

const init = (dispatch) => {
  loadTokenFromStorage(dispatch);
  loadSelectedPost();
  render(Root);
};

init(store.dispatch);

if (module.hot) {
  module.hot.accept('./components/Root', () => render(Root));
}
