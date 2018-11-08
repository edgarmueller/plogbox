import React from 'react';
import PropTypes from 'prop-types';
import ContentAdd from 'material-ui-icons/Add';
import { Button, List, ListItem, withStyles } from 'material-ui';
import * as _ from 'lodash';
import { appBar, card, cardContent, header } from '../common/styles';
import InputDialog from './InputDialog';

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
    float: 'right',
    margin: 10
  },
  flex: {
    flex: 1,
  },
  root: {
    backgroundColor: '#002B36',
  },
});

// const formatDate = (timestap) => {
//   const t = new Date(timestap);
//   const dateSegments = t.toDateString().split(' ');
//   return {
//     weekDay: dateSegments[0],
//     month: dateSegments[1],
//     day: dateSegments[2],
//     year: dateSegments[3],
//   };
// };

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

    if (_.isEmpty(posts)) {
      return (
        <NoPosts />
      );
    }

    return (
      <div className={classes.root}>
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
                {/* <ListItemIcon> */}
                {/* <IconButton */}
                {/* onClick={() => deletePost(post)} */}
                {/* color="default" */}
                {/* > */}
                {/* <ContentDelete /> */}
                {/* </IconButton> */}
                {/* </ListItemIcon> */}
              </ListItem>
            ))
          }
        </List>
        <Button
          variant="fab"
          className={classes.floatingButtonStyle}
          onClick={() => this.setState({ open: true })}
          color="secondary"
        >
          <ContentAdd />
        </Button>
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
  tag: PropTypes.string.isRequired,
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
