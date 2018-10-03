import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';
import { routerActions } from 'react-router-redux';
import * as actions from '../actions/index';
import '../common/tap';
import { getStatusText } from '../reducers/auth';
import LoginForm from '../components/LoginForm';
import CenteredWhiteDiv from '../components/CenteredWhiteDiv';

const styles = {
  heading: {
    paddingTop: '1em',
    paddingBottom: '1em',
  },
};

const LoginPage = ({
  classes, isAuthenticated, isAuthenticating, location
}) => {
  let redirectUrl;
  if (location) {
    const { search } = location;
    const params = new URLSearchParams(search);
    redirectUrl = params.get('redirect');
  }

  if (isAuthenticated) {
    return (<Redirect to={`${_.isEmpty(redirectUrl) ? '/posts' : redirectUrl}`} />);
  }

  return (
    <CenteredWhiteDiv>
      <div>
        <h2 className={classes.heading}>Welcome to _plog</h2>
      </div>
      <LoginForm
        loginUser={this.props.loginUser}
      />
      {
        isAuthenticating &&
        (<p style={{ paddingTop: '1em' }}>Logging you in...</p>)
      }
    </CenteredWhiteDiv>
  );
};

LoginPage.propTypes = {
  classes: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
};

const mapStateToProps = (state) => {
  const isAuthenticated = state.auth.isAuthenticated || false;
  const isAuthenticating = state.auth.isAuthenticating || false;
  return {
    isAuthenticated,
    isAuthenticating,
    errorMessage: getStatusText(state.auth),
  };
};

const mapDispatchToProps = dispatch => ({
  loginUser(email, password) {
    return dispatch(actions.loginUser(email, password));
  },
  replace: routerActions.replace,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles)(LoginPage));

