import React from 'react';
import { Link } from 'react-router-dom';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { Button, Toolbar } from 'material-ui';
import SvgIconFace from 'material-ui-icons/Face';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import { logoutUser } from '../actions';
import { getIsAuthenticated } from '../reducers';

const styles = {
  margin: '12px 24px',
};

export const NavBar = ({
  isAuthenticated,
  user,
  navigateTo,
  logout,
                       }) => {
  if (isAuthenticated) {
    return (
      <nav>
        <Toolbar>
          <Link to="/">Home</Link>
          <Link to="/posts">Posts</Link>
          <div style={styles}>
            <Chip
              onTouchTap={() => navigateTo('/profile')}
              label={`Logged in with ${user}`}
            >
              <Avatar color="#444" icon={<SvgIconFace />} />
            </Chip>
          </div>
          <Button className={{ color: 'white' }} onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </nav>
    );
  }

  return (
    <nav>
      <Toolbar>
        <Link to="/">plog</Link>
        <Link to="/sign-up">Sign up</Link>
        <Link to="/login">Login</Link>
      </Toolbar>
    </nav>
  );
};

NavBar.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  user: PropTypes.string,
  navigateTo: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
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
)(NavBar);
