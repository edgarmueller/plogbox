import React from 'react';
import PropTypes from 'prop-types';
import ContentAdd from 'material-ui-icons/Add';
import ContentDelete from 'material-ui-icons/Delete';
import ContentCreate from 'material-ui-icons/Create';
import { AppBar, Button, Card, CardContent, IconButton, Toolbar, Typography, withStyles } from 'material-ui';
import Table, { TableBody, TableHead, TableRow, TableCell } from 'material-ui/Table';
import ButtonBar from '../containers/ButtonBarContainer';
import Tags from '../containers/TagsContainer';

const styles = () => ({
  // TODO duplicate styles appBar, card & cardContent, see EditPostPage
  appBar: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #ebebeb',
    width: '100%',
    borderBottomLeftRadius: '0.5em',
    borderBottomRightRadius: '0.5em',
  },
  card: {
    color: '#6a6969',
    background: 'none',
    boxShadow: 'none',
  },
  cardContent: {
    // use theme's spacing?
    color: '#6a6969',
    padding: '8px 0 0 0',
    borderBottomLeftRadius: '1em',
    borderBottomRightRadius: '1em',
  },
  floatingButtonStyle: {
    float: 'right',
    color: '#333435',
    backgroundColor: '#fff',
    marginBottom: '1em',
    marginTop: '1.5em',
  },
  flex: {
    flex: 1,
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
      handlePostSelected,
      deletePost,
      classes,
    } = this.props;

    // TODO: fix key
    return (
      <div>
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            <Typography type="headline">
              SELECT A POST
            </Typography>
            <ButtonBar />
          </Toolbar>
        </AppBar>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
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
                    <TableRow key={`${post.id}-${new Date()}`}>
                      <TableCell>{post.title}</TableCell>
                      <TableCell>{formatDate(post.date)}</TableCell>
                      <TableCell>
                        <IconButton
                          onClick={() => handlePostSelected(post)}
                          color="default"
                        >
                          <ContentCreate />
                        </IconButton>
                        <IconButton
                          onClick={() => deletePost(post)}
                          color="default"
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
              variant="fab"
              className={classes.floatingButtonStyle}
              onClick={addPost}
              color="primary"
            >
              <ContentAdd />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.object),
  addPost: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  handlePostSelected: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

PostList.defaultProps = {
  posts: [],
  errorMessage: undefined,
};

export default withStyles(styles)(PostList);
