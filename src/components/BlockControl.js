import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Input, MenuItem, Select } from 'material-ui';
import ContentDelete from 'material-ui-icons/Delete';
import DownArrow from 'material-ui-icons/KeyboardArrowDown';
import UpArrow from 'material-ui-icons/KeyboardArrowUp';
import DragHandleIcon from 'material-ui-icons/DragHandle';
import { Direction } from '../constants';

class BlockControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dialect: props.block.dialect,
    };
  }

  render() {
    const {
      block,
      isFirstBlock,
      isLastBlock,
      handleDeleteBlock,
      handleUpdateBlock,
      handleMoveBlock,
      connectDragSource,
    } = this.props;

    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        {
          connectDragSource(
            <span style={{
              cursor: 'move',
              margin: 'auto',
              marginLeft: 0,
              marginRight: '0.5em',
            }}
            >
              <DragHandleIcon />
            </span>,
          )
        }
        <Select
          input={<Input name="dialect" id="block-dialect" />}
          value={this.state.dialect}
          onChange={(ev) => {
            this.setState(() => ({ dialect: ev.target.value }));
            handleUpdateBlock({
              ...block,
              dialect: ev.target.value,
            });
          }}
          style={{
            margin: 'auto',
            marginLeft: 0,
            marginRight: 0,
          }}
        >
          <MenuItem value={'markdown'}>Markdown</MenuItem>
          <MenuItem value={'image'}>Image</MenuItem>
        </Select>

        <span>
          <IconButton
            onClick={() => handleDeleteBlock(block)}
            color="default"
          >
            <ContentDelete />
          </IconButton>
          {
            !isFirstBlock ?
              <IconButton
                onClick={() => handleMoveBlock(block, Direction.UP)}
                color="default"
              >
                <UpArrow />
              </IconButton> :
              <span>&nbsp;</span>
          }
          {
            !isLastBlock ?
              <IconButton
                onClick={() => handleMoveBlock(block, Direction.DOWN)}
                color="default"
              >
                <DownArrow />
              </IconButton> :
              <span>&nbsp;</span>
          }
        </span>
      </div>
    );
  }
}

BlockControl.propTypes = {
  block: PropTypes.shape({
    dialect: PropTypes.string.isRequired,
    text: PropTypes.string,
  }).isRequired,
  isFirstBlock: PropTypes.bool.isRequired,
  isLastBlock: PropTypes.bool.isRequired,
  handleDeleteBlock: PropTypes.func.isRequired,
  handleMoveBlock: PropTypes.func.isRequired,
  handleUpdateBlock: PropTypes.func.isRequired,
  connectDragSource: PropTypes.func.isRequired,
};

BlockControl.defaultProps = {
  isFocused: false,
};

export default BlockControl;
