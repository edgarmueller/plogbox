import React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentArchive from 'material-ui/svg-icons/content/archive';
import ContentUnarchive from 'material-ui/svg-icons/content/unarchive';
import ContentSave from 'material-ui/svg-icons/content/save';
import fileDownload from 'react-file-download';
import * as action from '../actions/index';
import { getBlocks, getSelectedPost } from '../reducers/index';


const EditPostButtonBar = ({ post, blocks, addBlock, exportPost, importPost, savePost }) => (
  <div>

    <FloatingActionButton
      onClick={() => savePost(post, blocks)}
      backgroundColor="#913d88"
      mini
    >
      <ContentSave />
    </FloatingActionButton>

    <FloatingActionButton
      onClick={() => exportPost(blocks)}
      backgroundColor="#913d88"
      mini
    >
      <ContentArchive />
    </FloatingActionButton>

    <FloatingActionButton
      onClick={() => importPost()}
      backgroundColor="#913d88"
      mini
    >
      <ContentUnarchive />
    </FloatingActionButton>

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
  </div>
);

EditPostButtonBar.propTypes = {
  // TODO
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
};

EditPostButtonBar.defaultProps = {
  blocks: [],
};

const mapStateToProps = state => ({
  post: getSelectedPost(state),
  blocks: getBlocks(state),
});


export const mapDispatchToProps = dispatch => ({
  savePost(selectedPost, blocks) {
    dispatch(action.updatePost(selectedPost, blocks));
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
