import React from 'react';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import lightBaseTheme from 'material-ui/styles/ baseThemes/lightBaseTheme';
// import getMuiTheme from 'material-ui/styles/createMuiTheme';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import PropTypes from 'prop-types';
import Routes from '../config/Routes';

const Root = ({ store }) => {
  const theme = createMuiTheme();
  const history = syncHistoryWithStore(browserHistory, store);
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router history={history}>
          {Routes}
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
};

Root.propTypes = {
  store: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default Root;
