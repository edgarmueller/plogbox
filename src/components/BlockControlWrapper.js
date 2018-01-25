import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';

const styles = () => ({
  highlighted: {
    border: 'solid 1px #ff4081',
    padding: '0.5em',
  },
  notHighlighted: {
    border: 'solid 1px #fff',
    padding: '0.5em',
  },
});

const BlockControlWrapper = ({ connectDropTarget, isFocused, onFocus, children, classes }) =>
  connectDropTarget(
    <div
      onFocus={onFocus}
      className={isFocused ? classes.highlighted : classes.notHighlighted}
    >
      {children}
    </div>,
  );

BlockControlWrapper.propTypes = {
  onFocus: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

export default withStyles(styles)(BlockControlWrapper);
