import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Grid, withStyles } from 'material-ui';
import withDragDropContext from '../common/withDragDropContext';
import Sidebar from '../components/Sidebar';
import PostListContainer from '../containers/PostListContainer';
import EditorContainer from '../containers/EditorContainer';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
});

export const MainPage = ({ classes, isAuthenticating }) => {
  if (isAuthenticating) {
    return (
      <div className={classes.root}>
        Loading...
      </div>
    );
  }

  return (
    <div className={classes.root}>
      <Sidebar />
      <main className={classes.content}>
        <Grid container spacing={0} style={{ minHeight: '100%' }}>
          <Grid item xs={3}>
            <PostListContainer />
          </Grid>
          <Grid item xs={9}>
            <EditorContainer />
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

MainPage.propTypes = {
  isAuthenticating: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = state => ({
  isAuthenticating: state.auth.isAuthenticating,
});

export default withRouter(withDragDropContext(withStyles(styles)(connect(
  mapStateToProps,
  null
)(MainPage))));
