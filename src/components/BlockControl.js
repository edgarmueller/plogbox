import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, IconButton, Input, InputLabel, MenuItem, Select } from 'material-ui';
import ContentDelete from 'material-ui-icons/Delete';
import DownArrow from 'material-ui-icons/KeyboardArrowDown';
import UpArrow from 'material-ui-icons/KeyboardArrowUp';
import { Direction } from '../constants';

const handleStyle = {
  backgroundColor: 'green',
  width: '1rem',
  height: '1rem',
  display: 'inline-block',
  marginRight: '0.75rem',
  cursor: 'move',
};

export class BlockControl extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dialect: props.block.dialect,
    };
  }

  render() {
    const {
      postId,
      block,
      handlers,
      isFirstBlock,
      isLastBlock,
      connectDragSource,
    } = this.props;

    return (
      <div style={{ paddingBottom: '0.5em' }}>
        {connectDragSource(<div style={handleStyle} />)}
        <FormControl style={{ minWidth: '120px' }}>
          <InputLabel htmlFor="block-dialect">Block Dialect</InputLabel>
          <Select
            autoWidth
            input={<Input name="dialect" id="block-dialect" />}
            value={this.state.dialect}
            onChange={(ev) => {
              this.setState(() => ({ dialect: ev.target.value }));
              handlers.updateBlock(block, ev.target.value, block.text);
            }}
          >
            <MenuItem value={'markdown'}>Markdown</MenuItem>
            <MenuItem value={'image'}>Image</MenuItem>
          </Select>
        </FormControl>

        <span style={{ marginLeft: '1em' }}>
          <IconButton
            onClick={() => handlers.deleteBlock(postId, block)}
            color="#2c3e50"
          >
            <ContentDelete />
          </IconButton>
          {
            !isFirstBlock ?
              <IconButton
                onClick={() => handlers.moveBlock(block, Direction.UP)}
                color="#2c3e50"
              >
                <UpArrow />
              </IconButton> :
              <span>&nbsp;</span>
          }
          {
            !isLastBlock ?
              <IconButton
                onClick={() => handlers.moveBlock(block, Direction.DOWN)}
                color="#2c3e50"
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
  postId: PropTypes.number.isRequired,
  block: PropTypes.shape({
    dialect: PropTypes.string.isRequired,
    text: PropTypes.string,
  }).isRequired,
  handlers: PropTypes.shape({
    moveBlock: PropTypes.func.isRequired,
    updateBlock: PropTypes.func.isRequired,
    deleteBlock: PropTypes.func.isRequired,
  }).isRequired,
  isFirstBlock: PropTypes.bool.isRequired,
  isLastBlock: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
};

BlockControl.defaultProps = {
  isFocused: false,
};

export default BlockControl;
