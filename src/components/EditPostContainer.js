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
import { fetchPostById } from '../api';
import withDragDropContext from '../common/withDragDropContext';

class EditPostContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post: props.post,
    };
    this.handleSetBlocks = this.handleSetBlocks.bind(this);
    this.handleUpdatePost = this.handleUpdatePost.bind(this);
    this.fetchPost = this.fetchPost.bind(this);
  }

  componentDidMount() {
    this.fetchPost();
  }

 /*  componentDidUpdate(prevProps) {
    if (prevProps.postId !== this.props.postId) {
      this.fetchPost();
    }
  } */

  fetchPost() {
    const { postId } = this.props;
    if (postId) {
      fetchPostById(postId)
        .then(
          resp => this.setState({ post: resp.data.data }),
          error => console.error(error),
        )
    }
  }

  handleSetBlocks(blocks) {
    this.setState({ 
      post: {
        ...this.state.post,
        blocks 
      }
    });    
  }

  handleUpdatePost(post) {
    this.setState({ post });
  }

  render() {

    if (this.state.post === undefined) {
      return (<p>Loading post...</p>);
    }

    return (
      <EditPost
        post={this.state.post}
        handleUpdatePost={this.handleUpdatePost}
        handleSetBlocks={this.handleSetBlocks}
      />
    );
  }
}


EditPostContainer.propTypes = {
  postId: PropTypes.number.isRequired,
};

export const mapStateToProps = (state, ownProps) => {
  let postId;
  if (_.has(ownProps, 'match.params.postId')) {
    const { match: { params } } = ownProps;
    postId = Number(params.postId);
  } else {
    postId = ownProps.postId;
  }

  return {
    postId,
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
