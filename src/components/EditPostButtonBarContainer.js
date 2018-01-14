import React from 'react';
import { connect } from 'react-redux';
import { IconButton, TextField, Tooltip, withStyles } from 'material-ui';
import NavigationCheck from 'material-ui-icons/Check';
import ContentArchive from 'material-ui-icons/Archive';
import ContentUnarchive from 'material-ui-icons/Unarchive';
import ContentSave from 'material-ui-icons/Save';

import * as _ from 'lodash';
import { routerActions } from 'react-router-redux';
import fileDownload from 'react-file-download';
// import Mousetrap from 'mousetrap';
import * as action from '../actions/index';
import EditPostButtonBar from './EditPostButtonBar';
import { withPost } from '../common/withPost';

const styles = () => ({
  hidden: {
    display: 'none',
  },
});

const EditPostButtonBarContainer = (
  {
    post,
    classes,
    exportPost,
    importPost,
    savePost,
    upload,
    showTitle,
    handleUpdatePost,
    navigateToPosts,
  }) => (
    <span>
      {
        showTitle &&
        <TextField
          name="title"
          type="text"
          label="Post Title"
          value={post.title}
          onChange={ev => handleUpdatePost({
            ...post,
            title: ev.target.value,
          })}
        />
      }
      <Tooltip title="Save this post">
        <IconButton
          onClick={() => savePost(post)
            .then(
              (updatedPost) => {
                handleUpdatePost(updatedPost);
              },
              // TODO: error handling
              error => console.error('TODO: error occurred', error),
            )
          }
        >
          <ContentSave />
        </IconButton>
      </Tooltip>

      <Tooltip title="Save and go back to post list">
        <IconButton
          onClick={
            () => savePost(post)
              .then(
                (updatedPost) => {
                  handleUpdatePost(updatedPost);
                  navigateToPosts();
                },
                // TODO: error handling
                error => console.error('TODO: error occurred', error),
              )
          }
        >
          <NavigationCheck />
        </IconButton>
      </Tooltip>

      <Tooltip title="Export this post as a JSON file">
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
        className={classes.hidden}
        onChange={event => upload(post, event.target.files[0])}
      />
    </span>
  );

EditPostButtonBarContainer.propTypes = EditPostButtonBar.propTypes;

EditPostButtonBarContainer.defaultProps = EditPostButtonBar.defaultProps;

export const mapDispatchToProps = (dispatch, ownProps) => ({
  navigateToPosts() {
    dispatch(routerActions.push('/posts'));
  },
  savePost(selectedPost) {
    const post = _.cloneDeep(selectedPost);
    return dispatch(action.updatePost(post));
  },
  exportPost(post) {
    fileDownload(JSON.stringify(post), 'export.json');
  },
  importPost() {
    document.getElementById('upload').click();
  },
  // TODO extract to class
  upload(post, file) {
    // TODO: pull out
    const reader = new FileReader();
    reader.onload = (ev) => {
      const readBlocks = JSON.parse(ev.target.result);
      ownProps.handleSetBlocks(readBlocks);
      // post.blocks = readBlocks;
      // action.updatePost(post);
    };
    reader.readAsText(file);
  },
});

export default connect(
  null,
  mapDispatchToProps,
  null,
  { pure: false },
)(withStyles(styles)(withPost(EditPostButtonBarContainer)));

