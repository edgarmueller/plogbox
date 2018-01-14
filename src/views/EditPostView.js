import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withRouter } from 'react-router';
import { AppBar, Card, CardContent, Toolbar } from 'material-ui';
import EditPost from '../components/EditPostContainer';
import EditPostAppBar from '../components/EditPostButtonBarContainer';
import Editor from '../components/Editor';
import withDragDropContext from '../common/withDragDropContext';
import { fetchPostById } from '../api';

class EditPostView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post: undefined,
    };
    this.fetchPost = this.fetchPost.bind(this);
  }

  componentDidMount() {
    this.fetchPost();
  }

  fetchPost() {
    const { postId } = this.props;
    if (postId) {
      fetchPostById(postId)
        .then(
          resp => this.setState({ post: resp.data.data }),
          // TODO: error handling
          error => console.error(error),
        );
    }
  }

  render() {
    return (
      <div>
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
        </EditPost>
      </div>
    );
  }
}

EditPostView.propTypes = {
  postId: PropTypes.number,
};

EditPostView.defaultProps = {
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
  )(withDragDropContext(EditPostView)),
);
