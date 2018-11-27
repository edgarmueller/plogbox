import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { center } from '../../common/styles';

const styles = {
  center
};

export default withStyles(styles)(({ classes }) => (
  <div className={classes.center}>
    No post available
  </div>
));
