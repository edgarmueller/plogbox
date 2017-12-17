import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import * as action from '../actions/index';
import BlockControl from './BlockControlContainer';
import { UPDATE_BLOCK_FAILURE } from '../constants';
import ItemTypes from '../dnd/ItemTypes';
import { getBlocks } from '../reducers';
import BlockEditor from './BlockEditor';
import BlockControlWrapper from './BlockControlWrapper';

export const BlockComponent =
  ({
     postId,
     block,
     onDrop,
     onFocus,
     isFocused,
     connectDragSource,
     connectDropTarget,
   }) =>
    (
      <BlockControlWrapper
        key={block.id}
        onFocus={onFocus}
        isFocused={isFocused}
        connectDropTarget={connectDropTarget}
      >
        <BlockControl
          postId={postId}
          block={block}
          connectDragSource={connectDragSource}
        />
        <BlockEditor
          postId={postId}
          block={block}
          onDrop={onDrop}
        />
      </BlockControlWrapper>
    );

BlockComponent.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  postId: PropTypes.number.isRequired,
  block: PropTypes.shape({
    dialect: PropTypes.string.isRequired,
    text: PropTypes.string,
  }).isRequired,
  onDrop: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
};

export const mapStateToProps = (state, { block }) => ({
  blockIndex: getBlocks(state).indexOf(block),
});

export const mapDispatchToProps = dispatch => ({
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
  moveBlockTo(dragIndex, hoverIndex) {
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
    props.moveBlockTo(dragIndex, hoverIndex);

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

export const ConnectedBlockComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(BlockComponent);

export default connect(mapStateToProps, mapDispatchToProps)(
  DropTarget(ItemTypes.BLOCK, blockTarget, collectDrop)(
    DragSource(ItemTypes.BLOCK, blockSource, collect)(ConnectedBlockComponent),
  ),
);
