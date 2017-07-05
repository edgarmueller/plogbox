import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { UserAuthWrapper } from 'redux-auth-wrapper';
import { replace } from 'react-router-redux';

import App from '../components/App';
import SelectPostPage from '../components/SelectPost';
import CreateOrEditPostPage from '../views/EditPostView';
import NotFoundPage from '../views/NotFoundView';
import SignUpView from '../views/SignUpView';
import HomeView from '../views/HomeView';
import Login from '../views/LoginView';

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
    <Route path="posts" component={requireAuth(SelectPostPage)} />
    <Route path="posts/edit" component={requireAuth(CreateOrEditPostPage)} />
    <Route path="*" component={NotFoundPage} />
  </Route>
;
