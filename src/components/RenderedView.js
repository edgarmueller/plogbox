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
    padding: '10px 10px 10px 10px',
    fontFamily: "'Eczar', serif",
    fontSize: '1.25em',
    lineHeight: '1.5em',
    backgroundColor: '#FEFAD7',
    color: '#4c4a37',
    border: '1px solid rgba(0, 0, 0, 0.12)'
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
