import React from 'react';
import { connect } from 'react-redux';
import Tags from '../components/Tags';
import * as actions from '../actions';

export class TagsContainer extends React.Component {

  componentWillMount() {
    this.setState({
      isEditing: false,
    });
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
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TagsContainer);
