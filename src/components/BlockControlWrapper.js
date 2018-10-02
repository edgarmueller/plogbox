import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';

const styles = () => ({
  highlighted: {
    color: '#333435',
    backgroundColor: '#fff',
    borderRadius: '0.25em',
  },
  notHighlighted: {
    color: '#333435',
  },
  block: {
    paddingBottom: '8px',
    paddingLeft: '4px',
    paddingRight: '8px',
    marginBottom: '0.35em',
    width: '100%',
  },
});

const BlockControlWrapper = (
  {
    connectDropTarget, isFocused, onFocus, onBlur, children, classes,
  }) => connectDropTarget(
  <div
    onFocus={onFocus}
    onBlur={onBlur}
    className={[isFocused ? classes.highlighted : classes.notHighlighted, classes.block].join(' ')}
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
