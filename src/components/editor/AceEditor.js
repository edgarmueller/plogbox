import React from "react";
import PropTypes from "prop-types";
import "brace";
import "brace/mode/markdown";
import "brace/theme/solarized_dark";
import "brace/keybinding/vim";
import ReactAceEditor from "react-ace";

class AceEditor extends React.Component {
  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
  }

  componentDidMount() {
    if (this.editorRef.current.editor) {
      this.editorRef.current.editor.focus();
    }
  }

  render() {
    const {post, onChange, text, width} = this.props;
    return (
      <ReactAceEditor
        ref = {this.editorRef}
        mode="markdown"
        theme="solarized_dark"
        onChange={content => {
          onChange(content);
        }}
        editorProps={{$blockScrolling: Infinity}}
        highlightActiveLine={true}
        name={post.path_lower}
        width={width}
        value={text}
        maxLines={Infinity}
        fontSize={16}
        keyboardHandler="vim"
        wrapEnabled
      />
    );
  }
}

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
