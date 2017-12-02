import React from 'react';
import Latex from 'react-latex';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';

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
    case 'latex':
      return (
        <div id={block.text}>
          <Latex>{block.text}</Latex>
        </div>
      );
    default:
      return <ReactMarkdown id={block.id} source={block.text} />;
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
