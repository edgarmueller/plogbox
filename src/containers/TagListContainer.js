import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TagList from '../components/TagList';
import * as actions from '../actions';
import * as api from '../api';
import { getAllPosts } from '../reducers';

export class TagListContainer extends React.Component {
  componentWillMount() {
    // this.props.fetchTags();
  }

  render() {
    const { selectPostsByTag, tags } = this.props;

    return (
      <TagList
        tags={tags}
        // addTag={addTag}
        onSelect={tag => selectPostsByTag(tag)}
      />
    );
  }
}

TagListContainer.propTypes = {
  // addTag: PropTypes.func.isRequired,
  // fetchTags: PropTypes.func.isRequired,
  selectPostsByTag: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string)
};

TagListContainer.defaultProps = {
  tags: [],
};

const mapStateToProps = state => ({
  posts: getAllPosts(state),
  tags: state.tags.tags,
});

export const mapDispatchToProps = dispatch => ({
  createTag(tag) {
    return api.createTag(tag);
  },
  removeTag(postId, tag) {
    dispatch(actions.removeTag(postId, tag.id));
  },
  fetchTags() {
    dispatch(actions.fetchTags());
  },
  fetchPosts() {
    dispatch(actions.fetchPosts());
  },
  selectPostsByTag(tag) {
    dispatch(actions.selectPostsByTag(tag));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TagListContainer);
