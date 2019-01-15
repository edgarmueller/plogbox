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
import * as actions from '../actions';
import {SELECT_POST} from "../constants";
import {getCurrentTag} from "../reducers";
import {unselectPosts} from "../actions";

class DeleteTagDialog extends React.Component {
  state = {
    success: undefined,
    error: undefined,
  };

  render() {
    const { currentTag, deleteTag, open, handleClose, fetchTags } = this.props;

    return (
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete tag</DialogTitle>
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
              deleteTag(this.props.tag, this.props.tag === currentTag)
                .then(
                  () => {
                    fetchTags();
                    this.setState({ success: true });
                    handleClose();
                  },
                  () => this.setState({
                    success: false,
                    error: `Could not delete tag`
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

DeleteTagDialog.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  fetchTags: PropTypes.func.isRequired,
  tag: PropTypes.string.isRequired
};

const mapStateToProps = (state) => ({
  // for un-selecting current tag
  currentTag: getCurrentTag(state)
});

const mapDispatchToProps = dispatch => ({
  fetchTags() {
    dispatch(actions.fetchTags());
  },
  deleteTag(tag, unselectPost) {
    return dropbox.deleteTag(tag)
      .then(
        () => {
          // re-fetch tags
          if (unselectPost) {
            dispatch({
              type: SELECT_POST,
              post: undefined
            });
            dispatch(unselectPosts())
          }
          return true;
        },
        () => false
      );
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DeleteTagDialog);
