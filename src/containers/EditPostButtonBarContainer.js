import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui';
import * as _ from 'lodash';
import { routerActions } from 'react-router-redux';
import fileDownload from 'react-file-download';
// import Mousetrap from 'mousetrap';
import * as action from '../actions/index';
import EditPostButtonBar from '../components/EditPostButtonBar';
import { withPost } from '../common/withPost';

const styles = () => ({
  hidden: {
    display: 'none',
  },
});

export const EditPostButtonBarContainer = (props) => (
  <EditPostButtonBar {...props} />
);

EditPostButtonBarContainer.propTypes = EditPostButtonBar.propTypes;

EditPostButtonBarContainer.defaultProps = EditPostButtonBar.defaultProps;

export const mapDispatchToProps = (dispatch, ownProps) => ({
  navigateToPosts() {
    dispatch(routerActions.push('/posts'));
  },
  savePost(selectedPost) {
    const post = _.cloneDeep(selectedPost);
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
      // post.blocks = readBlocks;
      // action.updatePost(post);
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

