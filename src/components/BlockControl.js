import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, IconButton, Input, InputLabel, MenuItem, Select } from 'material-ui';
import ContentRemove from 'material-ui-icons/Remove';
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
      <Dropzone onDrop={onDrop(postId)(block)}>
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
    } = this.props;

    return (
      <div key={block.id}>
        <div
          style={{
            paddingBottom: '0.5em',
          }}
        >
          <FormControl>
            <InputLabel htmlFor="block-dialect">Block Dialect</InputLabel>
            <Select
              input={<Input name="dialect" id="block-dialect" />}
              value={this.state.dialect}
              onChange={(ev) => {
                this.setState(() => ({ dialect: ev.target.value }));
                updateBlockDialect(block, ev.target.value);
              }}
            >
              <MenuItem value={'markdown'}>Markdown</MenuItem>
              <MenuItem value={'latex'}>Latex</MenuItem>
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
              <ContentRemove />
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
  moveBlockUp: PropTypes.func.isRequired,
  moveBlockDown: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  updateBlockDialect: PropTypes.func.isRequired,
  updateBlockText: PropTypes.func.isRequired,
  removeBlock: PropTypes.func.isRequired,
  isFirstBlock: PropTypes.bool.isRequired,
  isLastBlock: PropTypes.bool.isRequired,
};

export default BlockControl;
