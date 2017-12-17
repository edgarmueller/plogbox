import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DropZone from 'react-dropzone';
import { updateBlockText } from '../actions';

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

export const BlockEditor = ({ postId, block, onDrop, updateText }) => {
  if (block.dialect === 'image') {
    return (
      <DropZone
        accept="image/jpeg, image/png"
        onDrop={onDrop(postId)(block)}
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
      onChange={text => updateText(block, text)}
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

BlockEditor.propTypes = {
  postId: PropTypes.number.isRequired,
  block: PropTypes.shape({
    dialect: PropTypes.string.isRequired,
    text: PropTypes.string,
  }).isRequired,
  onDrop: PropTypes.func.isRequired,
  updateText: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  updateText(block, text) {
    dispatch(updateBlockText(block, text));
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(BlockEditor);
