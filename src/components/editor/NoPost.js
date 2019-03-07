import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import penImage from './fountain_pen.svg';

const styles = {
  flex: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
};

export default withStyles(styles)(({ classes }) => (
  <div className={classes.flex}>
    <img src={penImage} alt="logo" height="100"/>
    No post available
  </div>
));
