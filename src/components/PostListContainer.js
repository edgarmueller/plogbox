import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import * as routerActions from 'react-router-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle } from 'material-ui';
import * as actions from '../actions';
import { getAllPosts, getIsFetchingPosts, getPostErrorMessage } from '../reducers/index';
import '../common/tap';
import { RESET_ERROR_MESSAGE } from '../constants';
import PostList from './PostList';

export class PostListContainer extends React.Component {

  constructor() {
    super();
    this.state = {
      isEditingTags: false,
    };
    this.setSelectedCell = this.setSelectedCell.bind(this);
  }

  componentWillMount() {
    this.props.fetchPosts();
    // clear any previously selected post
    localStorage.removeItem('selectedPostId');
  }

  setSelectedCell(isEditingTags) {
    this.setState(() => ({ isEditingTags }));
  }

  render() {
    const {
      posts,
      errorMessage,
      isFetchingPosts,
      addPost,
      resetErrorMessage,
      handlePostSelected,
      deletePost,
    } = this.props;

    if (isFetchingPosts) {
      return (<p>Loading...</p>);
    }

    return (
      <div>
        <PostList
          posts={posts}
          addPost={addPost}
          handlePostSelected={handlePostSelected}
          deletePost={deletePost}
        />

        <Dialog
          onRequestClose={resetErrorMessage}
          open={!_.isEmpty(errorMessage)}
        >
          <DialogTitle>An error occurred</DialogTitle>
          {errorMessage}
        </Dialog>
      </div>
    );
  }
}

PostListContainer.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  isFetchingPosts: PropTypes.bool,
  errorMessage: PropTypes.string,
  addPost: PropTypes.func.isRequired,
  resetErrorMessage: PropTypes.func.isRequired,
  fetchPosts: PropTypes.func.isRequired,
  handlePostSelected: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

PostListContainer.defaultProps = {
  posts: [],
  isFetchingPosts: false,
  errorMessage: undefined,
};

const mapStateToProps = (state) => {
  const posts = _.filter(getAllPosts(state), post =>
    !_.some(post.tags, tag => tag.name === 'journal'),
  );
  return {
    posts,
    errorMessage: getPostErrorMessage(state),
    isFetchingPosts: getIsFetchingPosts(state),
  };
};

export const mapDispatchToProps = dispatch => ({
  addPost() {
    return dispatch(actions.createPost({
      title: 'New post',
      isDraft: true,
      date: new Date(),
    }));
  },

  fetchPosts() {
    dispatch(actions.fetchPosts());
  },
  resetErrorMessage() {
    dispatch({
      type: RESET_ERROR_MESSAGE,
    });
  },
  deletePost(post) {
    return dispatch(actions.deletePost(post));
  },
  handlePostSelected(post) {
    dispatch(routerActions.push(`/posts/${post.id}`));
    localStorage.setItem('selectedPostId', post.id);
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostListContainer));

