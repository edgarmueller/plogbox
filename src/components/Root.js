import React from 'react';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'react-router-redux';
import { Route } from 'react-router';
import App from './App';

// TODO
import { history } from '../store/configureStore';

const Root = ({ store }) => {
  const theme = createMuiTheme();
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Route path="/" component={App} />
        </ConnectedRouter>
      </Provider>
    </MuiThemeProvider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Root;
