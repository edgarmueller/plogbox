import React from 'react';
import * as _ from 'lodash';
import fileDownload from 'react-file-download';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as api from '../api';
import ButtonBar from './ButtonBar';

import {
  CREATE_POST_SUCCESS,
  EXPORT_POSTS_FAILURE,
} from '../constants';
import { errorHandler } from '../actions/index';

const ButtonBarContainer = ({ exportPosts, importPosts, importPostsFromFile }) => (
  <ButtonBar
    exportPosts={exportPosts}
    importPosts={importPosts}
    importPostsFromFile={importPostsFromFile}
  />
  );

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
        ),
    );
    return Promise.all(postsWithBlocks)
      .then(
        (resolved) => {
          fileDownload(JSON.stringify(resolved), 'plog-posts-export.json');
          return resolved;
        },
      ).catch(error => errorHandler(dispatch, error, EXPORT_POSTS_FAILURE));
  },
  importPosts() {
    document.getElementById('upload').click();
  },
  importPostsFromFile(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = (ev) => {
        const readPosts = JSON.parse(ev.target.result);
        return Promise.all(_.map(readPosts, (postWithBlocks) => {
          const p = api.createPost({
            title: postWithBlocks.title,
            isDraft: postWithBlocks.isDraft,
            date: postWithBlocks.date,
          });
          return p.then(
            (resp) => {
              dispatch({
                type: CREATE_POST_SUCCESS,
                post: resp.data.data,
              });
              return resp.data.data;
            },
            // TODO: fix error handling
            error => reject('error during improt', error),
          ).then(
            post =>
              // TODO: provide API to add mutliple blocks at once
              Promise.all(_.map(postWithBlocks.blocks, block =>
                api.addBlock(post.id, {
                  dialect: block.dialect,
                  text: block.text,
                }),
              )),
            // TODO: fix error handling
            () => reject('error during post import'),
          );
        })).then(resolve);
      };
      reader.readAsText(file);
    });
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
