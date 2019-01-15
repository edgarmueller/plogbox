import React from 'react';
import PropTypes from 'prop-types';
import ContentAdd from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import withStyles from '@material-ui/core/styles/withStyles';
import * as _ from 'lodash';
import { appBar, card, cardContent, header } from '../common/styles';
import InputDialog from './InputDialog';
import Fab from "@material-ui/core/Fab/Fab";

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

const EmptyList = ({ classes }) => (
  <div className={classes.emptyList}>
    No posts created yet!
  </div>
);

EmptyList.propTypes = {
  classes: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

const emptyListStyles = {
  emptyList: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    padding: '0.5em',
    flexGrow: 1
  },
};

const NoPosts = withStyles(emptyListStyles)(EmptyList);

export class PostList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    const {
      tag,
      posts,
      addPost,
      classes,
      selectPost
    } = this.props;

    return (
      <div className={classes.root}>
        {
          _.isEmpty(posts) ?
            <NoPosts/> :
            <List>
              {
                posts.map(post => (
                  <ListItem
                    button
                    key={`${post.id}-${new Date()}`}
                    onClick={() => selectPost(post)}
                    className={classes.listItem}
                  >
                    {post.name}
                  </ListItem>
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
      </div>
    );
  }
}

PostList.propTypes = {
  tag: PropTypes.string,
  posts: PropTypes.arrayOf(PropTypes.object),
  addPost: PropTypes.func.isRequired,
  // deletePost: PropTypes.func.isRequired,
  // handlePostSelected: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  selectPost: PropTypes.func.isRequired
};

PostList.defaultProps = {
  posts: [],
  errorMessage: undefined,
};

export default withStyles(styles)(PostList);
