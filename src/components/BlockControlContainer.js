import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import BlockControl from './BlockControl';
import { getBlocks } from '../reducers';
import {
  updateBlockText,
  updateBlockDialect,
  removeBlock,
  moveBlockDown,
  moveBlockUp,
} from '../actions';
import { Direction } from '../constants';

const BlockControlContainer = (
  {
    block,
    connectDragSource,
    isFirstBlock,
    isLastBlock,
    postId,
    handlers,
  }) =>
  (
    <BlockControl
      postId={postId}
      block={block}
      handlers={handlers}
      isFirstBlock={isFirstBlock}
      isLastBlock={isLastBlock}
      connectDragSource={connectDragSource}
    />
  );

BlockControlContainer.propTypes = BlockControl.propTypes;

export const mapStateToProps = (state, ownProps) => {
  const blocks = getBlocks(state);
  const { block } = ownProps;
  const blockIndex = _.find(blocks, b => b.id === block.id);

  return {
    isFirstBlock: blockIndex === 0,
    isLastBlock: blockIndex === blocks.length - 1,
    connectDragSource: ownProps.connectDragSource,
  };
};

export const mapDispatchToProps = (dispatch) => {
  const moveBlock = (block, direction) => {
    if (direction === Direction.UP) {
      dispatch(moveBlockUp(block));
    } else {
      dispatch(moveBlockDown(block));
    }
  };
  const updateBlock = (block, dialect, text) => {
    if (block.dialect !== dialect) {
      return dispatch(updateBlockDialect(block, dialect));
    }
    if (block.text !== text) {
      return dispatch(updateBlockText(block, text));
    }
  };
  const deleteBlock = (postId, block) => {
    return dispatch(removeBlock(postId, block));
  };
  return {
    handlers: {
      moveBlock,
      updateBlock,
      deleteBlock,
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlockControlContainer);
