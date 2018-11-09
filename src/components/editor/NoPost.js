import React from 'react';
import { withStyles } from 'material-ui/styles';
import { center } from '../../common/styles';

const styles = {
  center
};

export default withStyles(styles)(({ classes }) => (
  <div className={classes.center}>
    No post available
  </div>
));
