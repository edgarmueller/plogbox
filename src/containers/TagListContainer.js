import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TagList from '../components/TagList';
import * as actions from '../actions';

export class TagListContainer extends React.Component {

  render() {
    const { currentTag, selectPostsByTag, tags } = this.props;

    return (
      <TagList
        currentTag={currentTag}
        tags={tags}
        onSelect={tag => selectPostsByTag(tag)}
      />
    );
  }
}

TagListContainer.propTypes = {
  currentTag: PropTypes.string,
  selectPostsByTag: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string)
};

TagListContainer.defaultProps = {
  tags: [],
};

const mapStateToProps = state => ({
  // TODO: use selectors
  tags: state.tags.tags,
  currentTag: state.posts.posts.tag
});

export const mapDispatchToProps = dispatch => ({
  fetchTags() {
    dispatch(actions.fetchTags());
  },
  selectPostsByTag(tag) {
    dispatch(actions.selectPostsByTag(tag));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TagListContainer);
