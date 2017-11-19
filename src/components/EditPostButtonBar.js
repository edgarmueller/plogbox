import React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import { IconButton } from 'material-ui';
import NavigationCheck from 'material-ui/svg-icons/navigation/check';
import ContentArchive from 'material-ui/svg-icons/content/archive';
import ContentUnarchive from 'material-ui/svg-icons/content/unarchive';
import ContentSave from 'material-ui/svg-icons/content/save';
import fileDownload from 'react-file-download';
import * as action from '../actions/index';
import { getBlocks, getSelectedPost } from '../reducers/index';


const EditPostButtonBar =
  ({ post, blocks, addBlock, exportPost, importPost, savePost, savePostAndExit }) => (
    <span>

      <IconButton
        onClick={() => savePost(post, blocks)}
        tooltip={'Save this post'}
      >
        <ContentSave />
      </IconButton>

      <IconButton
        onClick={() => savePostAndExit(post, blocks)}
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
        onChange={(event) => {
          // TODO: pull out
          const reader = new FileReader();
          reader.onload = (ev) => {
            const readBlocks = JSON.parse(ev.target.result);
            _.each(readBlocks, block => addBlock(
              post.id,
              block.dialect,
              block.text,
            ));
          };
          reader.readAsText(event.target.files[0]);
        }}
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
  addBlock: PropTypes.func.isRequired,
  exportPost: PropTypes.func.isRequired,
  importPost: PropTypes.func.isRequired,
  savePost: PropTypes.func.isRequired,
  savePostAndExit: PropTypes.func.isRequired,
};

EditPostButtonBar.defaultProps = {
  blocks: [],
};

const mapStateToProps = state => ({
  post: getSelectedPost(state),
  blocks: getBlocks(state),
});


export const mapDispatchToProps = dispatch => ({
  addBlock(postId, dialect, text) {
    const block = {
      dialect,
      text,
    };
    return dispatch(action.addBlock(postId, block));
  },
  savePost(selectedPost, blocks) {
    dispatch(action.updatePost(selectedPost, blocks));
  },
  savePostAndExit(selectedPost, blocks) {
    dispatch(action.updatePost(selectedPost, blocks));
    dispatch(routerActions.push('/posts'));
  },
  exportPost(blocks) {
    fileDownload(JSON.stringify(blocks), 'export.json');
  },
  importPost() {
    document.getElementById('upload').click();
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPostButtonBar);
