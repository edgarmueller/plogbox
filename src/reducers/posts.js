import { combineReducers } from 'redux';
import { createFetchingProgressReducer } from './common';
import {
  AUTH_LOGOUT,
  DELETE_POST_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  SELECT_POST, UNSELECT_POSTS,
  UPDATE_POST_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
} from '../constants';

const initState = {
  selected: [],
  selectedPost: undefined,
  tag: undefined
};

export const postsReducer = (state = initState, action) => {
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

    case DELETE_POST_SUCCESS: {
      return {
        ...state,
        selected: state.selected.filter(post => post.id !== action.post.id),
        selectedPost: state.selectedPost !== undefined && action.post.id === state.selectedPost.id ? undefined : state.selectedPost
      };
    }

    case UNSELECT_POSTS: {
      return {
        ...state,
        selected: undefined,
        selectedPost: undefined
      }
    }

    case AUTH_LOGOUT:
      return initState;

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
