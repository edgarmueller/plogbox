import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui';
import {
  getIsFetchingBlock,
  getIsUpdatingPost,
  getPostErrorMessage,
} from '../reducers';
import withDragDropContext from '../common/withDragDropContext';
import { fetchFile } from '../api/dropbox';
import Editor from '../components/Editor';
import RenderedView from '../components/RenderedView';
import { center } from '../common/styles';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4() + s4()}-${s4()}-${s4()}-${
    s4()}-${s4()}${s4()}${s4()}`;
}

const styles = {
  center
};

const NoPosts = withStyles(styles)(({ classes }) => (
  <div className={classes.center}>
    No post available
  </div>
));

// TODO: rename to EditPostContext?
export class EditPostContainer extends React.Component {
  constructor(props) {
    super(props);
    console.log('EditPostContaienr props', props);
    this.state = {
      post: props.post,
      showEditor: false,
      showRenderedView: false,
      showBoth: true,
    };
    this.handleSetBlocks = this.handleSetBlocks.bind(this);
    this.handleUpdatePost = this.handleUpdatePost.bind(this);
    this.handleAddBlock = this.handleAddBlock.bind(this);
    this.handleClickOpenEditor = this.handleClickOpenEditor.bind(this);
    this.handleClickOpenRenderedView = this.handleClickOpenRenderedView.bind(this);
    this.handleClickOpenBoth = this.handleClickOpenBoth.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post !== this.props.post) {
      this.setState(
        { isLoading: true },
        () =>
          fetchFile(this.props.post.path_lower)
            .then((fileContent) => {
              this.setState({
                text: fileContent,
                isLoading: false
              });
            })
      );
    }
  }

  handleClickOpenEditor() {
    this.setState({
      showEditor: true,
      showRenderedView: false,
      showBoth: false,
    });
  }

  handleClickOpenRenderedView() {
    this.setState({
      showEditor: false,
      showRenderedView: true,
      showBoth: false,
    });
  }

  handleClickOpenBoth() {
    this.setState({
      showEditor: false,
      showRenderedView: false,
      showBoth: true,
    });
  }

  handleSetBlocks(blocks) {
    this.setState({
      post: {
        ...this.state.post,
        blocks,
      },
    });
  }

  handleUpdatePost(post) {
    this.setState({ post });
  }

  handleAddBlock() {
    const { post } = this.props;
    this.handleSetBlocks(this.state.post.blocks.slice().concat({
      dialect: 'markdown',
      text: '',
      index: post.blocks.length,
      tempid: guid(),
    }));
  }

  render() {
    const { classes, post } = this.props;
    const {
      isLoading, showBoth, showEditor, showRendererView, text
    } = this.state;

    if (isLoading) {
      return (<div>Loading...</div>);
    }

    if (post === undefined) {
      return <NoPosts />;
    }

    if (showEditor) {
      return (
        <Editor
          post={post}
          text={text}
        />
      );
    } else if (showRendererView) {
      return (
        <RenderedView />
      );
    }
  }
}


EditPostContainer.propTypes = {
  post: PropTypes.object,
};

EditPostContainer.defaultProps = {
  post: undefined,
};

export const mapStateToProps = state => ({
  post: state.posts.posts.selectedPost,
  userId: state.auth.userId,
  isFetchingBlock: getIsFetchingBlock(state),
  isUpdatingPost: getIsUpdatingPost(state),
  errorMessage: getPostErrorMessage(state),
});

export default connect(
  mapStateToProps,
  null,
)(withDragDropContext(EditPostContainer));
