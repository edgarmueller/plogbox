import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import ContentArchive from 'material-ui-icons/Archive';
import ContentUnarchive from 'material-ui-icons/Unarchive';
import { IconButton } from 'material-ui';

const ButtonBar = ({ exportPosts, importPosts, importPostsFromFile, posts }) => (
  <div>
    <IconButton
      onClick={() => exportPosts(posts)}
      color="default"
    >
      <ContentArchive />
    </IconButton>

    <IconButton
      onClick={importPosts}
      color="default"
    >
      <ContentUnarchive />
    </IconButton>

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
