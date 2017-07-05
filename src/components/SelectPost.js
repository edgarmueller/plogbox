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
import { Card, CardTitle, CardText, Dialog, FlatButton } from 'material-ui';
import * as actions from '../actions/index';
import { getAllPosts, getPostErrorMessage, getIsFetchingPosts } from '../reducers/index';
import '../common/tap';
import { RESET_ERROR_MESSAGE } from '../constants';

const floatingButtonStyle = {
  float: 'right',
  marginTop: '2.5em',
};

const miniFloatingButtonStyle = {
  margin: '0.75em',
};

export const SelectPost = ({
                             posts,
                             addPost,
                             selectedPost,
                             deletePost,
                             isFetchingPosts,
                             errorMessage,
                             resetErrorMessage,
                           }) => {
  if (isFetchingPosts) {
    return (<p>Loading...</p>);
  }
  return (
    <div>
      <Card>
        <CardTitle>SELECT A POST</CardTitle>
        <CardText>
          {
            <div>
              <Table>
                <TableHeader displaySelectAll={false}>
                  <TableRow>
                    <TableHeaderColumn>Title</TableHeaderColumn>
                    <TableHeaderColumn>Date</TableHeaderColumn>
                    <TableHeaderColumn>Edit or Delete</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {
                    posts.map(post =>
                      (<TableRow key={post.id}>
                        <TableRowColumn>{post.title}</TableRowColumn>
                        <TableRowColumn>{post.date}</TableRowColumn>
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
          }
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
};

SelectPost.propTypes = {
  addPost: PropTypes.func.isRequired,
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
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(SelectPostContainer));

