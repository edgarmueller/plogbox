import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';

const styles = () => ({
  highlighted: {
    border: '1px solid #c2e9fb',
    color: '#333435',
    borderRadius: '0.5em',
    paddingBottom: '8px',
    paddingLeft: '4px',
    paddingRight: '8px',
    marginBottom: '0.25em',
  },
  notHighlighted: {
    marginBottom: '0.25em',
    color: '#333435',
    border: '1px solid #ABAFB2',
    borderRadius: '0.5em',
    paddingBottom: '8px',
    paddingLeft: '4px',
    paddingRight: '8px',
  },
});

const BlockControlWrapper = (
  { connectDropTarget, isFocused, onFocus, onBlur, children, classes },
) =>
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
