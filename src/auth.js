import _ from 'lodash';
import locationHelperBuilder from 'redux-auth-wrapper/history4/locationHelper';
import { connectedRouterRedirect } from 'redux-auth-wrapper/history4/redirect';
import Loading from './components/Loading';

const locationHelper = locationHelperBuilder({});

const userIsAuthenticatedDefaults = {
  authenticatedSelector: state => state.auth.isAuthenticated,
  authenticatingSelector: state => state.auth.isAuthenticating,
  wrapperDisplayName: 'UserIsJWTAuthenticated',
};

export const requireAuth = connectedRouterRedirect({
  ...userIsAuthenticatedDefaults,
  redirectPath: '/login',
  AuthenticatingComponent: Loading,
});

const userIsNotAuthenticatedDefaults = {
  // Want to redirect the user when they are done loading and authenticated
  authenticatedSelector: state =>
    _.isEmpty(state.auth.isAuthenticated) && state.auth.isLoading === false,
  wrapperDisplayName: 'UserIsNotJWTAuthenticated',
};

export const userIsNotAuthenticatedRedir = connectedRouterRedirect({
  ...userIsNotAuthenticatedDefaults,
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/posts',
  allowRedirectBack: false,
});
