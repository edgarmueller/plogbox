import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import Radium from "radium";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import TagList from "../containers/TagListContainer";
import UserIndicator from "./UserIndicator";
import DropboxSender from "./DropboxSender";

const RadiumLink = Radium(Link);
const drawerWidth = 240;
const styles = theme => ({
  logo: {
    color: "#333435",
    borderRadius: "16px",
    paddingLeft: "2em",
    paddingRight: "2em",
    paddingTop: "1em",
    paddingBottom: "1em",
    fontSize: "1.8125em",
    fontWeight: "bold",
    textDecoration: "none",
    fontFamily: "'Montserrat', sans-serif"
  },
  drawerPaper: {
    border: "none",
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  }
});

const Sidebar = ({ classes, user }) => (
  <Drawer
    variant="permanent"
    open
    classes={{
      paper: classes.drawerPaper
    }}
  >
    <RadiumLink className={classes.logo} to="/">
      plog_
    </RadiumLink>
    {user ? (
      <React.Fragment>
        <UserIndicator />
        <TagList />
      </React.Fragment>
    ) : (
      <DropboxSender
        render={({ url }) => <a href={url}>Connect to Dropbox</a>}
      />
    )}
  </Drawer>
);

Sidebar.propTypes = {
  user: PropTypes.string,
  classes: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

Sidebar.defaultProps = {
  user: undefined
};

const mapStateToProps = state => ({
  user: _.get(state, "auth.user.name.display_name")
});

export default withStyles(styles)(connect(mapStateToProps)(Sidebar));
