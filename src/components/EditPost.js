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

export class EditPost extends React.Component {

  constructor() {
    super();
    this.state = {
      open: false,
      message: '',
      dialect: 'markdown',
      text: '',
      focusedBlockId: -1,
    };
  }

  componentWillMount() {
    // set initial state if we are editing a post
    if (this.props.selectedPost) {
      this.setState({
        text: this.props.selectedPost.text,
      });
    }
  }

  render() {
    const {
      blocks,
      addBlock,
      selectedPost,
      updatePostTitle,
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
                    value={selectedPost.title}
                    onChange={ev => updatePostTitle(ev.target.value)}
                  />
                  <EditPostButtonBar />
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
                marginRight: '1em'
              }}
              >
                {
                  blocks.map((block, index) =>
                      (
                        <BlockComponent
                          key={block.id}
                          postId={selectedPost.id}
                          block={block}
                          isFirstBlock={index === 0}
                          isLastBlock={index === blocks.length - 1}
                          onFocus={() => this.setState({focusedBlockId: block.id})}
                          isFocused={block.id === this.state.focusedBlockId}
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
                    onClick={() => addBlock(selectedPost.id, this.state.dialect, '', blocks.length)}
                    color="default"
                  >
                    <ContentAdd />
                  </Button>
                </div>
              </div>
              <div style={{ width: '50%' }}>
                {
                  blocks.map(block =>
                    (
                      <RenderedBlock
                        key={block.id}
                        postId={selectedPost.id}
                        isFetchingBlock={isFetchingBlock}
                        block={block}
                        isFocused={block.id === this.state.focusedBlockId}
                      />
                    ),
                  )
                }
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
  selectedPost: PropTypes.shape({
    dialect: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  errorMessage: PropTypes.string,
  isFetchingBlock: PropTypes.bool,
  classes: PropTypes.object.isRequired,

  addBlock: PropTypes.func.isRequired,
  updatePostTitle: PropTypes.func.isRequired,
};

EditPost.defaultProps = {
  errorMessage: '',
  blocks: [],
  isFetchingBlock: false,
};

export default withStyles(styles)(EditPost);
