import React from 'react';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from 'material-ui';
import { connect } from 'react-redux';
import * as actions from '../actions';

class InputDialog extends React.Component {
  state = {
    value: '',
    success: undefined,
    error: undefined,
  };

  render() {
    const {
      contentText,
      title,
      label,
      open,
      onConfirm,
      confirmButtonText,
      handleClose
    } = this.props;

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {contentText}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={label}
            fullWidth
            onChange={ev => this.setState({ value: ev.target.value })}
            error={this.state.success === false}
            helperText={this.state.success === false ? this.state.error : undefined}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(this.state.value)}
            color="primary"
          >
            {confirmButtonText}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

InputDialog.propTypes = {
  title: PropTypes.string.isRequired,
  contentText: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  confirmButtonText: PropTypes.string,
  onConfirm: PropTypes.func.isRequired
};

InputDialog.defaultProps = {
  confirmButtonText: 'OK'
};

const mapDispatchToProps = dispatch => ({
  fetchTags() {
    dispatch(actions.fetchTags());
  }
});

export default connect(null, mapDispatchToProps)(InputDialog);
