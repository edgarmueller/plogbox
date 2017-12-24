import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, IconButton, Input, InputLabel, MenuItem, Select } from 'material-ui';
import ContentDelete from 'material-ui-icons/Delete';
import DownArrow from 'material-ui-icons/KeyboardArrowDown';
import UpArrow from 'material-ui-icons/KeyboardArrowUp';
import { Direction } from '../constants';

const dragHandleStyle = {
  backgroundColor: 'green',
  width: '1rem',
  height: '1rem',
  display: 'inline-block',
  marginRight: '0.75rem',
  cursor: 'move',
};

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
      <div style={{ paddingBottom: '0.5em' }}>
        {connectDragSource(<div style={dragHandleStyle} />)}
        <FormControl style={{ minWidth: '120px' }}>
          <InputLabel htmlFor="block-dialect">Block Dialect</InputLabel>
          <Select
            autoWidth
            input={<Input name="dialect" id="block-dialect" />}
            value={this.state.dialect}
            onChange={(ev) => {
              this.setState(() => ({ dialect: ev.target.value }));
              handleUpdateBlock({
                ...block,
                dialect: ev.target.value,
              });
            }}
          >
            <MenuItem value={'markdown'}>Markdown</MenuItem>
            <MenuItem value={'image'}>Image</MenuItem>
          </Select>
        </FormControl>

        <span style={{ marginLeft: '1em' }}>
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
