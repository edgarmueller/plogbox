import * as Immutable from 'immutable';
import { combineReducers } from 'redux';
import { createFetchingProgressReducer } from './common';
import {
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  SELECT_POST,
  UPDATE_POST_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
} from '../constants';

export const postsReducer = (state = {
  all: Immutable.List(),
  selected: [],
  selectedPost: undefined,
  tag: undefined
}, action) => {
  switch (action.type) {

    case SELECT_POST: {
      return {
        ...state,
        selectedPost: action.post,
      };
    }

    case FETCH_POSTS_REQUEST: {
      return {
        ...state,
        selectedPost: undefined,
      };
    }

    case FETCH_POSTS_SUCCESS: {
      return {
        ...state,
        selected: action.posts,
        selectedPost: undefined,
        tag: action.tag
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

const isUpdatingPost = createFetchingProgressReducer(
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_FAILURE,
);

export default combineReducers({
  posts: postsReducer,
  isFetching: isFetchingPost,
  isUpdating: isUpdatingPost,
});

export const isFetchingPosts = state => state.isFetching;
export const isUpdating = state => state.isUpdating;
export const getSelectedPosts = state => state.posts.selected;
export const getSelectedPost = state => state.posts.selectedPost;
export const getCurrentTag = state => state.posts.tag;
export const getPostErrorMessage = state => state.errorMessage;
export const findPostById = postId => state =>
  state.posts.all.find(post => Number(post.id) === Number(postId));
export const findPostByTag = tag => state =>
  state.posts.all.find(post => post.tags.indexOf(tag) !== -1);
