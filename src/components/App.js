import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router';
import 'react-dates/initialize';
import 'typeface-roboto/index.css';

import Navigation from './NavBar';
import PostList from '../containers/PostListContainer';
import EditPostPage from '../pages/EditPostPage';
import NotFoundPage from '../pages/NotFoundPage';
import SignUpPage from '../pages/SignUpPage';
import LogbookPage from '../pages/LogbookPage';
import Login from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ChangePasswordPage from '../pages/ChangePasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import ActivateAccountPage from '../pages/ActivateAccountPage';
import { requireAuth } from '../auth';


const containerStyle = {
  width: '80%',
  margin: 'auto',
};

const ConnectedSwitch = connect(state => ({
  location: state.routing.location,
}))(Switch);

export const App = () => (
  <div className="app-container">
    <Navigation />
    <div id="container" style={containerStyle}>
      <ConnectedSwitch>
        <Route exact path="/" component={requireAuth(LogbookPage)} />
        <Route path="/logbook/:date" component={requireAuth(LogbookPage)} />
        <Route path="/sign-up" component={SignUpPage} />
        <Route path="/login" component={Login} />
        <Route path="/posts/:postId" component={requireAuth(EditPostPage)} />
        <Route path="/posts" component={requireAuth(PostList)} />
        <Route path="/profile" component={requireAuth(ProfilePage)} />
        <Route path="/password/reset/:token" component={ResetPasswordPage} />
        <Route path="/password/forgot" component={ForgotPasswordPage} />
        <Route path="/password/change" component={requireAuth(ChangePasswordPage)} />
        <Route path="/account/activate/:token" component={ActivateAccountPage} />
        <Route path="*" component={NotFoundPage} />
      </ConnectedSwitch>
    </div>
  </div>
);

const ConnectedApp = connect(
  state => ({ location: state.routing.location }),
)(App);

export default ConnectedApp;
