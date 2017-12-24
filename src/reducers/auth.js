import {
  SIGN_UP_USER_FAILURE,
  USER_LOGIN_FAILURE,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_SUCCESS,
  USER_IS_LOGGING_IN,
  ACTIVATE_ACCOUNT_FAILURE,
  ACTIVATE_ACCOUNT_SUCCESS,
} from '../constants';

const INITIAL_STATE = {
  isAuthenticating: false,
  isAuthenticated: false,
  isAccountActivationSuccess: null,
  statusText: null,
  token: null,
  user: null,
  userId: null,
};

export const auth = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_IS_LOGGING_IN:
      return {
        isAuthenticating: true,
        isAuthenticated: false,
        statusText: null,
      };
    case USER_LOGIN_SUCCESS:
      return {
        isAuthenticating: false,
        isAuthenticated: action.token !== undefined,
        statusText: 'You have been logged in successfully.',
        status: action.status,
        token: action.token,
        user: action.user,
        userId: action.userId,
      };
    case ACTIVATE_ACCOUNT_SUCCESS:
      return {
        ...state,
        isAccountActivationSuccess: true,
      };
    case ACTIVATE_ACCOUNT_FAILURE:
      return {
        ...state,
        isAccountActivationSuccess: false,
      };
    case SIGN_UP_USER_FAILURE:
      return {
        isAuthenticating: false,
        isAuthenticated: false,
        statusText: action.statusText,
        status: action.status,
        token: null,
        user: null,
        userId: null,
      };
    case USER_LOGIN_FAILURE:
      return {
        isAuthenticating: false,
        isAuthenticated: false,
        isAccountActivationSuccess: state.isAccountActivationSuccess,
        statusText: action.statusText ? `An authentication error occurred: ${action.statusText}` : '',
        status: action.status,
        token: null,
        user: null,
        userId: null,
      };
    case USER_LOGOUT_SUCCESS:
      return {
        isAuthenticating: false,
        isAuthenticated: false,
        statusText: 'You have been logged out successfully.',
        status: action.status,
        token: null,
        user: null,
        userId: null,
      };
    default:
      return state;
  }
};


export const isAuthenticated = state => state.isAuthenticated;
export const getStatusText = state => state.statusText;

export default auth;
