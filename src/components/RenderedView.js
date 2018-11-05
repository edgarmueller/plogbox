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
  },
  notHighlighted: {
    color: '#333435',

  },
  renderedBlock: {
    paddingTop: '8px',
    paddingLeft: '1.5em',
    paddingRight: '1.5em',
    paddingBottom: '8px',
    marginBottom: '0.35em',
    lineHeight: '1.35',
  },
  img: {
    display: 'block',
    margin: '0 auto',
    paddingLeft: 0,
    paddingRight: 0,
    width: '95%',
  },
});

const RenderedView = ({
   text, isDownloading, imagePath, isFocused, classes,
}) => {
  // switch (block.dialect) {
    // case 'image':
    //   if (block.text) {
    //     if (isDownloading) {
    //       return (<div id={block.text} style={{ paddingTop: '1em' }}>Loading post...</div>);
    //     }
    //
    //     return (
    //       <img
    //         className={[isFocused ? classes.highlighted : classes.notHighlighted, classes.block, classes.img].join(' ')}
    //         src={imagePath}
    //       />
    //     );
    //   }
    //
    //   return (<div>No image selected yet</div>);
    // default:
      return (
        <div className={[isFocused ? classes.highlighted : classes.notHighlighted, classes.block].join(' ')}>
          <ReactMarkdown idsource={md.render(text)} escapeHtml={false} />
        </div>
      );
  // }
};

RenderedView.propTypes = {
  // block: PropTypes.shape({
  //   id: PropTypes.number,
  //   dialect: PropTypes.string.isRequired,
  //   name: PropTypes.string,
  //   text: PropTypes.string.isRequired,
  // }).isRequired,
  text: PropTypes.string,
  isDownloading: PropTypes.bool,
  imagePath: PropTypes.string,
  isFocused: PropTypes.bool.isRequired,
};

RenderedView.defaultProps = {
  text: '',
  isDownloading: false,
  imagePath: undefined,
};

export default withStyles(styles)(RenderedView);
