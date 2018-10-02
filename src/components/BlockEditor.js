import React from 'react';
import PropTypes from 'prop-types';
import DropZone from 'react-dropzone';
import 'brace';
import 'brace/mode/markdown';
import 'brace/theme/solarized_dark';
import 'brace/keybinding/emacs';
import AceEditor from 'react-ace';

const BlockEditor = ({
  postId, block, onDrop, handleUpdateBlock,
}) => {
  if (block.dialect === 'image') {
    return (
      <DropZone
        accept="image/jpeg, image/png"
        onDrop={onDrop(postId, block)}
        style={{
          height: '1em',
          margin: '0.25em',
        }}
      >
        {block.name}
      </DropZone>
    );
  }

  return (
    <AceEditor
      mode="markdown"
      theme="solarized_dark"
      onChange={text => handleUpdateBlock({
        ...block,
        text,
      })}
      name={`${block.id}_editor`}
      editorProps={{ $blockScrolling: true }}
      width="70%"
      value={block.text}
      minLines={2}
      maxLines={Infinity}
      fontSize={16}
      keyboardHandler="emacs"
    />
  );
};

BlockEditor.propTypes = {
  postId: PropTypes.number.isRequired,
  block: PropTypes.shape({
    dialect: PropTypes.string.isRequired,
    text: PropTypes.string,
  }).isRequired,
  onDrop: PropTypes.func.isRequired,
  handleUpdateBlock: PropTypes.func.isRequired,
};

export default BlockEditor;
