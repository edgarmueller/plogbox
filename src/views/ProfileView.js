import React from 'react';
import { Button } from 'material-ui';
import { connect } from 'react-redux';
import { routerActions } from 'react-router-redux';
import PropTypes from 'prop-types';

export const ProfileView = ({ navigateTo }) => (
  <div>
    <p>
      You can change your password anytime. To do so, click the button below
    </p>
    <Button
      onClick={() => navigateTo('/password/change')}
      label="Change password"
    />
  </div>
  );

ProfileView.propTypes = {
  navigateTo: PropTypes.func.isRequired,
};

const ProfileViewContainer = ({navigateTo}) =>
  (
    <ProfileView
      navigateTo={navigateTo}
    />
  );

ProfileViewContainer.propTypes = {
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
)(ProfileViewContainer);
