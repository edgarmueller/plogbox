import React from "react";
import PropTypes from "prop-types";
import "brace";
import "brace/mode/markdown";
import "brace/theme/solarized_dark";
import "brace/keybinding/emacs";
import ReactAceEditor from "react-ace";

const AceEditor = ({ post, onChange, text, width }) => (
  <ReactAceEditor
    mode="markdown"
    theme="solarized_dark"
    onChange={content => {
      onChange(content);
    }}
    editorProps={{ $blockScrolling: Infinity }}
    highlightActiveLine={true}
    name={post.path_lower}
    width={width}
    value={text}
    minLines={2}
    maxLines={Infinity}
    fontSize={16}
    keyboardHandler="emacs"
  />
);

AceEditor.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  post: PropTypes.object.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  text: PropTypes.string,
  onChange: PropTypes.func
};

AceEditor.defaultProps = {
  text: "",
  onChange: () => {}
};

export default AceEditor;
