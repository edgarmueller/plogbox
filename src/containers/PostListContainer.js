import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as routerActions from 'react-router-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, withStyles } from 'material-ui';
import * as actions from '../actions';
import { getIsFetchingPosts, getIsUpdatingPost, getPostErrorMessage, getSelectedPosts } from '../reducers/index';
import { RESET_ERROR_MESSAGE, SELECT_POST } from '../constants';
import PostList from '../components/PostList';
import { center } from '../common/styles';

const styles = {
  center
};

const Loading = withStyles(styles)(({ classes }) => (<p className={classes.center}>Loading posts...</p>));

export class PostListContainer extends React.Component {
  componentWillMount() {
    // this.props.fetchPosts();
    // clear any previously selected post
    localStorage.removeItem('selectedPostId');
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isUpdatingPost && !this.props.isUpdatingPost) {
      // re-fetch in case an update was happening in the background
      // this.props.fetchPosts();
    }
  }

  render() {
    const {
      posts,
      errorMessage,
      isFetchingPosts,
      isUpdatingPost,
      addPost,
      resetErrorMessage,
      handlePostSelected,
      deletePost,
      selectPost,
    } = this.props;

    if (isFetchingPosts || isUpdatingPost) {
      return <Loading />;
    }

    if (_.isEmpty(posts)) {
      return (
        <div style={{ position: 'relative', top: '50%', left: '50%' }}>
          No posts available
        </div>
      );
    }

    return (
      <div>
        <PostList
          posts={posts}
          addPost={addPost}
          handlePostSelected={handlePostSelected}
          deletePost={deletePost}
          selectPost={selectPost}
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
  isUpdatingPost: PropTypes.bool,
  errorMessage: PropTypes.string,
  addPost: PropTypes.func.isRequired,
  resetErrorMessage: PropTypes.func.isRequired,
  // fetchPosts: PropTypes.func.isRequired,
  selectPost: PropTypes.func.isRequired,
  handlePostSelected: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

PostListContainer.defaultProps = {
  posts: [],
  isFetchingPosts: false,
  isUpdatingPost: false,
  errorMessage: undefined,
};

const mapStateToProps = (state) => {
  const posts = getSelectedPosts(state);
  return {
    posts,
    errorMessage: getPostErrorMessage(state),
    isFetchingPosts: getIsFetchingPosts(state),
    isUpdatingPost: getIsUpdatingPost(state),
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
  selectPost(post) {
    dispatch({
      type: SELECT_POST,
      post
    });
  }
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostListContainer));

