import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

const md = require('markdown-it')();
const mk = require('markdown-it-katex');

md.use(mk);

const Block = ({ block, isDownloading, imagePath }) => {
  switch (block.dialect) {
    case 'image':
      if (block.text) {

        if (isDownloading) {
          return (<div id={block.text}>Loading...</div>);
        }

        return (
          <img
            src={imagePath}
            alt={imagePath}
          />
        );
      }

      return (<div>No image selected yet</div>);
    default:
      return <ReactMarkdown id={block.id} source={md.render(block.text)}/>;
  }
};

Block.propTypes = {
  block: PropTypes.shape({
    id: PropTypes.number.isRequired,
    dialect: PropTypes.string.isRequired,
    name: PropTypes.string,
    text: PropTypes.string.isRequired,
  }).isRequired,
  isDownloading: PropTypes.bool,
  imagePath: PropTypes.string,
};

Block.defaultProps = {
  isDownloading: false,
  imagePath: undefined,
};

export default Block;
