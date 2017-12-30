import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import EditPost from './EditPost';
import {
  findPostById,
  getIsFetchingBlock,
  getIsUpdatingPost,
  getPostErrorMessage,
} from '../reducers';
import withDragDropContext from '../common/withDragDropContext';

class EditPostContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post: props.post,
      blocks: _.has(props.post, 'blocks') ? props.post.blocks : [],
    };
    this.handleSetBlocks = this.handleSetBlocks.bind(this);
    this.handleUpdatePost = this.handleUpdatePost.bind(this);
  }

  handleSetBlocks(blocks) {
    this.setState({ blocks });
  }

  handleUpdatePost(post) {
    console.log('updated post', post);
    this.setState({ post });
  }

  render() {
    return (
      <EditPost
        post={this.state.post}
        blocks={this.state.blocks}
        handleUpdatePost={this.handleUpdatePost}
        handleSetBlocks={this.handleSetBlocks}
      />
    );
  }
}


EditPostContainer.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        dialect: PropTypes.string.isRequired,
        text: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export const mapStateToProps = (state, ownProps) => {
  let selectedPost;
  if (_.has(ownProps, 'match.params.postId')) {
    const { match: { params } } = ownProps;
    selectedPost = findPostById(params.postId)(state);
  } else {
    selectedPost = ownProps.selectedPost;
  }

  return {
    post: selectedPost,
    userId: state.auth.userId,
    isFetchingBlock: getIsFetchingBlock(state),
    isUpdatingPost: getIsUpdatingPost(state),
    errorMessage: getPostErrorMessage(state),
  };
};

export default connect(
  mapStateToProps,
  null,
)(withDragDropContext(EditPostContainer));
