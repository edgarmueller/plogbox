import React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { routerActions } from 'react-router-redux';
import fileDownload from 'react-file-download';
import Mousetrap from 'mousetrap';
import * as action from '../actions/index';
import EditPostButtonBar from './EditPostButtonBar';

export class EditPostButtonBarContainer extends React.Component {

  componentDidMount() {
    const {
      savePostAndExit,
      blocks,
      post,
    } = this.props;

    /* istanbul ignore if  */
    if (process.env.NODE_ENV !== 'test') {
      Mousetrap.bind(['ctrl+x'], () => savePostAndExit(post, blocks));
    }
  }

  render() {
    return (<EditPostButtonBar {...this.props} />);
  }
}

EditPostButtonBarContainer.propTypes = EditPostButtonBar.propTypes;

EditPostButtonBarContainer.defaultProps = EditPostButtonBar.defaultProps;

export const mapDispatchToProps = (dispatch, ownProps) => ({
  savePost(selectedPost, blocks, shouldExit) {
    const post = _.cloneDeep(selectedPost);
    post.blocks = blocks;

    if (shouldExit) {
      dispatch(action.updatePost(post));
      return dispatch(routerActions.push('/posts'));
    }

    return dispatch(action.updatePost(post));
  },
  exportPost(blocks) {
    fileDownload(JSON.stringify(blocks), 'export.json');
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
)(EditPostButtonBarContainer);
