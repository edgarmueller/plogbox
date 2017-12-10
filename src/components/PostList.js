import React from 'react';
import PropTypes from 'prop-types';
import ContentAdd from 'material-ui-icons/Add';
import ContentDelete from 'material-ui-icons/Delete';
import ContentCreate from 'material-ui-icons/Create';
import { AppBar, Button, Card, CardContent, IconButton, Toolbar, Typography, withStyles } from 'material-ui';
import Table, { TableBody, TableHead, TableRow, TableCell } from 'material-ui/Table';
import ButtonBar from './ButtonBarContainer';
import Tags from './TagsContainer';

const floatingButtonStyle = {
  float: 'right',
  marginTop: '2.5em',
};

const styles = theme => ({
  // root: {
  //   marginTop: theme.spacing.unit * 3,
  //   width: '100%',
  // },
  flex: {
    flex: 1,
  },
  MuiCardContent: {
    padding: 0,
  },
});

const formatDate = (timestap) => {
  const t = new Date(timestap);
  return t.toDateString();
};

export class PostList extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      post: undefined,
    };
    this.setHighlightedPost = this.setHighlightedPost.bind(this);
  }

  setHighlightedPost(post) {
    this.setState(() => ({ post }));
  }

  render() {
    const {
      posts,
      addPost,
      selectPost,
      deletePost,
      classes,
    } = this.props;

    return (
      <Card >
        <CardContent className={classes.MuiCardContent}>
          <AppBar position="static" color={'default'}>
            <Toolbar>
              <Typography type="title" color="inherit">
                Select a post
              </Typography>
              <ButtonBar />
            </Toolbar>
          </AppBar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Edit or Delete</TableCell>
                <TableCell>Tags</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                posts.map(post => (
                  <TableRow key={post.id}>
                    <TableCell>{post.title}</TableCell>
                    <TableCell>{formatDate(post.date)}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => selectPost(post)}
                        color="#2c3e50"
                      >
                        <ContentCreate />
                      </IconButton>
                      <IconButton
                        onClick={() => deletePost(post)}
                        color="#2c3e50"
                      >
                        <ContentDelete />
                      </IconButton>
                    </TableCell>
                    <TableCell onClick={() => this.setHighlightedPost(post)}>
                      <Tags
                        post={post}
                        isEditing={
                          this.state.post !== undefined && this.state.post.id === post.id
                        }
                        done={() => this.setHighlightedPost(undefined)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>

          <Button
            fab
            style={floatingButtonStyle}
            onClick={addPost}
            color="#2c3e50"
          >
            <ContentAdd />
          </Button>
        </CardContent>
      </Card>
    );
  }
}

PostList.propTypes = {
  // classes: PropTypes.object.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object),
  addPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  selectPost: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

PostList.defaultProps = {
  posts: [],
  errorMessage: undefined,
};

export default withStyles(styles)(PostList);
// export default PostList;
