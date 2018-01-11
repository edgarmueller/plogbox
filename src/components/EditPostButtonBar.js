import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, Tooltip } from 'material-ui';
import NavigationCheck from 'material-ui-icons/Check';
import ContentArchive from 'material-ui-icons/Archive';
import ContentUnarchive from 'material-ui-icons/Unarchive';
import ContentSave from 'material-ui-icons/Save';

const EditPostButtonBar =
  ({
     post,
     exportPost,
     importPost,
     savePost,
     upload,
   }) =>
    (
      <span>
        <Tooltip title="Save this post">
          <IconButton onClick={() => savePost(post)}>
            <ContentSave />
          </IconButton>
        </Tooltip>

        <Tooltip title="Save and go back to post list">
          <IconButton onClick={() => savePost(post, true)}>
            <NavigationCheck />
          </IconButton>
        </Tooltip>

        <Tooltip title="Export thist post as a JSON file">
          <IconButton onClick={() => exportPost(post)}>
            <ContentArchive />
          </IconButton>
        </Tooltip>

        <Tooltip title="Import the blocks of an exported post">
          <IconButton onClick={() => importPost()}>
            <ContentUnarchive />
          </IconButton>
        </Tooltip>

        <input
          id={'upload'}
          type="file"
          style={{ display: 'none' }}
          onChange={event => upload(post, event.target.files[0])}
        />
      </span>
    );

EditPostButtonBar.propTypes = {
  // TODO: duplciate prop type definition
  post: PropTypes.shape({
    title: PropTypes.string,
    blocks: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  exportPost: PropTypes.func.isRequired,
  importPost: PropTypes.func.isRequired,
  savePost: PropTypes.func.isRequired,
  upload: PropTypes.func.isRequired,

  handleSetBlocks: PropTypes.func.isRequired,
};

EditPostButtonBar.defaultProps = {
  blocks: [],
};

export default EditPostButtonBar;
