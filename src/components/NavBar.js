import React from 'react';
import { Link } from 'react-router-dom';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { AppBar, Button, Toolbar } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import SvgIconFace from 'material-ui-icons/Face';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import Radium from 'radium';

import { logoutUser } from '../actions';
import { getIsAuthenticated } from '../reducers';

const styles = () => ({
  link: {
    textDecoration: 'none',
  },
});

const RadiumLink = Radium(Link);

export const NavBar = (
  {
    isAuthenticated,
    user,
    navigateTo,
    logout,
    classes,
  }) => {
  if (isAuthenticated) {
    return (
      <nav>
        <AppBar color={'primary'} position={'static'}>
          <Toolbar>
            <RadiumLink
              className={classes.link}
              to="/"
            >
              <Button>
                Logbook
              </Button>
            </RadiumLink>
            <RadiumLink
              className={classes.link}
              to="/posts"
            >
              <Button>
                Posts
              </Button>
            </RadiumLink>
            <div>
              <Chip
                onTouchTap={() => navigateTo('/profile')}
                label={`Logged in with ${user}`}
              >
                <Avatar color="#444" icon={<SvgIconFace />}/>
              </Chip>
            </div>
            <Button onClick={logout}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
      </nav>
    );
  }

  return (
    <nav>
      <AppBar position="static" color={'primary'}>
        <Toolbar >
          <RadiumLink
            to="/"
            className={classes.link}
          >
            <Button>plog</Button>
          </RadiumLink>
          <RadiumLink
            to="/sign-up"
            className={classes.link}
          >
            <Button>Sign up</Button>
          </RadiumLink>
          <RadiumLink
            to="/login"
            className={classes.link}
          >
            <Button>Login</Button>
          </RadiumLink>
        </Toolbar>
      </AppBar>
    </nav>
  );
};

NavBar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.string,
  navigateTo: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
  classes: PropTypes.shape({
    link: PropTypes.string.isRequired,
  }).isRequired,
};

NavBar.defaultProps = {
  user: undefined,
};

// These props come from the application's
// state when it is started
const mapStateToProps = state => ({
  isAuthenticated: getIsAuthenticated(state),
  user: state.auth.user,
});

const mapDispatchToProps = dispatch => ({
  logout() {
    dispatch(logoutUser());
  },
  navigateTo(destination) {
    dispatch(routerActions.push(destination));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(NavBar));
