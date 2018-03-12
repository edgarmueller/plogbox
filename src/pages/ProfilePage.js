import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as routerActions from 'react-router-redux';
import Profile from '../components/Profile';

const ProfilePage = ({ navigateTo }) => (
  <Profile navigateTo={navigateTo} />
);

ProfilePage.propTypes = {
  navigateTo: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  navigateTo(destination) {
    dispatch(routerActions.push(destination));
  },
});

export default connect(
  null,
  mapDispatchToProps,
)(ProfilePage);
