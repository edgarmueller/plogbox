import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';
import * as Props from '../common/CommonPropTypes';

const styles = {
  whiteCard: {
    paddingBottom: '1.5em',
    paddingLeft: '1em',
    backgroundColor: '#fff',
    borderBottomLeftRadius: '0.25em',
    borderBottomRightRadius: '0.25em',
    boxShadow: '0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    width: '40%',
    margin: 'auto',
  },
};

const CenteredWhiteDiv = ({ children, classes }) => (
  <div className={classes.whiteCard}>
    {children}
  </div>
);

CenteredWhiteDiv.propTypes = {
  children: Props.children,
  classes: PropTypes.shape({}).isRequired,
};

CenteredWhiteDiv.defaultProps = {
  children: Props.childrenDefault,
}

export default withStyles(styles)(CenteredWhiteDiv);
