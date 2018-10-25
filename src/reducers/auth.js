import {
  AUTH_FAILURE,
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  AUTH_IN_PROGRESS,
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
    case AUTH_IN_PROGRESS:
      return {
        isAuthenticating: true,
        isAuthenticated: false,
      };
    case AUTH_SUCCESS:
      return {
        isAuthenticating: false,
        isAuthenticated: action.token !== undefined,
        token: action.token,
        user: action.user,
        userId: action.userId,
      };
    case AUTH_FAILURE:
      return {
        isAuthenticating: false,
        isAuthenticated: false,
        token: null,
        user: null,
        userId: null,
      };
    case AUTH_LOGOUT:
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
