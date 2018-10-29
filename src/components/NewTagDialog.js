import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from 'material-ui';
import { connect } from 'react-redux';
import * as dropbox from '../api/dropbox';
import * as actions from '../actions';

class NewTagDialog extends React.Component {
  state = {
    tag: '',
    success: undefined,
    error: undefined,
  };

  createTag = (tag) => {
    dropbox.createTag(tag)
      .then(
        () => {
          this.setState({
            success: true
          });
          // re-fetch tags
          this.props.fetchTags();
          this.props.handleClose();
        },
        () => this.setState({
          success: false,
          error: 'Couldn\'t create tag'
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
            label="Tag name"
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
  open: PropTypes.bool.isRequired,
  fetchTags: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  fetchTags() {
    dispatch(actions.fetchTags());
  }
});

export default connect(null, mapDispatchToProps)(NewTagDialog);
