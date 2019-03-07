import * as _ from 'lodash';
import {
  AUTH_LOGOUT,
  AUTH_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  FETCH_TAGS_FAILURE,
  FETCH_TAGS_REQUEST,
  FETCH_TAGS_SUCCESS,
  SELECT_POST,
  UNSELECT_POSTS,
} from '../constants';
import * as dropbox from '../api/dropbox';
import {getIsFetchingPosts} from '../reducers';

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

export const unselectPosts = () => ({
  type: UNSELECT_POSTS
});

export const selectPostsByTag = tag => (dispatch) => {
  dispatch({
    type: FETCH_POSTS_REQUEST
  });

  dropbox.fetchPosts(tag)
    .then((files) => {
      dispatch({
        type: FETCH_POSTS_SUCCESS,
        posts: files,
        tag
      });
    });
};

export const authSuccess = (token, user) => ({
  type: AUTH_SUCCESS,
  token,
  user
});

export const fetchTags = () => (dispatch) => {
  dispatch({
    type: FETCH_TAGS_REQUEST,
  });
  return dropbox.fetchTags()
    .then(
      (entries) => {
        dispatch({
          type: FETCH_TAGS_SUCCESS,
          tags: entries.map(entry => entry.name)
        });
      },
      error => dispatch({
        type: FETCH_TAGS_FAILURE,
        error: "An error occurred while fetching the tags"
      }),
    );
};
