import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

const md = require('markdown-it')();
const mk = require('markdown-it-katex');

md.use(mk);

const RenderedBlock = ({ block, isDownloading, imagePath, isFocused }) => {
  switch (block.dialect) {
    case 'image':
      if (block.text) {
        if (isDownloading) {
          return (<div id={block.text}>Loading...</div>);
        }

        return (
          <img
            style={{ border: isFocused ? 'solid 1px #00ff00' : 'solid 1px #ffffff' }}
            src={imagePath}
            alt={imagePath}
          />
        );
      }

      return (<div>No image selected yet</div>);
    default:
      return (
        <div style={{ border: isFocused ? 'solid 1px #00ff00' : 'solid 1px #ffffff' }}>
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

export default RenderedBlock;
