import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tag } from './Tag';
import * as actions from '../actions';
import * as api from '../api';
import { SET_TAGS } from '../constants/index';

export class TagContainer extends React.Component {

  componentWillMount() {
    this.props.fetchSuggestedTags();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isEditingTags && !this.props.isEditingTags) {
      this.props.fetchSuggestedTags();
    }
  }

  render() {
    const { post, isEditingTags, addTag, removeTag, setSelection, suggestedTags } = this.props;

    return (
      <Tag
        post={post}
        isEditingTags={isEditingTags}
        addTag={addTag}
        removeTag={removeTag}
        setSelection={setSelection}
        suggestedTags={suggestedTags}
      />
    );
  }
}

TagContainer.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    tags: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
      }),
    ),
  }).isRequired,
  isEditingTags: PropTypes.bool,
  suggestedTags: PropTypes.arrayOf(PropTypes.string),
  setSelection: PropTypes.func.isRequired,
  addTag: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired,
  fetchSuggestedTags: PropTypes.func.isRequired,
};

TagContainer.defaultProps = {
  isEditingTags: false,
  suggestedTags: [],
};

const mapStateToProps = (state, { isEditingTags }) => ({
  isEditingTags,
  suggestedTags: state.tags,
});

export const mapDispatchToProps = (dispatch, { setSelection }) => ({
  addTag(postId, tag) {
    return dispatch(
      actions.addTag(
        postId,
        { name: tag },
      ),
    );
  },
  removeTag(postId, tag) {
    dispatch(actions.removeTag(postId, tag.id));
  },
  fetchSuggestedTags() {
    api.fetchTags()
      .then(
        (resp) => {
          dispatch({
            type: SET_TAGS,
            tags: resp.data.data.map(tag => tag.name),
          });
        },
        () => {
          // ignore error
        },
      );
  },
  setSelection,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TagContainer);
