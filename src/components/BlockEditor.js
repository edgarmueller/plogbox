import React from 'react';
import PropTypes from 'prop-types';
import DropZone from 'react-dropzone';

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

const BlockEditor = ({ postId, block, onDrop, handleUpdateBlock }) => {
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
    <Editor
      mode="markdown"
      theme="github"
      onChange={text => handleUpdateBlock({
        ...block,
        text,
      })}
      name={`${block.id}_editor`}
      editorProps={{ $blockScrolling: true }}
      width={'100%'}
      value={block.text}
      minLines={2}
      maxLines={Infinity}
      fontSize={16}
      keyboardHandler={'emacs'}
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
