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
import * as dropbox from '../api/dropbox';
import * as actions from '../actions';

class RenameTagDialog extends React.Component {
  state = {
    newTagName: '',
    success: undefined,
    error: undefined,
  };

  renameTag = (tag, newTagName) => {
    dropbox.renameTag(tag, newTagName)
      .then(
        () => {
          this.setState({
            success: true
          });
          // re-fetch tags
          this.props.fetchTags();
          this.props.handleClose();
        },
        error => {
          console.log('rename error',error);
          this.setState({
            success: false,
            error: `Could not rename tag (reason: ${error.error.error_summary})`
          })
        }
      );
  };

  render() {
    const { open, handleClose, tag } = this.props;

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add a name for the new tag
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Tag name"
            fullWidth
            onChange={ev => this.setState({ newTagName: ev.target.value })}
            error={this.state.success === false}
            helperText={this.state.success === false ? this.state.error : undefined}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => this.renameTag(tag, this.state.newTagName)}
            color="primary"
          >
            Rename tag
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

RenameTagDialog.propTypes = {
  tag: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  fetchTags: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  fetchTags() {
    dispatch(actions.fetchTags());
  }
});

export default connect(null, mapDispatchToProps)(RenameTagDialog);
