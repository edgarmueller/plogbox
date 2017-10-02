import React from 'react';
import ReactDOM from 'react-dom';
import * as _ from 'lodash';
import {
  Card,
  CardText,
  CardTitle,
  FlatButton,
  FloatingActionButton,
  MenuItem,
  SelectField,
  TextField,
} from 'material-ui';
import ContentSave from 'material-ui/svg-icons/content/save';
import ContentArchive from 'material-ui/svg-icons/content/archive';
import ContentUnarchive from 'material-ui/svg-icons/content/unarchive';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import DownArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import UpArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import Dialog from 'material-ui/Dialog';
import Latex from 'react-latex';
import ReactMarkdown from 'react-markdown';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import fileDownload from 'react-file-download';
import Dropzone from 'react-dropzone';

import { getBlocks, getIsFetchingBlock, getSelectedPost } from '../reducers/index';
import * as action from '../actions/index';
import { RESET_ERROR_MESSAGE, UPDATE_BLOCK_FAILURE } from '../constants/index';

const Editor = (props) => {
  if (typeof window !== 'undefined') {
    /* eslint-disable */
    const AceEditor = require('react-ace').default;
    require('brace');
    require('brace/mode/markdown');
    require('brace/theme/github');
    require('brace/keybinding/emacs');
    /* eslint-enable */

    return <AceEditor {...props} />;
  }

  return null;
};

const renderUploadControl = (postId, block, onDrop, onChange) => {
  if (block.dialect === 'image') {
    return (
      <Dropzone onDrop={onDrop(postId)(block)}>
        {block.text}
      </Dropzone>
    );
  }

  return (
    <Editor
      mode="markdown"
      theme="github"
      onChange={text => onChange(block, text)}
      name={`${block.id}_editor`}
      editorProps={{ $blockScrolling: true }}
      width={'100%'}
      value={block.text}
      minLines={1}
      maxLines={Infinity}
      keyboardHandler={'emacs'}
    />
  );
};

class Block extends React.Component {

  componentDidMount() {
    const { postId, block, downloadFile } = this.props;
    downloadFile(postId, block);
  }

  render() {
    const { block } = this.props;
    if (block.dialect === 'latex') {
      return (<div id={block.text}>
        <Latex>{block.text}</Latex>
      </div>);
    } else if (block.dialect === 'image') {
      if (block.text) {
        if (block.imagePath) {
          return (<img src={block.imagePath} />);
        }

        return (<div id={block.text}>Loading...</div>);
      }

      return (<div>No image selected yet</div>);
    }

    return <ReactMarkdown id={block.id} source={block.text} />;
  }
}

Block.propTypes = {
  postId: PropTypes.number.isRequired,
  block: PropTypes.shape({
    dialect: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    imagePath: PropTypes.string,
  }).isRequired,
  downloadFile: PropTypes.func.isRequired,
};

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
      savePost,
      exportPost,
      importPost,
      addBlock,
      removeBlock,
      moveBlockUp,
      moveBlockDown,
      selectedPost,
      updatePostTitle,
      updateBlockDialect,
      updateBlockText,
      errorMessage,
      resetErrorMessage,
      onDrop,
      downloadFile,
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

            <FloatingActionButton
              onClick={() => savePost(selectedPost, blocks)}
              backgroundColor="#913d88"
              mini
            >
              <ContentSave />
            </FloatingActionButton>

            <FloatingActionButton
              onClick={() => exportPost(blocks)}
              backgroundColor="#913d88"
              mini
            >
              <ContentArchive />
            </FloatingActionButton>

            <FloatingActionButton
              onClick={() => importPost()}
              backgroundColor="#913d88"
              mini
            >
              <ContentUnarchive />
            </FloatingActionButton>

            <input
              id={'upload'}
              type="file"
              style={{ display: 'none' }}
              onChange={(event) => {
                // TODO: pull out
                const reader = new FileReader();
                reader.onload = (ev) => {
                  const readBlocks = JSON.parse(ev.target.result);
                  _.each(readBlocks, block => addBlock(
                    selectedPost.id,
                    block.dialect,
                    block.text,
                  ));
                };
                reader.readAsText(event.target.files[0]);
              }}
            />

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
                            (<div
                              key={block.id}
                            >
                              <div
                                style={{
                                  paddingBottom: '0.5em',
                                }}
                              >
                                <SelectField
                                  floatingLabelText="Block Dialect"
                                  value={block.dialect}
                                  onChange={(ev, newValue, dialect) => {
                                    updateBlockDialect(block, dialect);
                                  }}
                                >
                                  <MenuItem value={'markdown'} primaryText="Markdown" />
                                  <MenuItem
                                    value={'latex'}
                                    primaryText="Latex"
                                  />
                                  <MenuItem
                                    value={'image'}
                                    primaryText="Image"
                                    onClick={() => updateBlockText(block, '')}
                                  />
                                </SelectField>

                                <span
                                  style={{
                                    marginLeft: '1em',
                                  }}
                                >
                                  <FloatingActionButton
                                    onClick={() => removeBlock(selectedPost.id, block)}
                                    backgroundColor="#2c3e50"
                                    mini
                                  >
                                    <ContentRemove />
                                  </FloatingActionButton>
                                  {
                                    index > 0 ?
                                      <FloatingActionButton
                                        onClick={() => moveBlockUp(block)}
                                        backgroundColor="#2c3e50"
                                        mini
                                      >
                                        <UpArrow />
                                      </FloatingActionButton> :
                                      <span>&nbsp;</span>
                                  }
                                  {
                                    index < blocks.length - 1 ?
                                      <FloatingActionButton
                                        onClick={() => moveBlockDown(block)}
                                        backgroundColor="#2c3e50"
                                        mini
                                      >
                                        <DownArrow />
                                      </FloatingActionButton> :
                                      <span>&nbsp;</span>
                                  }
                                </span>
                              </div>
                              {
                                renderUploadControl(selectedPost.id, block, onDrop, updateBlockText)
                              }
                            </div>),
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
                    (<Block
                      key={block.id}
                      postId={selectedPost.id}
                      isFetchingBlock={isFetchingBlock}
                      downloadFile={downloadFile}
                      block={block}
                    />),
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
  savePost: PropTypes.func.isRequired,
  exportPost: PropTypes.func.isRequired,
  importPost: PropTypes.func.isRequired,
  addBlock: PropTypes.func.isRequired,
  removeBlock: PropTypes.func.isRequired,
  moveBlockUp: PropTypes.func.isRequired,
  moveBlockDown: PropTypes.func.isRequired,
  selectedPost: PropTypes.shape({
    dialect: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  updatePostTitle: PropTypes.func.isRequired,
  updateBlockDialect: PropTypes.func.isRequired,
  updateBlockText: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  downloadFile: PropTypes.func.isRequired,
  isFetchingBlock: PropTypes.bool,
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
  moveBlockDown(block) {
    dispatch(action.moveBlockDown(block));
  },
  moveBlockUp(block) {
    dispatch(action.moveBlockUp(block));
  },
  removeBlock(postId, block) {
    dispatch(action.removeBlock(postId, block));
  },
  updateBlockText(block, text) {
    dispatch(action.updateBlockText(block, text));
  },
  updateBlockDialect(block, dialect) {
    dispatch(action.updateBlockDialect(block, dialect));
  },
  updatePostTitle(title) {
    dispatch(action.updatePostTitle(title));
  },
  savePost(selectedPost, blocks) {
    dispatch(action.updatePost(selectedPost, blocks));
  },
  downloadFile(postId, block) {
    const file = block.text;
    dispatch(
      action.downloadFile(postId, file)(
        (downloadedFile) => {
          // TODO: rather use local storage with ID?
          block.imagePath = downloadedFile;
          ReactDOM.render(
            <img src={downloadedFile} alt={`file.name: ${file}`} />,
            document.getElementById(file),
          );
        },
        error => action.errorHandler(dispatch, error, UPDATE_BLOCK_FAILURE),
      ));
  },
  onDrop: postId => block => (acceptedFiles) => {
    // TODO: show loading indicator
    action.uploadFile(postId, _.head(acceptedFiles))
      .then(
        resp => dispatch(action.updateBlockText(block, resp.data.data.fileId)),
        error => action.errorHandler(dispatch, error, UPDATE_BLOCK_FAILURE),
      );
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
