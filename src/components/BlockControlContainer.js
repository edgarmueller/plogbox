import * as _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import * as action from '../actions/index';
import BlockControl from './BlockControl';
import { UPDATE_BLOCK_FAILURE } from '../constants';
import ItemTypes from '../dnd/ItemTypes';
import { getBlocks } from '../reducers';

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
     onFocus,
     isFocused,
     connectDragSource,
     connectDropTarget,
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
        isFocused={isFocused}
        onFocus={onFocus}
        connectDragSource={connectDragSource}
        connectDropTarget={connectDropTarget}
      />
    );

BlockControlContainer.propTypes = BlockControl.propTypes;

export const mapStateToProps = (state, { block }) => ({
  blockIndex: getBlocks(state).indexOf(block),
});

export const mapDispatchToProps = dispatch => ({
  moveBlockDown(block) {
    dispatch(action.moveBlockDown(block));
  },
  moveBlockUp(block) {
    dispatch(action.moveBlockUp(block));
  },
  onDrop: postId => block => (acceptedFiles) => {
    if (!_.isEmpty(acceptedFiles)) {
      action.uploadFile(postId, block.id, _.head(acceptedFiles))
        .then(
          (resp) => {
            dispatch(action.updateBlockName(block, resp.data.data.name));
            dispatch(action.updateBlockText(block, resp.data.data.text));
          },
          error => action.errorHandler(dispatch, error, UPDATE_BLOCK_FAILURE),
        );
    }
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
  moveBlock(dragIndex, hoverIndex) {
    dispatch(action.moveBlock(dragIndex, hoverIndex));
  },
});

const blockSource = {
  beginDrag(props) {
    return {
      blockId: props.id,
      index: props.blockIndex,
    };
  },
};

const blockTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.blockIndex;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveBlock(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  },
};

const collectDrop = (connector, monitor) => ({
  connectDropTarget: connector.dropTarget(),
  isOver: monitor.isOver(),
});

const collect = (connector, monitor) => ({
  connectDragSource: connector.dragSource(),
  isDragging: monitor.isDragging(),
});

export const ConnectedBlockControlContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlockControlContainer);

export default connect(mapStateToProps, mapDispatchToProps)(
  DropTarget(ItemTypes.BLOCK, blockTarget, collectDrop)(
    DragSource(ItemTypes.BLOCK, blockSource, collect)(BlockControlContainer)
  )
);
