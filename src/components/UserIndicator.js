import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Radium from 'radium';
import { Link } from 'react-router-dom';
import { Avatar, Chip, withStyles } from 'material-ui';
import SvgIconFace from 'material-ui-icons/Face';
import LogoutIcon from 'material-ui-icons/ExitToApp';
import { link } from '../common/styles';

const RadiumLink = Radium(Link);
const styles = {
  link,
  center: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
};

const UserIndicator = ({ classes, user }) => (
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
        onClick={() => { console.log('TODO logout!'); }}
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
  classes: PropTypes.object.isRequired // eslint-disable-line react/forbid-prop-types
};

const mapStateToProps = state => ({
  user: state.auth.user,
});

export default connect(mapStateToProps, null)(withStyles(styles)(UserIndicator));
