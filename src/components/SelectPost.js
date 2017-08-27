import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as _ from 'lodash';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ContentRemove from 'material-ui/svg-icons/content/remove';
import ContentCreate from 'material-ui/svg-icons/content/create';
import ContentArchive from 'material-ui/svg-icons/content/archive';
import ContentUnarchive from 'material-ui/svg-icons/content/unarchive';
import { blue300 } from 'material-ui/styles/colors';
import { AutoComplete, Card, CardTitle, CardText, Dialog, FlatButton, MenuItem, Chip } from 'material-ui';
import fileDownload from 'react-file-download';
import * as actions from '../actions';
import * as api from '../api';
import { getAllPosts, getPostErrorMessage, getIsFetchingPosts } from '../reducers/index';
import '../common/tap';
import { CREATE_POST_SUCCESS, RESET_ERROR_MESSAGE } from '../constants';

const floatingButtonStyle = {
  float: 'right',
  marginTop: '2.5em',
};

const miniFloatingButtonStyle = {
  margin: '0.75em',
};

const formatDate = (timestap) => {
  const t = new Date(timestap);
  return t.toDateString();
};


export class SelectPost extends React.Component {

  constructor() {
    super();
    this.state = {
      selectedRow: -1,
    };
  }

  componentWillMount() {
    this.fetchSuggestedTags();
  }

  componentDidUpdate() {
    // update suggested tags
    this.fetchSuggestedTags();
  }

  fetchSuggestedTags() {
    api.fetchTags()
      .then(
        (resp) => {
          this.suggestedTags = resp.data.data.map(tag =>
            ({
              text: tag.name,
              value: (
                <MenuItem
                  primaryText={tag.name}
                  secondaryText="&#9786;"
                />
              ),
            }),
          );
        },
        () => {
          // ignore error
        },
      );
  }

  render() {
    const {
      posts,
      addPost,
      selectedPost,
      deletePost,
      isFetchingPosts,
      errorMessage,
      resetErrorMessage,
      addTag,
      removeTag,
      exportPosts,
      importPosts,
      importPostsFromFile,
    } = this.props;

    if (isFetchingPosts) {
      return (<p>Loading...</p>);
    }

    return (
      <div>
        <Card>
          <CardTitle>
            <span><strong>SELECT A POST &nbsp;</strong></span>

            <FloatingActionButton
              onClick={() => exportPosts(posts)}
              backgroundColor="#913d88"
              mini
            >
              <ContentArchive />
            </FloatingActionButton>

            <FloatingActionButton
              onClick={importPosts}
              backgroundColor="#913d88"
              mini
            >
              <ContentUnarchive />
            </FloatingActionButton>

            <input
              id={'upload'}
              type="file"
              style={{ display: 'none' }}
              onChange={
                ev => importPostsFromFile(_.head(ev.target.files))
              }
            />
          </CardTitle>

          <CardText>
            <div>
              <Table
                selectable={false}
                onCellClick={(row, col) => {
                  if (this.state.didDelete) {
                    // ignore
                    this.setState({
                      didDelete: false,
                    });
                  } else {
                    this.setState({
                      selectedRow: row,
                      selectedCol: col,
                    });
                  }
                }}
              >
                <TableHeader displaySelectAll={false}>
                  <TableRow>
                    <TableHeaderColumn>Title</TableHeaderColumn>
                    <TableHeaderColumn>Date</TableHeaderColumn>
                    <TableHeaderColumn>Edit or Delete</TableHeaderColumn>
                    <TableHeaderColumn>Tags</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false} >
                  {
                    posts.map((post, rowIndex) =>
                      (<TableRow key={post.id}>
                        <TableRowColumn>{post.title}</TableRowColumn>
                        <TableRowColumn>{formatDate(post.date)}</TableRowColumn>
                        <TableRowColumn>
                          <FloatingActionButton
                            onClick={() => selectedPost(post)}
                            backgroundColor="#2c3e50"
                            mini
                            style={miniFloatingButtonStyle}
                          >
                            <ContentCreate />
                          </FloatingActionButton>
                          <FloatingActionButton
                            onClick={() => deletePost(post)}
                            backgroundColor="#2c3e50"
                            mini
                            style={miniFloatingButtonStyle}
                          >
                            <ContentRemove />
                          </FloatingActionButton>
                        </TableRowColumn>
                        <TableRowColumn>
                          {
                            this.state.selectedRow === rowIndex && this.state.selectedCol === 3 ?
                              <AutoComplete
                                hintText="Add tags..."
                                dataSource={this.suggestedTags}
                                autoFocus
                                onNewRequest={(tag) => {
                                  if (typeof tag === 'string') {
                                    addTag(post, tag);
                                  } else {
                                    addTag(post, tag.text);
                                  }
                                  this.setState({
                                    selectedRow: -1,
                                    selectedCol: -1,
                                  });
                                }}
                              /> :
                              <span>
                                {
                                  (post.tags || []).map(tag =>
                                    (
                                      <Chip
                                        key={tag.name}
                                        backgroundColor={tag.color ? `#${tag.color}` : blue300}
                                        onRequestDelete={() => {
                                          removeTag(post, tag);
                                          this.setState({
                                            didDelete: true,
                                            selectedRow: -1,
                                            selectedCol: -1,
                                          });
                                        }}
                                      >
                                        {tag.name}
                                      </Chip>
                                    ),
                                  )
                                }
                              </span>
                          }
                        </TableRowColumn>
                      </TableRow>),
                    )
                  }
                </TableBody>
              </Table>

              <FloatingActionButton
                style={floatingButtonStyle}
                onClick={addPost}
                backgroundColor="#2c3e50"
              >
                <ContentAdd />
              </FloatingActionButton>
            </div>
          </CardText>
        </Card>

        <Dialog
          title="An error occurred"
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

SelectPost.propTypes = {
  addPost: PropTypes.func.isRequired,
  exportPosts: PropTypes.func.isRequired,
  importPosts: PropTypes.func.isRequired,
  importPostsFromFile: PropTypes.func.isRequired,
  addTag: PropTypes.func.isRequired,
  removeTag: PropTypes.func.isRequired,
  selectedPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object),
  isFetchingPosts: PropTypes.bool,
  errorMessage: PropTypes.string,
  resetErrorMessage: PropTypes.func.isRequired,
};

SelectPost.defaultProps = {
  posts: [],
  isFetchingPosts: false,
  errorMessage: undefined,
};

export class SelectPostContainer extends React.Component {

  componentWillMount() {
    this.props.fetchPosts();
  }

  render() {
    return <SelectPost {...this.props} />;
  }

}

SelectPostContainer.propTypes = {
  fetchPosts: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  posts: getAllPosts(state),
  errorMessage: getPostErrorMessage(state),
  isFetchingPosts: getIsFetchingPosts(state),
});

export const mapDispatchToProps = dispatch => ({
  addPost() {
    dispatch(actions.createPost({
      title: 'New post',
      isDraft: true,
      date: new Date(),
    }));
  },
  selectedPost(post) {
    dispatch(actions.selectPost(post));
    dispatch(routerActions.push('posts/edit'));
  },
  deletePost(post) {
    dispatch(actions.deletePost(post));
  },
  fetchPosts() {
    dispatch(actions.fetchPosts());
  },
  resetErrorMessage() {
    dispatch({
      type: RESET_ERROR_MESSAGE,
    });
  },
  addTag(post, tag) {
    dispatch(actions.addTag(post.id, {
      name: tag,
    }));
  },
  removeTag(post, tag) {
    dispatch(actions.removeTag(post.id, tag.id));
  },
  exportPosts(posts) {
    const postsWithBlocks = _.map(posts, post =>
      api.fetchBlocks(post.id)
        .then(
          (resp) => {
            console.log('response for post is', resp);
            const clonedPost = _.clone(post);
            clonedPost.blocks = resp.data.data;
            return clonedPost;
          },
          () =>
            console.error('An error occurred during post export'),
        ),
    );
    Promise.all(postsWithBlocks)
      .then(
        (resolved) => {
          console.log(resolved);
          fileDownload(JSON.stringify(resolved), 'plog-posts-export.json');
        },
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
          () => console.log('error during post import'),
        );
      });
    };
    reader.readAsText(file);
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectPostContainer));

