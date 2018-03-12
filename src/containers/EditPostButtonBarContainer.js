import React from 'react';
import { connect } from 'react-redux';
import { IconButton, Snackbar, withStyles } from 'material-ui';
import CloseIcon from 'material-ui-icons/Close';
import * as _ from 'lodash';
import { routerActions } from 'react-router-redux';
import fileDownload from 'react-file-download';
import Mousetrap from 'mousetrap';
import * as action from '../actions/index';
import EditPostButtonBar from '../components/EditPostButtonBar';
import { withPost } from '../common/withPost';

const styles = () => ({
  hidden: {
    display: 'none',
  },
});

export class EditPostButtonBarContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    const { savePost } = this.props;

    /* istanbul ignore if  */
    if (process.env.NODE_ENV !== 'test') {
      Mousetrap.bind(['ctrl+x'], () => {
        this.handleOpen();
        savePost(this.props.post);
      });
    }
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ open: false });
  }

  render() {
    return (
      <div>
        <EditPostButtonBar {...this.props} />
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={this.state.open}
          autoHideDuration={2000}
          onClose={this.handleClose}
          SnackbarContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Post saved</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}


EditPostButtonBarContainer.propTypes = EditPostButtonBar.propTypes;

EditPostButtonBarContainer.defaultProps = EditPostButtonBar.defaultProps;

export const mapDispatchToProps = (dispatch, ownProps) => ({
  navigateToPosts() {
    dispatch(routerActions.push('/posts'));
  },
  savePost(selectedPost) {
    const post = _.cloneDeep(selectedPost);
    // update indices upon save
    post.blocks = post.blocks.map((block, index) => {
      block.index = index;
      return block;
    });
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

