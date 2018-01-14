import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { DragSource, DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';
import BlockControl from './BlockControl';
import ItemTypes from '../dnd/ItemTypes';
import BlockEditor from './BlockEditor';
import BlockControlWrapper from './BlockControlWrapper';
import { uploadFile } from '../actions';
import { Direction } from '../constants';
import * as api from '../api';
import { moveBlockDown, moveBlockUp } from '../utils/blocks';

class BlockComponent extends React.Component {

  constructor(props) {
    super(props);
    this.handleDeleteBlock = this.handleDeleteBlock.bind(this);
    this.handleUpdateBlock = this.handleUpdateBlock.bind(this);
    this.handleMoveBlock = this.handleMoveBlock.bind(this);
    this.handleMoveBlockUp = this.handleMoveBlockUp.bind(this);
    this.handleMoveBlockDown = this.handleMoveBlockDown.bind(this);
  }

  onDrop = (postId, block) => {
    return (acceptedFiles) => {
      if (!_.isEmpty(acceptedFiles)) {
        uploadFile(postId, _.head(acceptedFiles))
          .then(
            resp => {
              const copy = _.cloneDeep(block);
              copy.name = _.head(acceptedFiles).name;
              copy.text = resp.data.data;
              this.handleUpdateBlock(copy);
            },
            // TODO
            error => console.error('TODO: proper error handling', error),
          );
      }
    };
  }

  handleMoveBlock(block, direction) {
    if (direction === Direction.UP) {
      this.handleMoveBlockUp(block);
    } else {
      this.handleMoveBlockDown(block);
    }
  }

  handleMoveBlockUp(block) {
    const { blocks, handleSetBlocks } = this.props;
    handleSetBlocks(moveBlockUp(blocks, block));
  }

  handleMoveBlockDown(block) {
    const { blocks, handleSetBlocks } = this.props;
    handleSetBlocks(moveBlockDown(blocks, block));
  }

  handleUpdateBlock(block) {
    const { blocks, handleSetBlocks } = this.props;
    const blockIndex = _.findIndex(blocks, b => {
      if (b.id) {
        return b.id === block.id;
      }
      return b.tempid === block.tempid;
    });
    if (blockIndex !== -1) {
      const copy = blocks.slice();
      copy[blockIndex] = block;
      handleSetBlocks(copy);
    } else {
      console.log('no block found')
    }
  }

  handleDeleteBlock(block) {
    const { blocks, handleSetBlocks, postId } = this.props;
    api.removeBlock(postId, block)
      .then(() => handleSetBlocks(_.without(blocks, block)));
  }

  render() {
    const {
      postId,
      block,
      blocks,
      blockIndex,
      onFocus,
      isFocused,
      connectDragSource,
      connectDropTarget,
    } = this.props;

    return (
      <BlockControlWrapper
        onFocus={onFocus}
        isFocused={isFocused}
        connectDropTarget={connectDropTarget}
      >
        <BlockControl
          block={block}
          isFirstBlock={blockIndex === 0}
          isLastBlock={blockIndex === blocks.length - 1}
          handleDeleteBlock={this.handleDeleteBlock}
          handleUpdateBlock={this.handleUpdateBlock}
          handleMoveBlock={this.handleMoveBlock}
          connectDragSource={connectDragSource}
        />
        <BlockEditor
          postId={postId}
          block={block}
          onDrop={this.onDrop}
          handleUpdateBlock={this.handleUpdateBlock}
        />
      </BlockControlWrapper>
    );
  }
}

BlockComponent.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  postId: PropTypes.number.isRequired,
  block: PropTypes.shape({
    dialect: PropTypes.string.isRequired,
    text: PropTypes.string,
  }),
  blocks: PropTypes.array,
  blockIndex: PropTypes.number,
  onFocus: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
  handleSetBlocks: PropTypes.func.isRequired,
};

const blockSource = {
  beginDrag(props) {
    return {
      blockId: props.id,
      index: props.blockIndex,
    };
  },
};

const moveBlockTo = (blocks, dragIndex, hoverIndex) => {
  const dragBlock = blocks[dragIndex];
  const hoveredBlock = blocks[hoverIndex];
  const copy = blocks.slice();
  copy[hoverIndex] = dragBlock;
  copy[dragIndex] = hoveredBlock;
  return copy;
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
    // eslint-disable-next-line react/no-find-dom-node
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // eslint-enable-next-line react/no-find-dom-node

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
    props.handleSetBlocks(moveBlockTo(props.blocks, dragIndex, hoverIndex));

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    // eslint-disable-next-line no-param-reassign
    monitor.getItem().index = hoverIndex;
    // eslint-enable-next-line no-param-reassign
  },
};

const collectTarget = (connector, monitor) => ({
  connectDropTarget: connector.dropTarget(),
  isOver: monitor.isOver(),
});

const collectSource = (connector, monitor) => ({
  connectDragSource: connector.dragSource(),
  isDragging: monitor.isDragging(),
});

export default DropTarget(ItemTypes.BLOCK, blockTarget, collectTarget)(
  DragSource(ItemTypes.BLOCK, blockSource, collectSource)(BlockComponent),
);
