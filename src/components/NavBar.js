import React from 'react';
import { Link } from 'react-router-dom';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { Button, Toolbar } from 'material-ui';
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
        <Toolbar>
          <Button>
            <RadiumLink
              className={classes.link}
              to="/"
            >
              Home
            </RadiumLink>
          </Button>
          <Button>
            <Link to="/posts">Posts</Link>
          </Button>
          <div style={styles}>
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
      </nav>
    );
  }

  return (
    <nav>
      <Toolbar>
        <Button>
          <Link to="/">plog</Link>
        </Button>
        <Button>
          <Link to="/sign-up">Sign up</Link>
        </Button>
        <Button>
          <Link to="/login">Login</Link>
        </Button>
      </Toolbar>
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
