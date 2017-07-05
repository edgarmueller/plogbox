import { createStore, applyMiddleware } from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';

import app from '../reducers';

const configureStore = () => {
  const middlewares = [thunk, routerMiddleware(browserHistory)];
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
  }
  return createStore(
    app,
    applyMiddleware(...middlewares),
  );
};

export default configureStore;
