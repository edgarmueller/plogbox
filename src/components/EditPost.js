import React from 'react';
import * as _ from 'lodash';
import { Card, CardText, CardTitle, FlatButton, FloatingActionButton, TextField } from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

import Dialog from 'material-ui/Dialog';
import PropTypes from 'prop-types';
import BlockControl from './BlockControlContainer';
import EditPostButtonBar from './EditPostButtonBarContainer';
import Block from './Block';

export class EditPost extends React.Component {

  constructor() {
    super();
    this.state = {
      open: false,
      message: '',
      dialect: 'markdown',
      text: '',
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
    } = this.props;

    return (
      <div>
        <Card>
          <CardTitle>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span><strong>EDIT &nbsp;</strong></span>
              <TextField
                name="title"
                type="text"
                label="Title"
                value={selectedPost.title}
                onChange={(ev, newValue) => updatePostTitle(newValue)}
              />

              <EditPostButtonBar />
            </div>
          </CardTitle>
          <CardText>
            <div style={{
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
                        />
                      ),
                  )
                }
                <div style={{
                  marginTop: '1em',
                }}
                >
                  <FloatingActionButton
                    onClick={() => addBlock(selectedPost.id, this.state.dialect, '')}
                    backgroundColor="#2c3e50"
                  >
                    <ContentAdd />
                  </FloatingActionButton>
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
                      />
                    ),
                  )
                }
              </div>
            </div>
          </CardText>
        </Card>

        <Dialog
          title={'Error occurred'}
          actions={[
            <FlatButton
              label="OK"
              primary
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
};

EditPost.defaultProps = {
  blocks: [],
  errorMessage: undefined,
  isFetchingBlock: false,
};

export default EditPost;
