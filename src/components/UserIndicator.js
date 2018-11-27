import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';
import { Link } from 'react-router-dom';
import withStyles from '@material-ui/core/styles/withStyles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import SvgIconFace from '@material-ui/icons/Face';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import { link } from '../common/styles';
import { logout } from '../api/dropbox';
import { AUTH_LOGOUT } from '../constants';

const RadiumLink = Radium(Link);
const styles = {
  link,
  center: {
    display: 'flex',
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
};

const UserIndicator = ({ classes, user, logoutUser }) => (
  <div className={classes.center}>
    <div>
      <Chip
        label={`${user}`}
      >
        <Avatar color="#444" icon={<SvgIconFace />} />
      </Chip>
    </div>

    <div>
      <RadiumLink
        onClick={() => {
            logoutUser();
          }}
        to="/"
      >
        <Avatar>
          <LogoutIcon />
        </Avatar>
      </RadiumLink>
    </div>
  </div>
);

UserIndicator.propTypes = {
  user: PropTypes.string.isRequired,
  logoutUser: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = state => ({
  user: _.get(state, 'auth.user.name.display_name'),
});

const mapDispatchToProps = dispatch => ({
  logoutUser() {
    logout();
    dispatch({
      type: AUTH_LOGOUT
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(UserIndicator));
