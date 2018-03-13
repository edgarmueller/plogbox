import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';

const md = require('markdown-it')();
const mk = require('markdown-it-katex');

md.use(mk);

const styles = () => ({
  highlighted: {
    color: '#cf556c',
    paddingTop: '8px',
    paddingLeft: '1.5em',
    paddingBottom: '8px',
    marginBottom: '0.35em',
  },
  notHighlighted: {
    color: '#333435',
    paddingTop: '8px',
    paddingLeft: '1.5em',
    paddingBottom: '8px',
    marginBottom: '0.35em',
  },
});

const RenderedBlock = ({ block, isDownloading, imagePath, isFocused, classes }) => {
  switch (block.dialect) {
    case 'image':
      if (block.text) {
        if (isDownloading) {
          return (<div id={block.text}>Loading...</div>);
        }

        return (
          <img
            className={isFocused ? classes.highlighted : classes.notHighlighted}
            src={imagePath}
            alt={imagePath}
          />
        );
      }

      return (<div>No image selected yet</div>);
    default:
      return (
        <div className={isFocused ? classes.highlighted : classes.notHighlighted}>
          <ReactMarkdown id={block.id} source={md.render(block.text)} />
        </div>
      );
  }
};

RenderedBlock.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.number,
    dialect: PropTypes.string.isRequired,
    name: PropTypes.string,
    text: PropTypes.string.isRequired,
  }).isRequired,
  isDownloading: PropTypes.bool,
  imagePath: PropTypes.string,
  isFocused: PropTypes.bool.isRequired,
};

RenderedBlock.defaultProps = {
  isDownloading: false,
  imagePath: undefined,
};

export default withStyles(styles)(RenderedBlock);
