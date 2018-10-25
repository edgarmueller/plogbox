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
  AUTH_SUCCESS,
  AUTH_LOGOUT,
  DELETE_POST_FAILURE,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
  ADD_TAG_SUCCESS,
  ADD_TAG_FAILURE,
  DELETE_TAG_SUCCESS,
  DELETE_TAG_FAILURE,
  UPDATE_BLOCK_FAILURE,
  FETCH_BLOCKS_REQUEST,
  UPDATE_POST_REQUEST,
  FETCH_TAGS_REQUEST,
  FETCH_TAGS_SUCCESS,
  FETCH_TAGS_FAILURE,
  ADD_TAG_REQUEST,
  SELECT_POSTS_BY_TAG,
  SELECT_POST,
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
        type: AUTH_LOGOUT,
        statusText: 'Your token timed out. Please login again.',
      });
      localStorage.removeItem('token');
    } else {
      // dispatch({
      //   type: USER_LOGIN_FAILURE,
      //   statusText: 'Your username or password is wrong.',
      // });
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

export const selectPost = post => ({
  type: SELECT_POST,
  post,
});

export const selectPostsByTag = tag => ({
  type: SELECT_POSTS_BY_TAG,
  tag,
});

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
export const updatePost = selectedPost => (dispatch, getState) => {
  if (getIsUpdatingPost(getState())) {
    return Promise.resolve();
  }

  dispatch({
    type: UPDATE_POST_REQUEST,
  });

  return api.updatePost(selectedPost)
    .then(
      (resp) => {
        dispatch({
          type: UPDATE_POST_SUCCESS,
          post: resp.data.data,
        });
        return resp.data.data;
      },
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
export const logoutUser = () => (dispatch) => {
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({
      type: AUTH_LOGOUT,
    });
    dispatch(routerActions.push('login'));
  };

  // logout in any case
  return api.logoutUser().then(
    () => logout(),
    () => logout(),
  );
};

export const authSuccess = (token, user) => ({
  type: AUTH_SUCCESS,
  token,
  user
});

// export const loginUserWithToken = token => (dispatch) => {
//   return dispatch({
//     type: AUTH_SUCCESS,
//     token,
//     user: 'TODO user name',
//     userId: 'TODO user id'
//   });
// };
//
// export const loginUser = (email, password) => (dispatch) => {
//   dispatch({
//     type: AUTH_IN_PROGRESS,
//   });
//   // TODO  rememberMe can not be configured
//   return api.loginUser(email, password, true)
//     .then(
//       (response) => {
//         const {
//           user,
//           userId,
//           token,
//         } = response.data;
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', user);
//         dispatch({
//           type: AUTH_SUCCESS,
//           token,
//           user,
//           userId,
//         });
//         return undefined;
//       },
//       (error) => {
//         dispatch({
//           type: AUTH_FAILURE,
//         });
//         return error;
//       },
//     );
// };

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

export const addTagToPost = (postId, tag) => (dispatch) => {
  dispatch({
    type: ADD_TAG_REQUEST,
  });
  return api.addTagToPost(postId, tag)
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
};

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

export const downloadFile = (postId, fileId) => (dispatch) => {
  dispatch({
    type: FETCH_BLOCKS_REQUEST,
  });
  return api.download(postId, fileId)
    .then(
      resp => new Promise((resolve) => {
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
      }),
      error => errorHandler(dispatch, error, UPDATE_BLOCK_FAILURE),
    );
};

export const uploadFile = (postId, file) => api.upload(postId, file);


export const fetchTags = () => (dispatch) => {
  dispatch({
    type: FETCH_TAGS_REQUEST,
  });
  return api.fetchTags()
    .then(
      (resp) => {
        dispatch({
          type: FETCH_TAGS_SUCCESS,
          tags: resp.data.data.map(tag => tag.name),
        });
      },
      error => dispatch({
        type: FETCH_TAGS_FAILURE,
        error: error.response.data.messages.join(' '),
      }),
    );
};
