import React from 'react';
import PropTypes from 'prop-types';
import { Button, List, ListItem, withStyles } from 'material-ui';
import ContentAdd from 'material-ui-icons/Add';
import BlockComponent from './BlockComponent';

const styles = {
  floatingButtonStyle: {
    float: 'right',
    color: '#333435',
    backgroundColor: '#fff',
    marginTop: '1.5em',
    marginBottom: '1em',
  },
};

const BlockEditors = ({
  post,
  handleSetBlocks,
  handleAddBlock,
  focusedBlockId,
  onFocus,
  onBlur,
}) =>
  (
    <React.Fragment>
      <List>
        {
          post.blocks.length > 0 ?
            post.blocks.map((block, index) =>
              (
                <ListItem >
                  <BlockComponent
                    key={block.id || block.tempid}
                    postId={post.id}
                    block={block}
                    blocks={post.blocks}
                    blockIndex={index}
                    // onFocus={() => onFocus(block)}
                    onBlur={onBlur}
                    isFocused={(
                      block.id === focusedBlockId
                      || block.tempid === focusedBlockId
                    ) && focusedBlockId !== undefined}
                    handleSetBlocks={handleSetBlocks}
                  />
                </ListItem>
              )) : <ListItem style={{ paddingTop: '1em' }}>No blocks created yet.</ListItem>
        }
      </List>
      <Button
        variant="fab"
        onClick={() => handleAddBlock()}
      >
        <ContentAdd />
      </Button>
    </React.Fragment>
  );

BlockEditors.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    blocks: PropTypes.arrayOf(PropTypes.shape({
      dialect: PropTypes.string.isRequired,
      text: PropTypes.string,
    })),
  }).isRequired,
  focusedBlockId: PropTypes.string,
  handleSetBlocks: PropTypes.func.isRequired,
  handleAddBlock: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};

BlockEditors.defaultProps = {
  focusedBlockId: undefined,
};

export default withStyles(styles)(BlockEditors);
