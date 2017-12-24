import React from 'react';
import { connect } from 'react-redux';
import Tags from './Tags';
import * as actions from '../actions';
import * as api from '../api';
import { SET_TAGS } from '../constants/index';

export class TagsContainer extends React.Component {

  componentWillMount() {
    this.props.fetchSuggestedTags();
    this.setState({
      isEditing: false,
    });
  }


  componentDidUpdate(prevProps) {
    if (prevProps.isEditingTags && !this.props.isEditingTags) {
      this.props.fetchSuggestedTags();
    }
  }

  render() {
    const { post, addTag, removeTag, suggestedTags, isEditing, done } = this.props;

    return (
      <Tags
        post={post}
        isEditing={isEditing}
        addTag={addTag}
        removeTag={removeTag}
        done={done}
        suggestedTags={suggestedTags}
      />
    );
  }
}

TagsContainer.propTypes = Tags.propTypes;
TagsContainer.defaultProps = Tags.defaultProps;

const mapStateToProps = state => ({
  suggestedTags: state.tags,
});

export const mapDispatchToProps = dispatch => ({
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
        (error) => {
          // TODO ignore error?
          console.warn(error);
        },
      );
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TagsContainer);
