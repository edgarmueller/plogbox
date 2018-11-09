import PropTypes from 'prop-types';

export const children = PropTypes.oneOfType([
  PropTypes.arrayOf(PropTypes.node),
  PropTypes.node,
]);

export const classes = PropTypes.object;

export const post = PropTypes.shape({
  '.tag': PropTypes.oneOf(['file']).isRequired,
  client_modified: PropTypes.string.isRequired,
  content_hash: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path_display: PropTypes.string.isRequired,
  path_lower: PropTypes.string.isRequired,
  rev: PropTypes.string.isRequired,
  server_modified: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired
});
