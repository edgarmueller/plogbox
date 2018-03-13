import React from 'react';
import { Link } from 'react-router-dom';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { AppBar, Toolbar } from 'material-ui';
import { withStyles } from 'material-ui/styles';
import SvgIconFace from 'material-ui-icons/Face';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import Radium from 'radium';

import { logoutUser } from '../actions';
import { getIsAuthenticated } from '../reducers';

const styles = () => ({
  appBar: {
    backgroundColor: '#fff',
    boxShadow: 'none',
    borderBottom: '1px solid #ebebeb',
    display: 'flex',
  },
  link: {
    textDecoration: 'none',
    color: '#333435',
    paddingLeft: '2em',
    paddingRight: '2em',
    borderRadius: '28px',
    border: '2px solid #80CBC4',
    height: '28px',
    display: 'inline-flex',
    alignItems: 'center',
    marginLeft: '1em',
    marginRight: '1em',
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: '#80CBC4',
      color: '#fff',
    },
    textTransform: 'uppercase',
    fontSize: '10px',
    letterSpacing: '0.065em',
  },
  logo: {
    color: '#333435',
    borderRadius: '16px',
    paddingLeft: '2em',
    paddingRight: '2em',
    paddingTop: '1em',
    paddingBottom: '1em',
    marginRight: '1em',
    fontSize: '0.8125em',
    fontWeight: 'bold',
    marginLeft: 'auto',
    textDecoration: 'none',
    fontFamily: "'Montserrat', sans-serif",
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
        <AppBar className={classes.appBar} position={'static'}>
          <Toolbar>
            <RadiumLink
              className={classes.link}
              to="/posts"
            >
                Posts
            </RadiumLink>
            <div>
              <Chip
                onTouchTap={() => navigateTo('/profile')}
                label={`Logged in with ${user}`}
              >
                <Avatar color="#444" icon={<SvgIconFace />} />
              </Chip>
            </div>
            <RadiumLink className={classes.link} onClick={logout} to={'/'}>
              Logout
            </RadiumLink>

            <RadiumLink className={classes.logo} to="/" >
              _plog
            </RadiumLink>
          </Toolbar>
        </AppBar>
      </nav>
    );
  }

  return (
    <nav>
      <AppBar className={classes.appBar} position="static" >
        <Toolbar >
          <RadiumLink
            to="/sign-up"
            className={classes.link}
          >
            SIGN UP
          </RadiumLink>
          <RadiumLink
            to="/login"
            className={classes.link}
          >
            LOGIN
          </RadiumLink>

          <RadiumLink className={classes.logo} to="/">
            _plog
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
