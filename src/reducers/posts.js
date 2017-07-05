import * as _ from 'lodash';
import * as Immutable from 'immutable';
import { combineReducers } from 'redux';
import { createFetchingProgressReducer } from './common';
import {
  ADD_BLOCK,
  CREATE_POST_SUCCESS,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  FETCH_BLOCKS_SUCCESS,
  FETCH_POSTS_SUCCESS,
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  REMOVE_BLOCK_SUCCESS,
  RESET_ERROR_MESSAGE,
  SELECT_POST,
  UPDATE_BLOCK_DIALECT,
  UPDATE_BLOCK_TEXT,
  UPDATE_POST_FAILURE,
  UPDATE_POST_TITLE,
} from '../constants';

const isFetching = createFetchingProgressReducer(
    FETCH_POSTS_REQUEST,
    FETCH_POSTS_FAILURE,
    FETCH_POSTS_SUCCESS,
);

export const postsReducer = (state = {
  all: Immutable.Set(),
  blocks: Immutable.List(),
}, action) => {
  switch (action.type) {
    case UPDATE_BLOCK_DIALECT: {
      const blockIndex = state.blocks.indexOf(action.block);
      return {
        ...state,
        blocks: state.blocks.update(blockIndex, (block) => {
          const clonedBlock = _.clone(block);
          clonedBlock.dialect = action.dialect;
          return clonedBlock;
        }),
      };
    }
    case FETCH_POSTS_SUCCESS:
      return {
        ...state,
        all: Immutable.Set(action.posts),
      };

    case SELECT_POST:
      return {
        ...state,
        selectedPost: action.post,
      };

    case CREATE_POST_SUCCESS:
      return {
        ...state,
        all: state.all.add(action.post),
      };
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        all: state.all.delete(action.post),
      };
    case FETCH_BLOCKS_SUCCESS: {
      const blocks = (_.isEmpty(action.blocks) || action.blocks === undefined) ?
        Immutable.List() :
        Immutable.List(action.blocks);
      return {
        ...state,
        blocks,
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
    case ADD_BLOCK:
      return {
        ...state,
        blocks: state.blocks.push(action.block),
      };
    case REMOVE_BLOCK_SUCCESS:
      return {
        ...state,
        blocks: state.blocks.delete(
          state.blocks.findIndex(block => block.id === action.blockId),
        ),
      };
    case UPDATE_BLOCK_TEXT: {
      const index = state.blocks.indexOf(action.block);
      return {
        ...state,
        blocks: state.blocks.update(index, (block) => {
          const clonedBlock = _.clone(block);
          clonedBlock.text = action.text;
          return clonedBlock;
        }),
      };
    }
    default:
      return state;
  }
};

export const errorReducer = (state = null, action) => {
  switch (action.type) {
    case FETCH_POSTS_FAILURE:
    case DELETE_POST_FAILURE:
    case UPDATE_POST_FAILURE:
      return action.statusText;
    case RESET_ERROR_MESSAGE:
      return null;
    default:
      return null;
  }
};


export default combineReducers({
  posts: postsReducer,
  isFetching,
  errorMessage: errorReducer,
});
export const getPostBeingEdited = state => state.posts.selectedPost;
export const isFetchingPosts = state => state.isFetching;
export const getAllPosts = state => state.posts.all.toArray();
export const getPostErrorMessage = state => state.errorMessage;
export const getBlocks = (state) => {
  if (state.posts.blocks) {
    return state.posts.blocks.toArray();
  }
  return [];
};
