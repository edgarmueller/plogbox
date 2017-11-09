import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import * as routerActions from 'react-router-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { Dialog, FlatButton } from 'material-ui';
import * as actions from '../actions';
import { getAllPosts, getIsFetchingPosts, getPostErrorMessage } from '../reducers/index';
import '../common/tap';
import { RESET_ERROR_MESSAGE } from '../constants';
import { PostList } from './PostList';

export class PostListContainer extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedRow: -1,
    };
    this.setSelection = this.setSelection.bind(this);
  }

  componentWillMount() {
    const { fetchPosts } = this.props;
    fetchPosts();
  }

  setSelection(didDelete, row, col) {
    // TODO: pass function to setState
    this.setState({
      didDelete,
      selectedRow: row,
      selectedCol: col,
    });
  }

  render() {
    const {
      posts,
      errorMessage,
      isFetchingPosts,
      addPost,
      resetErrorMessage,
      selectPost,
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
          setSelection={this.setSelection}
          selection={{
            row: this.state.selectedRow,
            col: this.state.selectedCol,
          }}
          selectPost={selectPost}
          deletePost={deletePost}
          suggestedTags={this.state.suggestedTags}
        />

        <Dialog
          title="An error occurred"
          actions={[
            <FlatButton
              label="OK"
              primary
              onTouchTap={resetErrorMessage}
            />,
          ]}
          modal
          open={!_.isEmpty(errorMessage)}
        >
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
  selectPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
};

PostListContainer.defaultProps = {
  posts: [],
  isFetchingPosts: false,
  errorMessage: undefined,
};

const mapStateToProps = state => ({
  posts: getAllPosts(state),
  errorMessage: getPostErrorMessage(state),
  isFetchingPosts: getIsFetchingPosts(state),
});

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
  selectPost(post) {
    dispatch(actions.selectPost(post));
    dispatch(routerActions.push('posts/edit'));
  },
  deletePost(post) {
    return dispatch(actions.deletePost(post));
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(PostListContainer));

