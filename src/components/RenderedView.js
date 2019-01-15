import React from "react";
import _ from "lodash";
import ReactMarkdown from "react-markdown";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import newFileIcon from "./newfile.svg";
import "highlight.js/styles/github.css";
import "highlight.js/lib/languages/scala";
import "highlight.js/lib/languages/java";
const hljs = require("highlight.js");

const md = require("markdown-it")({
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          "</code></pre>"
        );
      } catch (__) {}
    }

    return (
      '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + "</code></pre>"
    );
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
    color: '#444'
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: "100%"
  },
  icon: {
    fontSize: "2em",
    flexGrow: 0.5,
    paddingTop: "1em"
  }
});

const RenderedView = ({ classes, text }) => {
  if (_.isEmpty(text)) {
    return (
      <div className={classes.center}>
        <img src={newFileIcon} alt="logo" height="100" />
        <p className={classes.icon}>Empty post. Start working on it now :)</p>
      </div>
    );
  }

  console.log(md.render(text));

  return (
    <div className={classes.view}>
      <ReactMarkdown source={md.render(text)} escapeHtml={false} />
    </div>
  );
};

RenderedView.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  text: PropTypes.string
};

RenderedView.defaultProps = {
  text: ""
};

export default withStyles(styles)(RenderedView);
