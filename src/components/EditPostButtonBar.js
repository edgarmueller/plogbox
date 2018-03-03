import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, TextField, Tooltip, withStyles } from 'material-ui';
import NavigationCheck from 'material-ui-icons/Check';
import ContentArchive from 'material-ui-icons/Archive';
import ContentUnarchive from 'material-ui-icons/Unarchive';
import ContentSave from 'material-ui-icons/Save';
import EditorIcon from 'material-ui-icons/ModeEdit';
import RenderedDocumentIcon from 'material-ui-icons/Description';
import SideBySideIcon from 'material-ui-icons/BorderVertical';

const styles = () => ({
  hidden: {
    display: 'none',
  },
  inputInkbar: {
    color: 'white',
    '&:after': {
      backgroundColor: '#fff',
    },
  },
  textFieldFormLabel: {
    color: '#121212',
  },
  textFieldInput: {
    color: '#121212',
    '&:focus': {
      color: '#ffffff',
    },
  },
});

const EditPostButtonBar =
  ({
     post,
     classes,
     exportPost,
     importPost,
     savePost,
     upload,
     showTitle,
     handleUpdatePost,
     navigateToPosts,
     handleClickOpenEditor,
     handleClickOpenRenderedView,
     handleClickOpenBoth,
   }) =>
    (
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
            InputLabelProps={{
              shrink: true,
              className: classes.textFieldFormLabel,
            }}
            InputProps={{
              classes: {
                inkbar: classes.inputInkbar,
                input: classes.textFieldInput,
              },
            }}
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

        <Tooltip title={'Toggle side-by-side view'}>
          <IconButton onClick={handleClickOpenBoth} className={classes.sideBySideButton}>
            <SideBySideIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Show Editor'}>
          <IconButton onClick={handleClickOpenEditor} className={classes.editorButton}>
            <EditorIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Show Rendered Document'}>
          <IconButton onClick={handleClickOpenRenderedView} className={classes.viewButton}>
            <RenderedDocumentIcon />
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

EditPostButtonBar.propTypes = {
  classes: PropTypes.shape({
    textFieldFormLabel: PropTypes.string,
  }).isRequired,
  // TODO: duplciate prop type definition
  post: PropTypes.shape({
    title: PropTypes.string,
    blocks: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  exportPost: PropTypes.func.isRequired,
  importPost: PropTypes.func.isRequired,
  savePost: PropTypes.func.isRequired,
  upload: PropTypes.func.isRequired,
  showTitle: PropTypes.bool,

  navigateToPosts: PropTypes.func.isRequired,
  handleUpdatePost: PropTypes.func.isRequired,
  handleClickOpenEditor: PropTypes.func.isRequired,
  handleClickOpenRenderedView: PropTypes.func.isRequired,
  handleClickOpenBoth: PropTypes.func.isRequired,
};

EditPostButtonBar.defaultProps = {
  blocks: [],
  showTitle: false,
  showBoth: true,
  showRenderedView: false,
  showEditor: false,
};

export default withStyles(styles)(EditPostButtonBar);
