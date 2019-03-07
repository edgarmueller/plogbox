import React from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import withStyles from '@material-ui/core/styles/withStyles';
import * as _ from 'lodash';
import Fab from "@material-ui/core/Fab/Fab";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton/IconButton";
import ContentAdd from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateIcon from '@material-ui/icons/Create';
import { appBar, card, cardContent, header } from '../../common/styles';
import InputDialog from '../InputDialog';
import bookImage from './book.svg';
import DeletePostDialog from "./DeletePostDialog";
import Hovered from "../Hovered";
import RenamePostDialog from "./RenamePostDialog";

const styles = () => ({
  appBar,
  card,
  cardContent,
  header,
  listItem: {
    fontSize: '1.5em',
    color: '#fff',
    backgroundColor: '#002B36',
  },
  floatingButtonStyle: {
    margin: 10,
  },
  flex: {
    flex: 1,
  },
  root: {
    backgroundColor: '#002B36',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
});


const emptyListStyles = {
  emptyList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    padding: '0.5em',
    flexGrow: 1
  },
};
const EmptyList = ({ classes }) => (
  <div className={classes.emptyList}>
    <img src={bookImage} height="100" alt="No posts available" />
    No posts created yet!
  </div>
);

EmptyList.propTypes = {
  classes: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

const NoPosts = withStyles(emptyListStyles)(EmptyList);

export class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      openDeletePostDialog: false,
      openRenamePostDialog: false,
      postToDelete: undefined
    };
  }

  render() {
    const {
      tag,
      posts,
      addPost,
      classes,
      selectPost,
    } = this.props;

    return (
      <div className={classes.root}>
        {
          _.isEmpty(posts) ?
            <NoPosts/> :
            <List>
              {
                posts.map(post => (
                  <Hovered key={`${post.id}-${new Date()}`}>
                    {
                      isHovered => (
                        <ListItem
                          button
                          onClick={() => selectPost(post)}
                          className={classes.listItem}
                        >
                          {post.name}
                          <ListItemSecondaryAction style={{ visibility: isHovered ? 'inherit' : 'hidden' }}>
                            <IconButton aria-label="Rename" onClick={() => {
                              this.setState({
                                openRenamePostDialog: true,
                                postToRename: post
                              })
                            }}>
                              <CreateIcon style={{ color: 'white' }}/>
                            </IconButton>
                            <IconButton aria-label="Delete" onClick={() =>
                              this.setState({
                                openDeletePostDialog: true,
                                postToDelete: post
                              })
                            }>
                              <DeleteIcon style={{color: 'white'}}/>
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )
                    }
                  </Hovered>
                ))
              }
            </List>
        }
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <Fab
            className={classes.floatingButtonStyle}
            onClick={() => this.setState({ open: true })}
            color="secondary"
          >
            <ContentAdd />
          </Fab>
        </div>
        <InputDialog
          open={this.state.open}
          handleClose={() => this.setState({ open: false })}
          title="Create new post"
          contentText="Please enter a new for the new post"
          label="Post name"
          confirmButtonText="Create post"
          onConfirm={(postName) => {
            addPost(tag, postName);
          }}
        />
        {
          this.state.postToDelete &&
          <DeletePostDialog
            open={this.state.openDeletePostDialog}
            post={this.state.postToDelete}
            handleClose={() => this.setState({ openDeletePostDialog: false })}
          />
        }
        {
          this.state.postToRename &&
          <RenamePostDialog
            tag={tag}
            open={this.state.openRenamePostDialog}
            post={this.state.postToRename}
            handleClose={() => this.setState({openRenamePostDialog: false})}
          />
        }
      </div>
    );
  }
}

PostList.propTypes = {
  tag: PropTypes.string,
  posts: PropTypes.arrayOf(PropTypes.object),
  addPost: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  selectPost: PropTypes.func.isRequired
};

PostList.defaultProps = {
  posts: [],
  errorMessage: undefined,
};

export default withStyles(styles)(PostList);
