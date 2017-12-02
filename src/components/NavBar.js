import React from 'react';
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
          <Button className={{ color: 'white' }} onClick={() => navigateTo('/')}>
            Home
          </Button>
          <Button className={{ color: 'white' }} onClick={() => navigateTo('/posts')}>
            Posts
          </Button>
          <div style={styles}>
            <Chip
              onTouchTap={() => navigateTo('/profile')}
              label={`Logged in with ${user}`}
            >
              <Avatar color="#444" icon={<SvgIconFace />} />
            </Chip>
          </div>
          <Button className={{ color: 'white' }} onClick={() => logout()}>
            Logout
          </Button>
        </Toolbar>
      </nav>
    );
  }

  return (
    <nav>
      <Toolbar>
        <Button
          className={{
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'monospace',
            fontSize: '1.25em',
          }}
          onClick={() => navigateTo('/')}
        >
          plog
        </Button>
        <Button className={{ color: 'white' }} onClick={() => navigateTo('/sign-up')}>
          Sign up
        </Button>
        <Button className={{ color: 'white' }} onClick={() => navigateTo('/login')}>
          Login
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
