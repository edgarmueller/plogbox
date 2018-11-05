import React from 'react';
import ReactMarkdown from 'react-markdown';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';

const md = require('markdown-it')();
const mk = require('markdown-it-katex');

md.use(mk);

const styles = () => ({
  view: {
    top: '57px',
    right: 0,
    left: '50%',
    bottom: 0,
    overflow: 'auto',
    padding: '10px 10px 10px 30px',
    color: '#444',
    fontFamily: "'Eczar', serif",
    fontSize: '16px',
    lineHeight: '1.5em'
  }
});

const RenderedView = ({ classes, text }) => (
  <div className={classes.view}>
    <ReactMarkdown source={md.render(text)} escapeHtml={false} />
  </div>
);

RenderedView.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  text: PropTypes.string
};

RenderedView.defaultProps = {
  text: ''
};

export default withStyles(styles)(RenderedView);
