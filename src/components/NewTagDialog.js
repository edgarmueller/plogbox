import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from 'material-ui';
import * as api from '../api';

class NewTagDialog extends React.Component {
  state = {
    tag: '',
    success: undefined,
    error: undefined,
  };

  createTag = (tag) => {
    api.createTag(tag)
      .then(
        () => {
          this.setState({
            success: true
          });
          this.props.handleClose();
        },
        error => this.setState({
          success: false,
          error: error.response.data.messages.join(' ')
        }),
      );
  };

  render() {
    const { open, handleClose } = this.props;

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
            label="Tag"
            fullWidth
            onChange={ev => this.setState({ tag: ev.target.value })}
            error={this.state.success === false}
            helperText={this.state.success === false ? this.state.error : undefined}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => this.createTag(this.state.tag)}
            color="primary"
          >
            Create tag
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

NewTagDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default NewTagDialog;
