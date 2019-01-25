import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/core/styles/withStyles";
import Sidebar from "../components/Sidebar";
import PostListContainer from "../containers/PostListContainer";
import EditorContainer from "../containers/EditorContainer";

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
    position: "relative",
    display: "flex",
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up("md")]: {
      position: "relative"
    }
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default
  },
  white: {
    backgroundColor: 'white'
  }
});

export const MainPage = ({ classes, isAuthenticating }) => {
  if (isAuthenticating) {
    return <div className={classes.root}>Loading...</div>;
  }

  return (
    <div className={classes.root}>
      <main className={classes.content}>
        <Grid container spacing={0} style={{ minHeight: "100%" }}>
          <Grid item xs={2} className={classes.white}>
            <Sidebar />
          </Grid>
          <Grid item xs={3}>
            <PostListContainer />
          </Grid>
          <Grid item xs={7}>
            <EditorContainer />
          </Grid>
        </Grid>
      </main>
    </div>
  );
};

MainPage.propTypes = {
  isAuthenticating: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = state => ({
  isAuthenticating: state.auth.isAuthenticating
});

export default withRouter(
  withStyles(styles)(
    connect(
      mapStateToProps,
      null
    )(MainPage)
  )
);
