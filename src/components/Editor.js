import React from 'react';
import PropTypes from 'prop-types';
import 'brace';
import 'brace/mode/markdown';
import 'brace/theme/solarized_dark';
import 'brace/keybinding/emacs';
import AceEditor from 'react-ace';
import debouncedPromise from 'awesome-debounce-promise';
import { pushFile } from '../api/dropbox';

const saveFile = debouncedPromise(pushFile, 1000);

const Editor = ({
  post, text
}) => {
  // if (block.dialect === 'image') {
  //   return (
  //     <DropZone
  //       accept="image/jpeg, image/png"
  //       onDrop={onDrop(postId, block)}
  //       style={{
  //         height: '1em',
  //         margin: '0.25em',
  //       }}
  //     >
  //       {block.name}
  //     </DropZone>
  //   );
  // }

  return (
    <AceEditor
      mode="markdown"
      theme="solarized_dark"
      onChange={content => saveFile(post.path_lower, content)}
      name={post.path_lower}
      editorProps={{ $blockScrolling: true }}
      width="70%"
      value={text}
      minLines={2}
      maxLines={Infinity}
      fontSize={16}
      keyboardHandler="emacs"
    />
  );
};

Editor.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  post: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  text: PropTypes.string,
};

Editor.defaultProps = {
  text: ''
};

export default Editor;
