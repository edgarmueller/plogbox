import React from 'react';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { IconButton } from 'material-ui';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import ContentArchive from 'material-ui/svg-icons/content/archive';
import ContentUnarchive from 'material-ui/svg-icons/content/unarchive';
import ContentSave from 'material-ui/svg-icons/content/save';

const EditPostButtonBar =
  ({
     post,
     blocks,
     exportPost,
     importPost,
     savePost,
     upload,
   }) =>
    (
      <span>
        <IconButton
          onClick={() => savePost(post, blocks)}
          tooltip={'Save this post'}
        >
          <ContentSave />
        </IconButton>

        <IconButton
          onClick={() => savePost(post, blocks, true)}
          tooltip={'Save and go back to post list'}
        >
          <NavigationCheck />
        </IconButton>

        <IconButton
          onClick={() => exportPost(blocks)}
          tooltip={'Export thist post as a JSON file'}
        >
          <ContentArchive />
        </IconButton>

        <IconButton
          onClick={() => importPost()}
          tooltip={'Import the blocks of an exported post'}
        >
          <ContentUnarchive />
        </IconButton>

        <input
          id={'upload'}
          type="file"
          style={{ display: 'none' }}
          onChange={event => upload(event.target.files[0])}
        />
      </span>
    );

EditPostButtonBar.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.object),
  // TODO: duplciate prop type definition
  post: PropTypes.shape({
    title: PropTypes.string,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        dialect: PropTypes.string.isRequired,
        text: PropTypes.string,
      }),
    ),
  }).isRequired,
  exportPost: PropTypes.func.isRequired,
  importPost: PropTypes.func.isRequired,
  savePost: PropTypes.func.isRequired,
  savePostAndExit: PropTypes.func.isRequired,
  upload: PropTypes.func.isRequired,
};

EditPostButtonBar.defaultProps = {
  blocks: [],
};

export default EditPostButtonBar;
