import * as _ from 'lodash';
import * as Immutable from 'immutable';
import { combineReducers } from 'redux';
import { createFetchingProgressReducer } from './common';
import {
  ADD_TAG_FAILURE,
  ADD_TAG_SUCCESS,
  CREATE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  DELETE_POST_SUCCESS,
  DELETE_TAG_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  RESET_ERROR_MESSAGE,
  SELECT_POST_BY_NAME_FAILURE,
  UPDATE_POST_FAILURE,
  UPDATE_POST_TITLE,
  USER_LOGIN_FAILURE,
} from '../constants';

export const postsReducer = (state = {
  all: Immutable.List(),
}, action) => {
  switch (action.type) {
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        all: Immutable.List(action.posts),
      };

    case CREATE_POST_SUCCESS:
      return {
        ...state,
        all: state.all.push(action.post),
      };

    case DELETE_POST_SUCCESS: {
      const index = state.all.indexOf(action.post);
      if (index === -1) {
        return state;
      }
      return {
        ...state,
        all: state.all.delete(index),
      };
    }

    case UPDATE_POST_TITLE: {
      const clonedEditPost = _.clone(state.selectedPost);
      clonedEditPost.title = action.title;
      return {
        ...state,
        selectedPost: clonedEditPost,
      };
    }

    // TODO: add test for duplicate tag
    case ADD_TAG_SUCCESS:
      return {
        ...state,
        all: state.all.map((post) => {
          if (post.id === action.postId) {
            const clone = _.clone(post);
            if (clone.tags === undefined) {
              clone.tags = [];
            }
            clone.tags.push(action.tag);
            return clone;
          }
          return post;
        }),
      };

    case DELETE_TAG_SUCCESS: {
      const postIdx = state.all.findIndex(p => p.id === action.postId);
      const tags = state.all.get(postIdx).tags;
      return {
        ...state,
        all: state.all.update(postIdx, (post) => {
          const clone = _.clone(post);
          _.remove(tags, tag => tag.id === action.tagId);
          clone.tags = tags;
          return clone;
        }),
      };
    }
    default:
      return state;
  }
};

const isFetchingPost = createFetchingProgressReducer(
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_SUCCESS,
);

export const errorReducer = (state = null, action) => {
  switch (action.type) {
    case FETCH_POSTS_FAILURE:
    case DELETE_POST_FAILURE:
    case UPDATE_POST_FAILURE:
    case SELECT_POST_BY_NAME_FAILURE:
    case USER_LOGIN_FAILURE:
    case ADD_TAG_FAILURE:
      return action.statusText;
    case RESET_ERROR_MESSAGE:
      return null;
    default:
      return null;
  }
};

export default combineReducers({
  posts: postsReducer,
  isFetching: isFetchingPost,
  errorMessage: errorReducer,
});

export const isFetchingPosts = state => state.isFetching;
export const getAllPosts = state => state.posts.all.toArray();
export const getPostErrorMessage = state => state.errorMessage;
export const findPostById = postId => state =>
  state.posts.all.find(post => Number(post.id) === Number(postId));
