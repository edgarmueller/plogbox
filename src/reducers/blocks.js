import { combineReducers } from 'redux';
import {
  FETCH_BLOCKS_REQUEST,
  FETCH_BLOCKS_FAILURE,
  FETCH_BLOCKS_SUCCESS,
} from '../constants';
import { createFetchingProgressReducer } from './common';

export default combineReducers({
  isFetchingBlock: createFetchingProgressReducer(
    FETCH_BLOCKS_REQUEST,
    FETCH_BLOCKS_SUCCESS,
    FETCH_BLOCKS_FAILURE,
  ),
});

export const isFetchingBlock = state => state.isFetchingBlock;
