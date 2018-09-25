import {
  USER_LOGIN_FAILURE,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_SUCCESS,
  USER_IS_LOGGING_IN,
} from '../constants';

const INITIAL_STATE = {
  isAuthenticating: false,
  isAuthenticated: false,
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
      };
    case USER_LOGIN_SUCCESS:
      return {
        isAuthenticating: false,
        isAuthenticated: action.token !== undefined,
        token: action.token,
        user: action.user,
        userId: action.userId,
      };
    case USER_LOGIN_FAILURE:
      return {
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        user: null,
        userId: null,
      };
    case USER_LOGOUT_SUCCESS:
      return {
        isAuthenticating: false,
        isAuthenticated: false,
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
