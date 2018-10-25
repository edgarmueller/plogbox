import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import { MuiThemeProvider } from 'material-ui';
import { createMuiTheme } from 'material-ui/styles';
import 'react-dates/initialize';
import NotFoundPage from '../pages/NotFoundPage';
import SignUpPage from '../pages/SignUpPage';
import ProfilePage from '../pages/ProfilePage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ActivateAccountPage from '../pages/ActivateAccountPage';
import { requireAuth } from '../auth';
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
    <div id="container">
      <ConnectedSwitch>
        <Route path="/sign-up" component={SignUpPage} />
        <Route path="/profile" component={requireAuth(ProfilePage)} />
        <Route path="/password/forgot" component={ForgotPasswordPage} />
        <Route path="/account/activate/:token" component={ActivateAccountPage} />
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
    </div>
  </MuiThemeProvider>
);

const ConnectedApp = connect(state => ({ location: state.routing.location }))(App);

export default ConnectedApp;
