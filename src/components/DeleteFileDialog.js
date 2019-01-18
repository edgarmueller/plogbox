import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {connect} from 'react-redux';
import * as dropbox from '../api/dropbox';
import {DELETE_POST_SUCCESS} from "../constants";
import {getCurrentTag} from "../reducers";
import * as CommonPropTypes from '../common/CommonPropTypes'

class DeleteFileDialog extends React.Component {
  state = {
    success: undefined,
    error: undefined,
  };

  render() {
    const { currentTag, deletePost, open, handleClose, file } = this.props;

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete file</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the tag?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              deletePost(currentTag, file)
                .then(
                  () => {
                    this.setState({ success: true });
                    console.log('>>', handleClose)
                    handleClose();
                  },
                  () => this.setState({
                    success: false,
                    error: `Could not delete file`
                  })
                );

            }}
            color="primary"
          >
            Delete tag
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DeleteFileDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  file: CommonPropTypes.post
};

const mapStateToProps = (state) => ({
  // for un-selecting current tag
  currentTag: getCurrentTag(state)
});

const mapDispatchToProps = dispatch => ({
  deletePost(tag, file) {
    console.log('tag', tag);
    console.log('file', file);
    return dropbox.deleteFile(`/${tag}/${file.name}`)
      .then(() => {
        dispatch({
          type: DELETE_POST_SUCCESS,
          post: file
        });
      });
  },
  // deleteTag(tag, unselectPost) {
  //   return dropbox.deleteTag(tag)
  //     .then(
  //       () => {
  //         re-fetch tags
          // if (unselectPost) {
          //   dispatch({
          //     type: SELECT_POST,
          //     post: undefined
          //   });
          //   dispatch(unselectPosts())
          // }
          // return true;
        // },
        // () => false
      // );
  // }
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteFileDialog);
