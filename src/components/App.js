import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import NotFoundPage from '../pages/NotFoundPage';
import DropboxReceiver from './DropboxReceiver';
import MainPage from '../pages/MainPage';

const theme = createMuiTheme({
  mixins: {
    toolbar: {
      minHeight: '48px',
    },
  },
});

const ConnectedSwitch = connect(state => ({
  location: state.routing.location,
}))(Switch);


export const App = () => (
  <MuiThemeProvider theme={theme}>
      <ConnectedSwitch>
        <Route
          exact
          path="/auth"
          component={DropboxReceiver}
        />
        <Route
          exact
          path="/auth/success"
          render={() => <div>Successfully authorized Dropbox!</div>}
        />
        <Route path="/" component={MainPage} />
        <Route path="*" component={NotFoundPage} />
      </ConnectedSwitch>
  </MuiThemeProvider>
);

const ConnectedApp = connect(state => ({ location: state.routing.location }))(App);

export default ConnectedApp;
