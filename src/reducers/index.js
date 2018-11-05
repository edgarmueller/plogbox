import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import tagReducer from './tags';
import posts, * as fromPosts from './posts';
import blocks, * as fromBlocks from './blocks';
import authReducer, * as fromAuth from './auth';

const app = combineReducers({
  posts,
  blocks,
  auth: authReducer,

  // form
  tags: tagReducer,

  // routing
  routing: routerReducer,
});

export default app;

export const findPostById = postId => state => fromPosts.findPostById(postId)(state.posts);
export const getIsFetchingPosts = state => fromPosts.isFetchingPosts(state.posts);
export const getIsUpdatingPost = state => fromPosts.isUpdating(state.posts);
export const getAllPosts = state => fromPosts.getAllPosts(state.posts);
export const getSelectedPosts = state => fromPosts.getSelectedPosts(state.posts);
export const getPostErrorMessage = state => fromPosts.getPostErrorMessage(state.posts);

export const getIsFetchingBlock = state => fromBlocks.isFetchingBlock(state.blocks);

// auth getters
export const getIsAuthenticated = state => fromAuth.isAuthenticated(state.auth);
export const getStatusText = state => fromAuth.getStatusText(state.auth);
