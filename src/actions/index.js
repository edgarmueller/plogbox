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
  SELECT_POST,
  SIGN_UP_USER_SUCCESS,
  SIGN_UP_USER_FAILURE,
  UPDATE_BLOCK_DIALECT,
  UPDATE_BLOCK_TEXT,
  UPDATE_POST_TITLE,
  USER_LOGIN_FAILURE,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_SUCCESS,
  REMOVE_BLOCK_SUCCESS,
  ADD_BLOCK,
  ADD_BLOCK_FAILURE,
  REMOVE_BLOCK_FAILURE,
  FETCH_BLOCKS_FAILURE,
  DELETE_POST_FAILURE,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  MOVE_BLOCK_UP,
  MOVE_BLOCK_DOWN,
} from '../constants/index';
import * as api from '../api';
import { getIsFetchingPosts } from '../reducers';

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
    dispatch({
      type: USER_LOGOUT_SUCCESS,
      statusText: 'Your token timed out. Please login again.',
    });
  } else {
    dispatch({
      type,
      statusText: errorMessage,
    });
  }
}


//
// Data source actions --
//
export const initPosts = posts => ({
  type: FETCH_POSTS_SUCCESS,
  posts,
});

export const selectPost = (post) => {
  localStorage.setItem('selectedPost', JSON.stringify(post));
  return {
    type: SELECT_POST,
    post,
  };
};

export const createPost = post => (dispatch) => {
  api.createPost(post)
    .then(
      (resp) => {
        dispatch({
          type: CREATE_POST_SUCCESS,
          post: resp.data.data,
        });
      },
      (error) => {
        errorHandler(dispatch, error, CREATE_POST_FAILURE);
      },
    );
};

export const updatePost = (selectedPost, blocks) => (dispatch) => {
  // TODO: update only changed blocks
  blocks.forEach((block) => {
    api.updateBlock(selectedPost.id, block);
  });

  return api.updatePost(selectedPost)
    .then(
      (resp) => {
        dispatch({
          type: UPDATE_POST_SUCCESS,
          post: resp.data.data,
        });
        dispatch(routerActions.push('/posts'));
      },
      (error) => {
        errorHandler(dispatch, error, UPDATE_POST_FAILURE);
      },
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
export const logoutUser = () => (dispatch) => {
  api.logoutUser()
    .then(
      (resp) => {
        localStorage.removeItem('token');
        dispatch({
          type: USER_LOGOUT_SUCCESS,
          statusText: 'You have logged out successfully.',
          status: resp.status,
        });
        dispatch(routerActions.push('login'));
      },
    );
};


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
      },
      error => errorHandler(dispatch, error, SIGN_UP_USER_FAILURE),
    );


export const loginUser = ({ email, password }) => dispatch =>
// TODO  rememberMe can not be configured
  api.loginUser(email, password, true)
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
      (error) => {
        errorHandler(dispatch, error, USER_LOGIN_FAILURE);
      },
    );

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
      (resp) => {
        dispatch(initPosts(resp.data.data));
      },
      (error) => {
        errorHandler(dispatch, error, FETCH_POSTS_FAILURE);
      },
    );
};

export const fetchBlocks = selectedPost => dispatch =>
  api.fetchBlocks(selectedPost.id)
    .then(
      (resp) => {
        dispatch({
          type: FETCH_BLOCKS_SUCCESS,
          postId: selectedPost.id,
          blocks: resp.data.data,
        });
      },
      error => errorHandler(dispatch, error, FETCH_BLOCKS_FAILURE),
    );

export const updateBlockText = (block, text) => ({
  type: UPDATE_BLOCK_TEXT,
  block,
  text,
});

export const updateBlockDialect = (block, dialect) => ({
  type: UPDATE_BLOCK_DIALECT,
  block,
  dialect,
});

export const updatePostTitle = title => ({
  type: UPDATE_POST_TITLE,
  title,
});

export const addBlock = (postId, block) => dispatch =>
  api.addBlock(postId, block)
    .then(
      (resp) => {
        dispatch({
          type: ADD_BLOCK,
          block: resp.data.data,
        });
      },
      (error) => {
        errorHandler(dispatch, error, ADD_BLOCK_FAILURE);
      },
    );

export const removeBlock = (postId, block) => dispatch =>
  api.removeBlock(postId, block)
    .then(
      (resp) => {
        // TODO: write test that expects blockId in response
        dispatch({
          type: REMOVE_BLOCK_SUCCESS,
          blockId: resp.data.data.blockId,
        });
      },
      (error) => {
        errorHandler(dispatch, error, REMOVE_BLOCK_FAILURE);
      },
    );

export const moveBlockUp = block => ({
  type: MOVE_BLOCK_UP,
  block,
});

export const moveBlockDown = block => ({
  type: MOVE_BLOCK_DOWN,
  block,
});
