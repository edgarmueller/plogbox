import React from 'react';
import * as _ from 'lodash';
import fileDownload from 'react-file-download';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as api from '../api';
import ButtonBar from './ButtonBar';

import { CREATE_POST_SUCCESS } from '../constants';

const ButtonBarContainer = ({ exportPosts, importPosts, importPostsFromFile }) => {
  return (
    <ButtonBar
      exportPosts={exportPosts}
      importPosts={importPosts}
      importPostsFromFile={importPostsFromFile}
    />
  );
};

export const mapDispatchToProps = dispatch => ({
  exportPosts(posts) {
    const postsWithBlocks = _.map(posts, post =>
      api.fetchBlocks(post.id)
        .then(
          (resp) => {
            const clonedPost = _.clone(post);
            clonedPost.blocks = resp.data.data;
            return clonedPost;
          },
          () =>
            console.error('An error occurred during post export'),
        ),
    );
    return Promise.all(postsWithBlocks)
      .then(
        (resolved) => {
          fileDownload(JSON.stringify(resolved), 'plog-posts-export.json');
        },
        // TODO: proper error handling
        () => console.error('An error occurred during post export'),
      );
  },
  importPosts() {
    document.getElementById('upload').click();
  },
  importPostsFromFile(file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const readPosts = JSON.parse(ev.target.result);
      _.each(readPosts, (postWithBlocks) => {
        let postId;
        const postPromise = api.createPost({
          title: postWithBlocks.title,
          isDraft: postWithBlocks.isDraft,
          date: postWithBlocks.date,
        }).then(
          (resp) => {
            dispatch({
              type: CREATE_POST_SUCCESS,
              post: resp.data.data,
            });
            postId = resp.data.data.id;
          },
          // TODO: fix error handling
          () => console.error('error during improt'),
        );
        postPromise.then(
          () => {
            _.each(postWithBlocks.blocks, block =>
              api.addBlock(postId, {
                dialect: block.dialect,
                text: block.text,
              }),
            );
          },
          // TODO: fix error handling
          () => console.error('error during post import'),
        );
      });
    };
    reader.readAsText(file);
  },
});

ButtonBarContainer.propTypes = {
  exportPosts: PropTypes.func.isRequired,
  importPosts: PropTypes.func.isRequired,
  importPostsFromFile: PropTypes.func.isRequired,
};

export default connect(
  null,
  mapDispatchToProps,
)(ButtonBarContainer);
