import React from 'react';
import PropTypes from 'prop-types';
import { FloatingActionButton, MenuItem, SelectField } from 'material-ui';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import UpArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
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

export const BlockControl =
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
      <div key={block.id}>
        <div
          style={{
            paddingBottom: '0.5em',
          }}
        >
          <SelectField
            floatingLabelText="Block Dialect"
            value={block.dialect}
            onChange={(ev, newValue, dialect) => {
              updateBlockDialect(block, dialect);
            }}
          >
            <MenuItem value={'markdown'} primaryText="Markdown" />
            <MenuItem
              value={'latex'}
              primaryText="Latex"
            />
            <MenuItem
              value={'image'}
              primaryText="Image"
              onClick={() => updateBlockText(block, '')}
            />
          </SelectField>

          <span style={{ marginLeft: '1em' }}>
            <FloatingActionButton
              onClick={() => removeBlock(postId, block)}
              backgroundColor="#2c3e50"
              mini
            >
              <ContentRemove />
            </FloatingActionButton>
            {
              !isFirstBlock ?
                <FloatingActionButton
                  onClick={() => moveBlockUp(block)}
                  backgroundColor="#2c3e50"
                  mini
                >
                  <UpArrow />
                </FloatingActionButton> :
                <span>&nbsp;</span>
            }
            {
              !isLastBlock ?
                <FloatingActionButton
                  onClick={() => moveBlockDown(block)}
                  backgroundColor="#2c3e50"
                  mini
                >
                  <DownArrow />
                </FloatingActionButton> :
                <span>&nbsp;</span>
            }
          </span>
        </div>
        { renderBlockControl(postId, block, onDrop, updateBlockText) }
      </div>
    );

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
