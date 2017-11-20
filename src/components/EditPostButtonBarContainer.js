import React from 'react';
import { connect } from 'react-redux';
import * as _ from 'lodash';
import { routerActions } from 'react-router-redux';
import fileDownload from 'react-file-download';
import Mousetrap from 'mousetrap';
import * as action from '../actions/index';
import EditPostButtonBar from './EditPostButtonBar';
import { getBlocks, getSelectedPost } from '../reducers/index';


class EditPostButtonBarContainer extends React.Component {

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

EditPostButtonBar.defaultProps = {
  blocks: [],
};

const mapStateToProps = state => ({
  post: getSelectedPost(state),
  blocks: getBlocks(state),
});


export const mapDispatchToProps = dispatch => ({
  addBlock(postId, dialect, text) {
    const block = {
      dialect,
      text,
    };
    return dispatch(action.addBlock(postId, block));
  },
  savePost(selectedPost, blocks, shouldExit) {
    if (shouldExit) {
      dispatch(action.updatePost(selectedPost, blocks));
      return dispatch(routerActions.push('/posts'));
    }
    return dispatch(action.updatePost(selectedPost, blocks));
  },
  exportPost(blocks) {
    fileDownload(JSON.stringify(blocks), 'export.json');
  },
  importPost() {
    document.getElementById('upload').click();
  },
  upload(postId, file) {
    // TODO: pull out
    const reader = new FileReader();
    reader.onload = (ev) => {
      const readBlocks = JSON.parse(ev.target.result);
      _.each(readBlocks, block =>
        dispatch(action.addBlock(postId, block)),
      );
    };
    reader.readAsText(file);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPostButtonBarContainer);
