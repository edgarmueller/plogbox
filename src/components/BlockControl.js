import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, IconButton, Input, InputLabel, MenuItem, Select } from 'material-ui';
import ContentDelete from 'material-ui-icons/Delete';
import DownArrow from 'material-ui-icons/KeyboardArrowDown';
import UpArrow from 'material-ui-icons/KeyboardArrowUp';
import Dropzone from 'react-dropzone';

const Editor = (props) => {
  if (typeof window !== 'undefined') {
    /* eslint-disable */
    const AceEditor = require('react-ace').default;

    require('brace');
    require('brace/mode/markdown');
    require('brace/theme/github');
    require('brace/keybinding/emacs');
    /* eslint-enable */

    return <AceEditor {...props} />;
  }

  return null;
};

const renderBlockControl = (postId, block, onDrop, onChange) => {
  if (block.dialect === 'image') {
    return (
      <Dropzone
        accept="image/jpeg, image/png"
        onDrop={onDrop(postId)(block)}
        style={{
          height: '1em',
          margin: '0.25em',
        }}
      >
        {block.name}
      </Dropzone>
    );
  }

  return (
    <Editor
      mode="markdown"
      theme="github"
      onChange={text => onChange(block, text)}
      name={`${block.id}_editor`}
      editorProps={{ $blockScrolling: true }}
      width={'100%'}
      value={block.text}
      minLines={1}
      maxLines={Infinity}
      keyboardHandler={'emacs'}
    />
  );
};

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
      onDrop,
      updateBlockDialect,
      updateBlockText,
      moveBlockUp,
      moveBlockDown,
      removeBlock,
      isFirstBlock,
      isLastBlock,
      isFocused,
      onFocus,
      connectDropTarget,
      connectDragSource,
    } = this.props;

    return connectDropTarget(
      <div
        key={block.id}
        onFocus={() => onFocus()}
        style={{
          border: isFocused ? 'solid 1px #00ff00' : 'none',
          padding: '0.5em',
        }}
      >
        <div style={{ paddingBottom: '0.5em' }}>
          {connectDragSource(<div style={handleStyle} />)}
          <FormControl style={{ minWidth: '120' }}>
            <InputLabel htmlFor="block-dialect">Block Dialect</InputLabel>
            <Select
              autoWidth
              input={<Input name="dialect" id="block-dialect" />}
              value={this.state.dialect}
              onChange={(ev) => {
                this.setState(() => ({ dialect: ev.target.value }));
                updateBlockDialect(block, ev.target.value);
              }}
            >
              <MenuItem value={'markdown'}>Markdown</MenuItem>
              <MenuItem
                value={'image'}
                onClick={() => updateBlockText(block, '')}
              >Image</MenuItem>
            </Select>
          </FormControl>

          <span style={{ marginLeft: '1em' }}>
            <IconButton
              onClick={() => removeBlock(postId, block)}
              color="#2c3e50"
            >
              <ContentDelete />
            </IconButton>
            {
              !isFirstBlock ?
                <IconButton
                  onClick={() => moveBlockUp(block)}
                  color="#2c3e50"
                >
                  <UpArrow />
                </IconButton> :
                <span>&nbsp;</span>
            }
            {
              !isLastBlock ?
                <IconButton
                  onClick={() => moveBlockDown(block)}
                  color="#2c3e50"
                >
                  <DownArrow />
                </IconButton> :
                <span>&nbsp;</span>
            }
          </span>
        </div>
        {renderBlockControl(postId, block, onDrop, updateBlockText)}
      </div>,
    );
  }
}

BlockControl.propTypes = {
  postId: PropTypes.number.isRequired,
  block: PropTypes.shape({
    dialect: PropTypes.string.isRequired,
    text: PropTypes.string,
  }).isRequired,
  moveBlockUp: PropTypes.func.isRequired,
  moveBlockDown: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  updateBlockDialect: PropTypes.func.isRequired,
  updateBlockText: PropTypes.func.isRequired,
  removeBlock: PropTypes.func.isRequired,
  isFirstBlock: PropTypes.bool.isRequired,
  isLastBlock: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

BlockControl.defaultProps = {
  isFocused: false,
  onFocus: () => { /* noop */
  },
};

export default BlockControl;
