import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
  flex: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%'
  }
};

export default withStyles(styles)(({ classes }) => (
  <div className={classes.flex}>
    No post available
  </div>
));
