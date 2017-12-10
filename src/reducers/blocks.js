import * as Immutable from 'immutable';
import * as _ from 'lodash';
import { combineReducers } from 'redux';
import {
  ADD_BLOCK,
  FETCH_BLOCK_FAILURE,
  FETCH_BLOCK_REQUEST,
  FETCH_BLOCK_SUCCESS,
  FETCH_BLOCKS_SUCCESS, MOVE_BLOCK_DOWN,
  MOVE_BLOCK_TO, MOVE_BLOCK_UP,
  REMOVE_BLOCK_SUCCESS,
  UPDATE_BLOCK_DIALECT,
  UPDATE_BLOCK_NAME,
  UPDATE_BLOCK_TEXT,
} from '../constants';
import { createFetchingProgressReducer } from './common';


/**
 * Sort blocks by their index.
 *
 * @param blocks the List of blocks to be sorted
 * @return the sorted List as determined by the index property
 */
const sortBlocks = blocks => blocks.sortBy(b => b.index);

const moveBlock = (dragIndex, hoverIndex, blocks) => {
  const dragBlock = blocks.get(dragIndex);
  const hoveredBlock = blocks.get(hoverIndex);
  return blocks.set(hoverIndex, dragBlock).set(dragIndex, hoveredBlock);
};

const moveBlockUp = (block, blocks) => {
  const index = blocks.findIndex(b => b.id === block.id);

  if (index === 0) {
    return blocks;
  }

  const otherBlock = blocks.get(index - 1);
  return blocks
    .set(index - 1, block)
    .set(index, otherBlock);
};

const moveBlockDown = (block, blocks) => {
  const index = blocks.findIndex(b => b.id === block.id);

  if (index === blocks.size - 1) {
    return blocks;
  }

  const otherBlock = blocks.get(index + 1);
  return blocks
    .set(index + 1, block)
    .set(index, otherBlock);
};

export const blocksReducer = (state = Immutable.List(), action) => {
  switch (action.type) {

    case UPDATE_BLOCK_DIALECT: {
      const blockIndex = state.indexOf(action.block);
      return state.update(blockIndex, (block) => {
        const clonedBlock = _.clone(block);
        clonedBlock.dialect = action.dialect;
        return clonedBlock;
      });
    }

    case REMOVE_BLOCK_SUCCESS:
      return state.delete(
        state.findIndex(block => block.id === action.blockId),
      );

    case UPDATE_BLOCK_TEXT: {
      const index = state.indexOf(action.block);
      return state.update(index, (block) => {
        const clonedBlock = _.clone(block);
        clonedBlock.text = action.text;
        return clonedBlock;
      });
    }

    case UPDATE_BLOCK_NAME: {
      const index = state.indexOf(action.block);
      return state.update(index, (block) => {
        const clonedBlock = _.clone(block);
        clonedBlock.name = action.name;
        return clonedBlock;
      });
    }

    case MOVE_BLOCK_TO:
      return moveBlock(action.dragIndex, action.hoverIndex, state);

    case MOVE_BLOCK_UP:
      return moveBlockUp(action.block, state);

    case MOVE_BLOCK_DOWN:
      return moveBlockDown(action.block, state);

    case ADD_BLOCK:
      return state.push(action.block);

    case FETCH_BLOCKS_SUCCESS: {
      const blocks = (_.isEmpty(action.blocks) || action.blocks === undefined) ?
        Immutable.List() :
        Immutable.List(action.blocks);

      return sortBlocks(blocks).map(block => _.omit(block, 'index'));
    }

    default:
      return state;
  }
};

export default combineReducers({
  blocks: blocksReducer,
  isFetchingBlock: createFetchingProgressReducer(
    FETCH_BLOCK_REQUEST,
    FETCH_BLOCK_SUCCESS,
    FETCH_BLOCK_FAILURE,
  ),
});

export const getBlocks = state => state.blocks.toArray();

export const isFetchingBlock = state => state.isFetchingBlock;
