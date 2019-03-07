import React from "react";
import _ from "lodash";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import "highlight.js/styles/github.css";
import "highlight.js/lib/languages/scala";
import "highlight.js/lib/languages/java";
import "highlight.js/lib/languages/javascript";
import penImage from "./editor/fountain_pen.svg";
const hljs = require("highlight.js");

const md = require("markdown-it")({
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
});
const mk = require("markdown-it-katex");

md.use(mk);

const styles = () => ({
  view: {
    top: "57px",
    lineHeight: '1.5em',
    fontSize: '1.15em',
    right: 0,
    left: "50%",
    bottom: 0,
    overflow: "auto",
    paddingLeft: "30px",
    paddingBottom: "30px",
    paddingTop: "10px",
    paddingRight: "30px",
    color: '#444',
    backgroundColor: 'white',
  },
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%"
  },
  icon: {
    fontSize: "2em",
    flexGrow: 0.5,
    paddingTop: "1em"
  }
});

class RenderedView extends React.Component {

  componentDidMount() {
    if (this.ref) {
      this.ref.focus()
    }
  }

  render() {
    const {classes, text} = this.props;
    if (_.isEmpty(text)) {
      return (
        <div className={classes.center}>
          <img src={penImage} alt="logo" height="100"/>
          <p className={classes.icon}>Empty post. Start working on it now :)</p>
        </div>
      );
    }

    return (
      <div className={classes.view} id='test' ref={el => this.ref = el} tabIndex="-1">
        <ReactMarkdown
          source={md.render(text)} escapeHtml={false}
        />
      </div>
    );
  }
}

RenderedView.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  text: PropTypes.string
};

RenderedView.defaultProps = {
  text: ""
};

export default withStyles(styles)(RenderedView);
