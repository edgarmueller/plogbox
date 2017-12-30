import * as _ from 'lodash';
import { routerActions } from 'react-router-redux';
import {
  CREATE_POST_FAILURE,
  CREATE_POST_SUCCESS,
  DELETE_POST_SUCCESS,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_BLOCKS_SUCCESS,
  SIGN_UP_USER_SUCCESS,
  SIGN_UP_USER_FAILURE,
  USER_LOGIN_FAILURE,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_SUCCESS,
  ADD_BLOCK,
  ADD_BLOCK_FAILURE,
  DELETE_POST_FAILURE,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  ADD_TAG_SUCCESS,
  ADD_TAG_FAILURE,
  DELETE_TAG_SUCCESS,
  DELETE_TAG_FAILURE,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  ERROR_PASSWORDS_DONT_DIFFER,
  ACTIVATE_ACCOUNT_SUCCESS,
  ACTIVATE_ACCOUNT_FAILURE,
  UPDATE_BLOCK_FAILURE,
  USER_IS_LOGGING_IN,
  SELECT_POST_BY_NAME_FAILURE, FETCH_BLOCKS_REQUEST, UPDATE_POST_REQUEST,
} from '../constants';
import * as api from '../api';
import { getIsFetchingPosts, getIsUpdatingPost } from '../reducers';

export function errorHandler(dispatch, error, type) {
  if (error === undefined) {
    dispatch({
      type,
      statusText: 'An unknown statusText occurred.',
    });
    return;
  }

  let errorMessage = '';
  const errorResponse = error.response;

  // TODO: clean up this mess
  if (errorResponse === undefined) {
    errorMessage = error.message;
  } else if (typeof errorResponse === 'string') {
    errorMessage = errorResponse;
  } else if (errorResponse.messages) {
    errorMessage = _.join(errorResponse.messages, '\n');
  } else if (errorResponse.data && errorResponse.data.messages) {
    errorMessage = _.join(errorResponse.data.messages, '\n');
  } else if (errorResponse.data && errorResponse.data.statusText) {
    errorMessage = errorResponse.data.statusText;
  } else if (errorResponse.data) {
    errorMessage = errorResponse.data;
  }


  if (errorResponse !== undefined && errorResponse.status === 401) {
    if (!_.isEmpty(localStorage.getItem('token'))) {
      // we had previously had a valid token
      dispatch({
        type: USER_LOGOUT_SUCCESS,
        statusText: 'Your token timed out. Please login again.',
      });
      localStorage.removeItem('token');
    } else {
      dispatch({
        type: USER_LOGIN_FAILURE,
        statusText: 'Your username or password is wrong.',
      });
    }
  } else {
    dispatch({
      type,
      statusText: errorMessage,
    });
  }
}

export const initPosts = posts => ({
  type: FETCH_POSTS_SUCCESS,
  posts,
});

export const findPostByName = postTitle => dispatch =>
  api.searchPost(postTitle)
    .then(
      (resp) => {
        if (resp.data.status === 'success') {
          return resp.data.data;
        }
        return undefined;
      },
      error => errorHandler(dispatch, error, SELECT_POST_BY_NAME_FAILURE),
    );

export const createPost = post => dispatch =>
  api.createPost(post)
    .then(
      (resp) => {
        const createdPost = resp.data.data;
        dispatch({
          type: CREATE_POST_SUCCESS,
          post: createdPost,
        });
        return createdPost;
      },
      (error) => {
        errorHandler(dispatch, error, CREATE_POST_FAILURE);
      },
    );

// TODO: selectedPost must contain blocks
export const updatePost = (selectedPost) => (dispatch, getState) => {

  if (getIsUpdatingPost(getState())) {
    return Promise.resolve();
  }

  dispatch({
    type: UPDATE_POST_REQUEST,
  });

  return api.updatePost(selectedPost)
    .then(
      resp =>
        dispatch({
          type: UPDATE_POST_SUCCESS,
          post: resp.data.data,
        }),
      error => errorHandler(dispatch, error, UPDATE_POST_FAILURE),
    );
};

export const deletePost = post => dispatch =>
  api.deletePost(post.id).then(
    dispatch({
      type: DELETE_POST_SUCCESS,
      post,
    }),
    error => errorHandler(dispatch, error, DELETE_POST_FAILURE),
  );

//
// Auth actions --
//
export const logoutUser = () => dispatch =>
  api.logoutUser()
    .then(
      (resp) => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({
          type: USER_LOGOUT_SUCCESS,
          statusText: 'You have logged out successfully.',
          status: resp.status,
        });
        dispatch(routerActions.push('login'));
      },
    );

/**
 * Action for signing up an user.
 *
 * @param signUpToken the sign-up token
 */
export const registerUser = signUpToken => dispatch =>
  api.registerUser(signUpToken)
    .then(
      () => {
        dispatch({
          type: SIGN_UP_USER_SUCCESS,
        });
        dispatch(routerActions.push('/'));
      },
      error => errorHandler(dispatch, error, SIGN_UP_USER_FAILURE),
    );


export const loginUser = ({ email, password }) => (dispatch) => {
  dispatch({
    type: USER_IS_LOGGING_IN,
  });
  // TODO  rememberMe can not be configured
  return api.loginUser(email, password, true)
    .then(
      (response) => {
        const {
          user,
          userId,
          token,
        } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', user);
        dispatch({
          type: USER_LOGIN_SUCCESS,
          token,
          user,
          userId,
        });
      },
      error => errorHandler(dispatch, error, USER_LOGIN_FAILURE),
    );
};

export const fetchPosts = () => (dispatch, getState) => {
  if (getIsFetchingPosts(getState())) {
    return Promise.resolve();
  }

  dispatch({
    type: FETCH_POSTS_REQUEST,
  });

  return api
    .fetchPosts()
    .then(
      resp => dispatch(initPosts(resp.data.data)),
      error => errorHandler(dispatch, error, FETCH_POSTS_FAILURE),
    );
};

export const addBlock = (postId, block) => dispatch =>
  api.addBlock(postId, block)
    .then(
      (resp) => {
        dispatch({
          type: ADD_BLOCK,
          block: resp.data.data,
        });
        return resp.data.data;
      },
      error => errorHandler(dispatch, error, ADD_BLOCK_FAILURE),
    );

export const addTag = (postId, tag) => dispatch =>
  api.addTag(postId, tag)
    .then(
      // TODO: response unused
      (resp) => {
        dispatch({
          type: ADD_TAG_SUCCESS,
          postId,
          tag: resp.data.data.tag,
        });
      },
      (error) => {
        errorHandler(dispatch, error, ADD_TAG_FAILURE);
      },
    );

export const removeTag = (postId, tagId) => dispatch =>
  api.removeTag(postId, tagId)
    .then(
      () => {
        dispatch({
          type: DELETE_TAG_SUCCESS,
          postId,
          tagId,
        });
      },
      (error) => {
        errorHandler(dispatch, error, DELETE_TAG_FAILURE);
      },
    );

export const forgotPassword = email => dispatch =>
  api.forgotPassword(email)
    .then(
      () => {
        dispatch({
          type: FORGOT_PASSWORD_SUCCESS,
        });
      },
      (error) => {
        errorHandler(dispatch, error, FORGOT_PASSWORD_FAILURE);
      },
    );

export const resetPassword = token => newPassword => dispatch =>
  api.resetPassword(token, newPassword)
    .then(
      () => {
        dispatch({
          type: RESET_PASSWORD_SUCCESS,
        });
      },
      error => errorHandler(dispatch, error, RESET_PASSWORD_FAILURE),
    );

export const changePassword = (currentPassword, newPassword) => (dispatch) => {
  if (currentPassword === newPassword) {
    dispatch({
      type: ERROR_PASSWORDS_DONT_DIFFER,
    });

    // TODO
    return;
  }

  api.changePassword(currentPassword, newPassword)
    .then(
      () => {
        dispatch({
          type: RESET_PASSWORD_SUCCESS,
        });
        dispatch(logoutUser());
      },
      error => errorHandler(dispatch, error, RESET_PASSWORD_FAILURE),
    );
};

export const activateAccount = token => dispatch =>
  api.activateAccount(token)
    .then(
      () => dispatch({ type: ACTIVATE_ACCOUNT_SUCCESS }),
      error => errorHandler(dispatch, error, ACTIVATE_ACCOUNT_FAILURE),
    );

export const downloadFile = (postId, fileId) => (dispatch) => {
  dispatch({
    type: FETCH_BLOCKS_REQUEST,
  });
  return api.download(postId, fileId)
    .then(
      resp => new Promise(
        (resolve, reject) => {
          const reader = new FileReader();
          const loadEnd = () => {
            dispatch({
              type: FETCH_BLOCKS_SUCCESS,
            });
            resolve(reader.result);
          };
          if (process.env.NODE_ENV === 'test') {
            reader.on('loadend', loadEnd);
          } else {
            reader.onloadend = loadEnd;
          }
          reader.readAsDataURL(resp.data);
        },
      ),
      error => errorHandler(dispatch, error, UPDATE_BLOCK_FAILURE),
    );
};

export const uploadFile = (postId, file) => api.upload(postId, file);

