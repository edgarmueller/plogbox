import React from 'react';
import { connect } from 'react-redux';
import * as action from '../actions/index';
import { BlockControl } from './BlockControl';
import { UPDATE_BLOCK_FAILURE } from '../constants';

export const BlockControlContainer =
  ({
     postId,
     block,
     onDrop,
     updateBlockDialect,
     updateBlockText,
     moveBlockUp,
     moveBlockDown,
     removeBlock,
     isFirstBlock,
     isLastBlock,
   }) =>
    (
      <BlockControl
        postId={postId}
        block={block}
        isFirstBlock={isFirstBlock}
        isLastBlock={isLastBlock}
        moveBlockUp={moveBlockUp}
        moveBlockDown={moveBlockDown}
        onDrop={onDrop}
        updateBlockDialect={updateBlockDialect}
        updateBlockText={updateBlockText}
        removeBlock={removeBlock}
      />
    );

BlockControlContainer.propTypes = BlockControl.propTypes;

export const mapStateToProps = (state, { postId, block, isFirstBlock, isLastBlock }) => ({
  postId,
  block,
  isFirstBlock,
  isLastBlock,
});

export const mapDispatchToProps = dispatch => ({
  moveBlockDown(block) {
    dispatch(action.moveBlockDown(block));
  },
  moveBlockUp(block) {
    dispatch(action.moveBlockUp(block));
  },
  onDrop: postId => block => (acceptedFiles) => {
    action.uploadFile(postId, block.id, _.head(acceptedFiles))
      .then(
        (resp) => {
          dispatch(action.updateBlockName(block, resp.data.data.name));
          dispatch(action.updateBlockText(block, resp.data.data.text));
        },
        error => action.errorHandler(dispatch, error, UPDATE_BLOCK_FAILURE),
      );
  },
  removeBlock(postId, block) {
    dispatch(action.removeBlock(postId, block));
  },
  updateBlockText(block, text) {
    dispatch(action.updateBlockText(block, text));
  },
  updateBlockDialect(block, dialect) {
    dispatch(action.updateBlockDialect(block, dialect));
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(BlockControlContainer);
