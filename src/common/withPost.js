import React from 'react';
import PropTypes from 'prop-types'

export const withPost = (Component) => {
  const Wrapper = (props, context) => {
    const postContext = context.__editPost__;
    const { post } = postContext;

    if (post === undefined) {
      return null;
    }

    return (
      <Component {...postContext} {...props} />
    );
  };
  Wrapper.contextTypes = {
    __editPost__: PropTypes.object.isRequired,
  };
  return Wrapper;
};
