import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {connect} from 'react-redux';
import * as dropbox from '../../api/dropbox';
import {DELETE_POST_SUCCESS} from "../../constants";
import {getCurrentTag} from "../../reducers";
import * as CommonPropTypes from '../../common/CommonPropTypes'

class DeletePostDialog extends React.Component {
  state = {
    success: undefined,
    error: undefined,
  };

  render() {
    const { currentTag, deletePost, open, handleClose, post } = this.props;

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              deletePost(currentTag, post)
                .then(
                  () => {
                    this.setState({ success: true });
                    handleClose();
                  },
                  () => this.setState({
                    success: false,
                    error: `Could not delete post`
                  })
                );

            }}
            color="primary"
          >
            Delete post
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DeletePostDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  post: CommonPropTypes.post
};

const mapStateToProps = (state) => ({
  // for un-selecting current tag
  currentTag: getCurrentTag(state)
});

const mapDispatchToProps = dispatch => ({
  deletePost(tag, post) {
    return dropbox.deleteFile(`/${tag}/${post.name}`)
      .then(() => {
        dispatch({
          type: DELETE_POST_SUCCESS,
          post
        });
      });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DeletePostDialog);
