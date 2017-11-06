import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { UserAuthWrapper } from 'redux-auth-wrapper';
import { replace } from 'react-router-redux';

import App from '../components/App';
import PostList from '../components/PostListContainer';
import CreateOrEditPostView from '../views/EditPostView';
import NotFoundPage from '../views/NotFoundView';
import SignUpView from '../views/SignUpView';
import HomeView from '../views/HomeView';
import Login from '../views/LoginView';
import ProfileView from '../views/ProfileView';
import ForgotPasswordView from '../views/ForgotPasswordView';
import ChangePasswordView from '../views/ChangePasswordView';
import ResetPasswordView from '../views/ResetPasswordView';
import ActivateAccountView from '../views/ActivateAccountView';

// Redirects to /login by default
const requireAuth = UserAuthWrapper({
  authSelector: state => state.auth,
  predicate: auth => auth.isAuthenticated,
  redirectAction: replace,
  wrapperDisplayName: 'UserIsJWTAuthenticated',
});

export default
  <Route path="/" component={App}>
    <IndexRoute component={HomeView} />
    <Route path="sign-up" component={SignUpView} />
    <Route path="login" component={Login} />
    <Route path="posts" component={requireAuth(PostList)} />
    <Route path="posts/edit" component={requireAuth(CreateOrEditPostView)} />
    <Route path="profile" component={requireAuth(ProfileView)} />
    <Route path="password/reset/:token" component={ResetPasswordView} />
    <Route path="password/forgot" component={ForgotPasswordView} />
    <Route path="password/change" component={requireAuth(ChangePasswordView)} />
    <Route path="account/activate/:token" component={ActivateAccountView} />
    <Route path="*" component={NotFoundPage} />
  </Route>
;
