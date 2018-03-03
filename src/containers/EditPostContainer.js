import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getIsFetchingBlock,
  getIsUpdatingPost,
  getPostErrorMessage,
} from '../reducers';
import withDragDropContext from '../common/withDragDropContext';

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

// TODO: rename to EditPostContext?
export class EditPostContainer extends React.Component {

  constructor(props) {
    super(props);
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

  getChildContext() {
    return {
      __editPost__: {
        handleUpdatePost: this.handleUpdatePost,
        handleSetBlocks: this.handleSetBlocks,
        handleAddBlock: this.handleAddBlock,
        handleClickOpenEditor: this.handleClickOpenEditor,
        handleClickOpenRenderedView: this.handleClickOpenRenderedView,
        handleClickOpenBoth: this.handleClickOpenBoth,
        post: this.state.post,
        showBoth: this.state.showBoth,
        showRenderedView: this.state.showRenderedView,
        showEditor: this.state.showEditor,
        // TODO
        isFetchingBlock: false,
      },
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post !== this.props.post) {
      // TODO: fix warning
      this.setState({
        post: this.props.post,
      });
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
    return (
      <div>{this.props.children}</div>
    );
  }
}


EditPostContainer.propTypes = {
  post: PropTypes.object,
};

EditPostContainer.defaultProps = {
  post: undefined,
};

EditPostContainer.childContextTypes = {
  __editPost__: PropTypes.object.isRequired,
};

export const mapStateToProps = state => ({
  userId: state.auth.userId,
  isFetchingBlock: getIsFetchingBlock(state),
  isUpdatingPost: getIsUpdatingPost(state),
  errorMessage: getPostErrorMessage(state),
});

export default connect(
  mapStateToProps,
  null,
)(withDragDropContext(EditPostContainer));
