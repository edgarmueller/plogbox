import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router';
import App from './App';

import { history } from '../store/configureStore';

const Root = ({ store }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path="/" component={App} />
    </ConnectedRouter>
  </Provider>
);

Root.propTypes = {
  store: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Root;
