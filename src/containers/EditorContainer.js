import React from 'react';
import { connect } from 'react-redux';
import debouncedPromise from 'awesome-debounce-promise';
import { getIsUpdatingPost, getPostErrorMessage, getSelectedPost, } from '../reducers';
import { fetchPost, pushFile } from '../api/dropbox';
import Editor from '../components/editor/Editor';
import * as CommonPropTypes from '../common/CommonPropTypes';

const saveFile = debouncedPromise(pushFile, 1000);

export class EditorContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayMode: 'editor',
      isLoading: false,
      isSaving: false,
      text: ''
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post !== this.props.post && this.props.post !== undefined) {
      this.setState(
        { isLoading: true },
        () =>
          fetchPost(this.props.post.path_lower)
            .then((fileContent) => {
              this.setState({
                text: fileContent,
                isLoading: false
              });
            })
      );
    }
  }

  handleClickShowEditorView = () => {
    this.setState({ displayMode: 'editor' });
  }

  handleClickShowRenderedView = () => {
    this.setState({ displayMode: 'view' });
  }

  handleClickShowBoth = () => {
    this.setState({ displayMode: 'both' });
  }

  handleOnChange = post => (changedText) => {
    this.setState(
      { isSaving: true },
      () =>
        saveFile(post.path_lower, changedText)
          .then(() => this.setState({ isSaving: false }))
    );
    this.setState({ text: changedText });
  }

  render() {
    const { post } = this.props;

    const {
      isLoading,
      isSaving,
      displayMode,
      text
    } = this.state;

    return (
      <Editor
        toolbarHandlers={{
          handleClickShowBoth: this.handleClickShowBoth,
          handleClickShowRenderedView: this.handleClickShowRenderedView,
          handleClickShowEditorView: this.handleClickShowEditorView
        }}
        handleOnChange={this.handleOnChange}
        post={post}
        displayMode={displayMode}
        isLoading={isLoading}
        isSaving={isSaving}
        text={text}
      />
    );
  }
}

EditorContainer.propTypes = {
  post: CommonPropTypes.post,
};

EditorContainer.defaultProps = {
  post: undefined,
};

export const mapStateToProps = state => ({
  post: getSelectedPost(state),
  userId: state.auth.userId,
  isUpdatingPost: getIsUpdatingPost(state),
  errorMessage: getPostErrorMessage(state),
});

export default connect(
  mapStateToProps,
  null,
)(EditorContainer);
