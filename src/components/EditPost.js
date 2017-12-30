import React from 'react';
import * as _ from 'lodash';
import {
  AppBar,
  Button,
  Card,
  CardContent,
  DialogTitle,
  withStyles,
  TextField,
  Toolbar,
} from 'material-ui';
import ContentAdd from 'material-ui-icons/Add';

import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import BlockComponent from './BlockComponent';
import EditPostButtonBar from './EditPostButtonBarContainer';
import RenderedBlock from './RenderedBlockContainer';

const styles = () => ({
  flex: {
    flex: 1,
  },
  MuiCardContent: {
    padding: 0,
  },
});


function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}


const RenderedPost = ({ post, blocks, isFetchingBlock, focusedBlockId }) => {
  return (
    <div>
      {
        blocks.map(block =>
          (
            <RenderedBlock
              key={block.id || block.tempid}
              postId={post.id}
              isFetchingBlock={isFetchingBlock}
              block={block}
              isFocused={block === focusedBlockId}
            />
          )
        )
      }
    </div>
  );
};

RenderedPost.propTypes = {
  blocks: PropTypes.arrayOf(
    PropTypes.shape({
      dialect: PropTypes.string.isRequired,
      text: PropTypes.string,
    }),
  ),
  post: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  isFetchingBlock: PropTypes.bool.isRequired,
  focusedBlockId: PropTypes.number
};

class EditPost extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: '',
      text: '',
      focusedBlockId: undefined,
    };
    this.handleAddBlock = this.handleAddBlock.bind(this);
  }

  handleAddBlock() {
    const { blocks, handleSetBlocks } = this.props;
    handleSetBlocks(blocks.slice().concat({
      dialect: 'markdown',
      text: '',
      index: blocks.length,
      tempid: guid()
    }));
  }

  render() {
    const {
      handleSetBlocks,
      blocks,
      post,
      handleUpdatePost,
      errorMessage,
      isFetchingBlock,
      classes,
    } = this.props;

    return (
      <div>
        <Card>
          <CardContent className={classes.MuiCardContent}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <AppBar position="static" color={'default'}>
                <Toolbar>
                  <TextField
                    name="title"
                    type="text"
                    label="Post Title"
                    value={post.title}
                    onChange={ev => handleUpdatePost({
                      ...post,
                      title: ev.target.value,
                    })}
                  />
                  <EditPostButtonBar
                    post={post}
                    blocks={blocks}
                    handleSetBlocks={handleSetBlocks}
                  />
                </Toolbar>
              </AppBar>
            </div>
            <div style={{
              paddingTop: '1em',
              paddingLeft: '1em',
              paddingRight: '1em',
              display: 'flex',
            }}
            >
              <div style={{
                width: '50%',
                marginRight: '1em',
              }}
              >
                {
                  blocks.map((block, index) =>
                      (
                        <BlockComponent
                          key={block.id || block.tempid}
                          postId={post.id}
                          block={block}
                          blocks={blocks}
                          blockIndex={index}
                          onFocus={() => this.setState({ focusedBlockId: block.id })}
                          isFocused={block.id === this.state.focusedBlockId}
                          handleSetBlocks={handleSetBlocks}
                        />
                      ),
                  )
                }
                <div style={{
                  marginTop: '1em',
                }}
                >
                  <Button
                    fab
                    onClick={() => this.handleAddBlock()}
                    color="default"
                  >
                    <ContentAdd />
                  </Button>
                </div>
              </div>
              <div style={{ width: '50%' }}>
                <RenderedPost
                  post={post}
                  blocks={blocks}
                  isFetchingBlock={isFetchingBlock}
                  focusedBlockId={this.state.focusedBlockId}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog
          open={!_.isEmpty(errorMessage)}
        >
          <DialogTitle>An error occurred</DialogTitle>
          <div>
            {errorMessage}
          </div>
        </Dialog>
      </div>
    );
  }
}

EditPost.propTypes = {
  blocks: PropTypes.arrayOf(
    PropTypes.shape({
      dialect: PropTypes.string.isRequired,
      text: PropTypes.string,
    }),
  ),
  post: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
  errorMessage: PropTypes.string,
  isFetchingBlock: PropTypes.bool,
  classes: PropTypes.shape({
    MuiCardContent: PropTypes.string.isRequired,
  }).isRequired,

  handleSetBlocks: PropTypes.func.isRequired,
  handleUpdatePost: PropTypes.func.isRequired,
};

EditPost.defaultProps = {
  blocks: [],
  errorMessage: '',
  isFetchingBlock: false,
};

export default withStyles(styles)(EditPost);

