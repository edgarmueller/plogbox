import React from 'react';
import PropTypes from 'prop-types';
import RenderedBlock from '../containers/RenderedBlockContainer';

const RenderedPost = ({ post, isFetchingBlock, focusedBlockId }) => (
  <div>
    {
      post.blocks.map(block =>
        (
          <RenderedBlock
            key={block.id || block.tempid}
            postId={post.id}
            isFetchingBlock={isFetchingBlock}
            block={block}
            isFocused={
              (block.id === focusedBlockId || block.tempid === focusedBlockId)
              && focusedBlockId !== undefined
            }
          />
        ),
      )
    }
  </div>
);

RenderedPost.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        dialect: PropTypes.string.isRequired,
        text: PropTypes.string,
      }),
    ),
  }).isRequired,
  isFetchingBlock: PropTypes.bool.isRequired,
  focusedBlockId: PropTypes.string,
};

RenderedPost.defaultProps = {
  focusedBlockId: undefined,
};

export default RenderedPost;
