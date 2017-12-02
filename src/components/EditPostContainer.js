import React from 'react';
import PropTypes from 'prop-types';
import EditPost from './EditPost';
import { RESET_ERROR_MESSAGE } from '../constants/index';
import * as action from '../actions';
import { getBlocks, getIsFetchingBlock, getPostErrorMessage, getSelectedPost } from '../reducers';

export class EditPostContainer extends React.Component {

  componentWillMount() {
    const { fetchBlocks, selectedPost } = this.props;
    fetchBlocks(selectedPost);
  }

  render() {
    return <EditPost {...this.props} />;
  }
}

EditPostContainer.propTypes = {
  fetchBlocks: PropTypes.func.isRequired,
  addBlock: PropTypes.func.isRequired,
  resetErrorMessage: PropTypes.func.isRequired,
  updatePostTitle: PropTypes.func.isRequired,
  selectedPost: PropTypes.shape({
    title: PropTypes.string,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        dialect: PropTypes.string.isRequired,
        text: PropTypes.string,
      }),
    ),
  }).isRequired,
};

export const mapStateToProps = state => ({
  selectedPost: getSelectedPost(state),
  userId: state.auth.userId,
  blocks: getBlocks(state),
  isFetchingBlock: getIsFetchingBlock(state),
  errorMessage: getPostErrorMessage(state),
});

export const mapDispatchToProps = dispatch => ({
  fetchBlocks(post) {
    return dispatch(action.fetchBlocks(post));
  },
  addBlock(postId, dialect, text) {
    const block = {
      dialect,
      text,
    };
    return dispatch(action.addBlock(postId, block));
  },
  updatePostTitle(title) {
    dispatch(action.updatePostTitle(title));
  },
  resetErrorMessage() {
    dispatch({
      type: RESET_ERROR_MESSAGE,
    });
  },
});

