import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withRouter } from 'react-router';
import {
  AppBar,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Toolbar,
} from 'material-ui';
import EditPost from '../containers/EditPostContainer';
import EditPostAppBar from '../containers/EditPostButtonBarContainer';
import Editor from '../components/Editor';
import withDragDropContext from '../common/withDragDropContext';
import { fetchPostById } from '../api';

export class EditPostPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post: undefined,
      error: undefined,
    };
    this.fetchPost = this.fetchPost.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount() {
    this.fetchPost();
  }

  fetchPost() {
    const { postId } = this.props;
    if (postId) {
      fetchPostById(postId)
        .then(
          (resp) => {
            if (resp.data.status === 'success') {
              this.setState({ post: resp.data.data });
            } else {
              console.log('resp', resp.data.messages.join());
              this.setState({ error: resp.data.messages.join() });
            }
          },
          error => this.setState({ error: error.data.message }),
        );
    }
  }

  handleClose() {
    this.setState({
      error: undefined,
    });
  }

  render() {
    return (
      <div>
        <Dialog open={this.state.error !== undefined} onClose={this.handleClose}>
          <DialogTitle>An error occurred while fetching the post</DialogTitle>
          <DialogContent>
            {this.state.error}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        {
          this.state.post ?
            <EditPost post={this.state.post}>
              <AppBar position="static" color={'accent'}>
                <Toolbar>
                  <EditPostAppBar showTitle />
                </Toolbar>
              </AppBar>
              <Card>
                <CardContent>
                  <Editor />
                </CardContent>
              </Card>
            </EditPost> :
            <p>Loading post...</p>
        }
      </div>
    );
  }
}

EditPostPage.propTypes = {
  postId: PropTypes.number,
};

EditPostPage.defaultProps = {
  postId: undefined,
};

export const mapStateToProps = (state, ownProps) => {
  let postId;
  if (_.has(ownProps, 'match.params.postId')) {
    const { match: { params } } = ownProps;
    postId = Number(params.postId);
  } else {
    postId = ownProps.postId;
  }

  return {
    postId,
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    null,
  )(withDragDropContext(EditPostPage)),
);
