import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import * as dropbox from '../../api/dropbox';
import * as actions from '../../actions';

class RenamePostDialog extends React.Component {

  state = {
    newPostName: '',
    success: undefined,
    error: undefined,
  };

  renamePost = (post, newPostName) => {
    dropbox.renamePost(post, newPostName)
      .then(
        () => {
          this.setState({
            success: true
          });
          // re-fetch posts
          this.props.fetchPosts(this.props.tag);
          this.props.handleClose();
        },
        error => {
          this.setState({
            success: false,
            error: `Could not rename post (reason: ${error.error.error_summary})`
          })
        }
      );
  };

  render() {
    const { open, handleClose, post } = this.props;

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Rename post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose a new name for the post
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Post name"
            fullWidth
            onChange={ev => this.setState({ newPostName: ev.target.value })}
            error={this.state.success === false}
            helperText={this.state.success === false ? this.state.error : undefined}
            defaultValue={post.name}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => this.renamePost(post, this.state.newPostName)}
            color="primary"
          >
            Rename post
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

RenamePostDialog.propTypes = {
  tag: PropTypes.string.isRequired,
  post: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  fetchPosts: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  fetchPosts(tag) {
    dispatch(actions.selectPostsByTag(tag));
  }
});

export default connect(null, mapDispatchToProps)(RenamePostDialog);
