import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';

const styles = () => ({
  highlighted: {
    backgroundColor: 'rgba(158, 158, 158, 0.14)',
    paddingBottom: '15px',
    paddingLeft: '15px',
    paddingRight: '15px',
  },
  notHighlighted: {
    paddingBottom: '15px',
    paddingLeft: '15px',
    paddingRight: '15px',
  },
});

const BlockControlWrapper = ({ connectDropTarget, isFocused, onFocus, onBlur, children, classes }) =>
  connectDropTarget(
    <div
      onFocus={onFocus}
      onBlur={onBlur}
      className={isFocused ? classes.highlighted : classes.notHighlighted}
    >
      {children}
    </div>,
  );

BlockControlWrapper.propTypes = {
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

export default withStyles(styles)(BlockControlWrapper);
