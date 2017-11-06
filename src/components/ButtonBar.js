import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentArchive from 'material-ui/svg-icons/content/archive';
import ContentUnarchive from 'material-ui/svg-icons/content/unarchive';

const ButtonBar = ({ exportPosts, importPosts, importPostsFromFile, posts }) => (
  <div>
    <FloatingActionButton
      onClick={() => exportPosts(posts)}
      backgroundColor="#913d88"
      mini
    >
      <ContentArchive />
    </FloatingActionButton>

    <FloatingActionButton
      onClick={importPosts}
      backgroundColor="#913d88"
      mini
    >
      <ContentUnarchive />
    </FloatingActionButton>

    <input
      id={'upload'}
      type="file"
      style={{ display: 'none' }}
      onChange={
        ev => importPostsFromFile(_.head(ev.target.files))
      }
    />
  </div>
);

ButtonBar.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  exportPosts: PropTypes.func.isRequired,
  importPosts: PropTypes.func.isRequired,
  importPostsFromFile: PropTypes.func.isRequired,
};

ButtonBar.defaultProps = {
  posts: [],
};

export default ButtonBar;
