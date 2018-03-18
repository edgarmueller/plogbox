import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux';

import app from '../reducers';

export const history = createHistory();

const configureStore = () => {
  const middlewares = [thunk, routerMiddleware(history)];
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(logger);
  }
  return createStore(
    app,
    applyMiddleware(...middlewares),
  );
};

export default configureStore;
