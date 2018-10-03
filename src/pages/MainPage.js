import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Grid, withStyles } from 'material-ui';
import EditPostContainer from '../containers/EditPostContainer';
import withDragDropContext from '../common/withDragDropContext';
import PostListContainer from '../containers/PostListContainer';
import Sidebar from '../components/Sidebar';

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

export const MainPage = ({ classes }) => (
  <div className={classes.root}>
    <Sidebar />
    <main className={classes.content}>
      <Grid container spacing={0} style={{ minHeight: '100%' }}>
        <Grid item xs={3}>
          <PostListContainer />
        </Grid>
        <Grid item xs={9}>
          <EditPostContainer />
        </Grid>
      </Grid>
    </main>
  </div>
);

MainPage.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};


export default withRouter((withDragDropContext(withStyles(styles)(MainPage))));
