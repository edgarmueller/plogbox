import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import SvgIconFace from 'material-ui/svg-icons/action/face';
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
        <Toolbar style={{ backgroundColor: '#913D88' }}>
          <ToolbarGroup>
            <FlatButton
              labelStyle={{
                color: '#fff',
                fontWeight: 'bold',
                fontFamily: 'monospace',
                fontSize: '1.25em',
              }}
              onClick={() => navigateTo('/')}
              label="plog_"
            />
            <FlatButton labelStyle={{ color: 'white' }} onClick={() => navigateTo('/')} label="HOME" />
            <FlatButton labelStyle={{ color: 'white' }} onClick={() => navigateTo('/posts')} label="POSTS" />
          </ToolbarGroup>
          <ToolbarGroup lastChild>
            <div style={styles}>
              <Chip
                onTouchTap={() => navigateTo('/profile')}
              >
                <Avatar color="#444" icon={<SvgIconFace />} />
                Logged in with {user}
              </Chip>
            </div>
            <FlatButton labelStyle={{ color: 'white' }} onClick={() => logout()} label="LOGOUT" />
          </ToolbarGroup>
        </Toolbar>
      </nav>
    );
  }

  return (
    <nav>
      <Toolbar style={{ backgroundColor: '#913D88' }}>
        <ToolbarGroup>
          <FlatButton
            labelStyle={{
              color: '#fff',
              fontWeight: 'bold',
              fontFamily: 'monospace',
              fontSize: '1.25em',
            }}
            onClick={() => navigateTo('/')}
            label="plog_"
          />
        </ToolbarGroup>
        <ToolbarGroup>
          <FlatButton labelStyle={{ color: 'white' }} onClick={() => navigateTo('/sign-up')} label="SIGN-UP" />
          <FlatButton labelStyle={{ color: 'white' }} onClick={() => navigateTo('/login')} label="LOGIN" />
        </ToolbarGroup>
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
