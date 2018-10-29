import * as _ from 'lodash';
import * as Immutable from 'immutable';
import { combineReducers } from 'redux';
import { createFetchingProgressReducer } from './common';
import {
  ADD_TAG_SUCCESS,
  CREATE_POST_SUCCESS,
  DELETE_POST_SUCCESS,
  DELETE_TAG_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  SELECT_POST,
  SELECT_POSTS_BY_TAG,
  UPDATE_POST_FAILURE,
  UPDATE_POST_REQUEST,
  UPDATE_POST_SUCCESS,
  UPDATE_POST_TITLE,
} from '../constants';

export const postsReducer = (state = {
  all: Immutable.List(),
  // TODO these should be derived
  selected: Immutable.List(),
  selectedPost: undefined,
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

    case UPDATE_POST_SUCCESS:
      const idx = state.all.findIndex(p => p === action.post.id);
      return {
        ...state,
        all: state.all.update(idx, () => action.post),
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

    case SELECT_POST: {
      return {
        ...state,
        selectedPost: action.post,
      };
    }

    case SELECT_POSTS_BY_TAG: {
      return {
        ...state,
        selected: action.posts
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
export const getAllPosts = state => state.posts.all.toArray();
export const getSelectedPosts = state => state.posts.selected.toArray();
export const getPostErrorMessage = state => state.errorMessage;
export const findPostById = postId => state =>
  state.posts.all.find(post => Number(post.id) === Number(postId));
export const findPostByTag = tag => state =>
  state.posts.all.find(post => post.tags.indexOf(tag) !== -1);
