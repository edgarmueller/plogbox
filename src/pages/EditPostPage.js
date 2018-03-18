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
  withStyles,
} from 'material-ui';
import EditPost from '../containers/EditPostContainer';
import EditPostAppBar from '../containers/EditPostButtonBarContainer';
import Editor from '../components/Editor';
import withDragDropContext from '../common/withDragDropContext';
import { fetchPostById } from '../api';
import { sortBlocks } from '../utils/blocks';

const styles = {
  appBar: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #ebebeb',
    width: '100%',
    borderBottomLeftRadius: '0.5em',
    borderBottomRightRadius: '0.5em',
  },
  card: {
    background: 'none',
    boxShadow: 'none',
  },
  cardContent: {
    // use theme's spacing?
    padding: '8px 0 0 0',
    borderBottomLeftRadius: '1em',
    borderBottomRightRadius: '1em',
  },
};

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
              const fetchedPost = resp.data.data;
              fetchedPost.blocks = sortBlocks(fetchedPost.blocks);
              this.setState({ post: fetchedPost });
            } else {
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
    const { classes } = this.props;

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
              <AppBar position="sticky" className={classes.appBar}>
                <Toolbar>
                  <EditPostAppBar showTitle />
                </Toolbar>
              </AppBar>
              <Card className={classes.card}>
                <CardContent className={classes.cardContent}>
                  <Editor />
                </CardContent>
              </Card>
            </EditPost> :
            <p style={{ paddingTop: '1em' }}>Loading post...</p>
        }
      </div>
    );
  }
}

EditPostPage.propTypes = {
  postId: PropTypes.number,
  classes: PropTypes.shape({}).isRequired,
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
  )(withDragDropContext(withStyles(styles)(EditPostPage))),
);
