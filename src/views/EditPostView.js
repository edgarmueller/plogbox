import React from 'react';
import * as _ from 'lodash';
import {
  Card,
  CardText,
  CardTitle,
  FlatButton,
  FloatingActionButton,
  TextField,
} from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

import Dialog from 'material-ui/Dialog';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import fileDownload from 'react-file-download';

import { getBlocks, getIsFetchingBlock, getSelectedPost } from '../reducers/index';
import * as action from '../actions/index';
import { RESET_ERROR_MESSAGE } from '../constants/index';
import BlockControl from '../components/BlockControlContainer';
import EditPostButtonBar from '../components/EditPostButtonBar';
import Block from '../components/Block';

export class EditPostView extends React.Component {

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
            <span><strong>EDIT &nbsp;</strong></span>
            <TextField
              name="title"
              type="text"
              label="Title"
              value={selectedPost.title}
              onChange={(ev, newValue) => updatePostTitle(newValue)}
            />

            <EditPostButtonBar />

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

EditPostView.propTypes = {
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

EditPostView.defaultProps = {
  blocks: [],
  errorMessage: undefined,
  isFetchingBlock: false,
};

export class EditPostPageContainer extends React.Component {

  componentWillMount() {
    const { fetchBlocks, selectedPost } = this.props;
    fetchBlocks(selectedPost);
  }

  render() {
    return <EditPostView {...this.props} />;
  }
}

EditPostPageContainer.propTypes = {
  fetchBlocks: PropTypes.func.isRequired,
  selectedPost: PropTypes.shape({
    title: PropTypes.string,
    blocks: PropTypes.arrayOf(
      PropTypes.shape({
        dialect: PropTypes.string.isRequired,
        text: PropTypes.string,
      }),
    ),
  }).isRequired,
};

const mapStateToProps = state => ({
  selectedPost: getSelectedPost(state),
  userId: state.auth.userId,
  blocks: getBlocks(state),
  isFetchingBlock: getIsFetchingBlock(state),
});

export const mapDispatchToProps = dispatch => ({
  fetchBlocks(post) {
    return dispatch(action.fetchBlocks(post));
  },
  addBlock(postId, dialect, text) {
    const block = {
      dialect,
      text,
    };
    return dispatch(action.addBlock(postId, block));
  },
  updatePostTitle(title) {
    dispatch(action.updatePostTitle(title));
  },
  savePost(selectedPost, blocks) {
    dispatch(action.updatePost(selectedPost, blocks));
  },
  exportPost(blocks) {
    fileDownload(JSON.stringify(blocks), 'export.json');
  },
  importPost() {
    document.getElementById('upload').click();
  },
  resetErrorMessage() {
    dispatch({
      type: RESET_ERROR_MESSAGE,
    });
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPostPageContainer));
