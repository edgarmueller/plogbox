import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import EditPost from './EditPost';
import { RESET_ERROR_MESSAGE } from '../constants/index';
import * as action from '../actions';
import { getBlocks, getIsFetchingBlock, getPostErrorMessage, getSelectedPost } from '../reducers';

class EditPostContainer extends React.Component {

  componentWillMount() {
    const { fetchBlocks, selectedPost } = this.props;
    fetchBlocks(selectedPost);
  }

  render() {
    return <EditPost {...this.props} />;
  }
}

export default DragDropContext(HTML5Backend)(EditPostContainer);

EditPostContainer.propTypes = {
  fetchBlocks: PropTypes.func.isRequired,
  addBlock: PropTypes.func.isRequired,
  resetErrorMessage: PropTypes.func.isRequired,
  updatePostTitle: PropTypes.func.isRequired,
  blocks: PropTypes.arrayOf(
    PropTypes.shape({
      dialect: PropTypes.string.isRequired,
      text: PropTypes.string,
    }),
  ),
  selectedPost: PropTypes.shape({
    title: PropTypes.string,
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
  addBlock(postId, dialect, text, index) {
    const block = {
      dialect,
      text,
      index,
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

