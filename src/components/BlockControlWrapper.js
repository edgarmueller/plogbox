import React from 'react';
import PropTypes from 'prop-types';

const BlockControlWrapper = ({ connectDropTarget, isFocused, onFocus, children }) =>
  connectDropTarget(
    <div
      onFocus={onFocus}
      style={{
        border: isFocused ? 'solid 1px #00ff00' : 'solid 1px #ffffff',
        padding: '0.5em',
      }}
    >
      {children}
    </div>,
  );

BlockControlWrapper.propTypes = {
  onFocus: PropTypes.func.isRequired,
  isFocused: PropTypes.bool.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};

export default BlockControlWrapper;
