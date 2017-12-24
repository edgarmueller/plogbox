import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { connect } from 'react-redux';
import _ from 'lodash';
import EditPost from './EditPost';
import * as action from '../actions';
import {
  findPostById,
  getIsFetchingBlock,
  getPostErrorMessage,
} from '../reducers';

class EditPostContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post: props.post,
      blocks: [],
    };
    this.handleSetBlocks = this.handleSetBlocks.bind(this);
    this.handleUpdatePost = this.handleUpdatePost.bind(this);
  }

  componentWillMount() {
    const { fetchBlocks, post } = this.props;
    if (_.isEmpty(post.blocks)) {
      fetchBlocks(post)
        .then(blocks => this.setState({ blocks }));
    }
  }

  handleSetBlocks(blocks) {
    this.setState({ blocks });
  }

  handleUpdatePost(post) {
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

  fetchBlocks: PropTypes.func.isRequired,
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
    errorMessage: getPostErrorMessage(state),
  };
};

export const mapDispatchToProps = dispatch => ({
  fetchBlocks(post) {
    if (post !== undefined) {
      return dispatch(action.fetchBlocks(post));
    }
    return undefined;
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DragDropContext(HTML5Backend)(EditPostContainer));
