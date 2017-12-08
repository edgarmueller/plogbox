import React from 'react';
import * as _ from 'lodash';
import { Card, CardContent, Button, TextField, Toolbar, AppBar, withStyles } from 'material-ui';
import ContentAdd from 'material-ui-icons/Add';

import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import BlockControl from './BlockControlContainer';
import EditPostButtonBar from './EditPostButtonBarContainer';
import Block from './BlockContainer';

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
      resetErrorMessage,
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
                marginRight: '1em',
              }}
              >
                {
                  blocks.map((block, index) =>
                      (
                        <BlockControl
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
                    onClick={() => addBlock(selectedPost.id, this.state.dialect, '')}
                    color="#2c3e50"
                  >
                    <ContentAdd />
                  </Button>
                </div>
              </div>
              <div style={{ width: '50%' }}>
                {
                  blocks.map(block =>
                    (
                      <Block
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
          title={'Error occurred'}
          actions={[
            <Button
              label="OK"
              color="primary"
              onTouchTap={resetErrorMessage}
            />,
          ]}
          modal
          open={!_.isEmpty(errorMessage)}
        >
          {errorMessage}
        </Dialog>
      </div>
    );
  }
}

EditPost.propTypes = {
  blocks: PropTypes.arrayOf(PropTypes.object),
  addBlock: PropTypes.func.isRequired,
  selectedPost: PropTypes.shape({
    dialect: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  isFetchingBlock: PropTypes.bool,
  updatePostTitle: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

EditPost.defaultProps = {
  blocks: [],
  errorMessage: undefined,
  isFetchingBlock: false,
};

export default withStyles(styles)(EditPost);
