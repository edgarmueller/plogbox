import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as routerActions from 'react-router-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';
import * as actions from '../actions';
import {
  getCurrentTag,
  getIsFetchingPosts,
  getIsUpdatingPost,
  getPostErrorMessage,
  getSelectedPosts
} from '../reducers/index';
import { RESET_ERROR_MESSAGE, SELECT_POST } from '../constants';
import PostList from '../components/PostList';
import { center } from '../common/styles';
import { pushFile } from '../api/dropbox';

const styles = {
  center
};

const NoPosts = withStyles(styles)(({ classes }) => (
  <div className={classes.center}>
    No posts available
  </div>
));

const Loading = withStyles(styles)(({ classes }) => (
  <p className={classes.center}>Loading posts...</p>
));

export class PostListContainer extends React.Component {
  componentWillMount() {
    // clear any previously selected post
    localStorage.removeItem('selectedPostId');
  }

  render() {
    const {
      tag,
      posts,
      isFetchingPosts,
      addPost,
      handlePostSelected,
      deletePost,
      selectPost,
    } = this.props;

    if (isFetchingPosts) {
      return <Loading />;
    }

    if (_.isEmpty(posts)) {
      return (<NoPosts />);
    }

    return (
      <div>
        <PostList
          tag={tag}
          posts={posts}
          addPost={addPost}
          handlePostSelected={handlePostSelected}
          deletePost={deletePost}
          selectPost={selectPost}
        />
      </div>
    );
  }
}

PostListContainer.propTypes = {
  tag: PropTypes.string,
  posts: PropTypes.arrayOf(PropTypes.object),
  isFetchingPosts: PropTypes.bool,
  addPost: PropTypes.func.isRequired,
  selectPost: PropTypes.func.isRequired,
  handlePostSelected: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

PostListContainer.defaultProps = {
  tag: undefined,
  posts: [],
  isFetchingPosts: false,
};

const mapStateToProps = (state) => {
  const posts = getSelectedPosts(state);
  const tag = getCurrentTag(state);
  return {
    tag,
    posts,
    errorMessage: getPostErrorMessage(state),
    isFetchingPosts: getIsFetchingPosts(state),
    isUpdatingPost: getIsUpdatingPost(state),
  };
};

export const mapDispatchToProps = dispatch => ({
  addPost(tag, fileName) {
    pushFile(`/${tag}/${fileName}`, '')
      .then(() => dispatch(actions.selectPostsByTag(tag)));
  },

  fetchPosts(tag) {
    actions.selectPostsByTag(tag);
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

