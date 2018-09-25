import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import * as actions from '../actions/index';
import '../common/tap';
import { getStatusText } from '../reducers/auth';
import LoginForm from '../components/LoginForm';
import CenteredWhiteDiv from '../components/CenteredWhiteDiv';

class LoginPage extends React.Component {

  render() {
    const { isAuthenticated, isAuthenticating, location } = this.props;
    let redirectUrl;
    if (location) {
      const search = location.search;
      const params = new URLSearchParams(search);
      redirectUrl = params.get('redirect');
    }

    if (isAuthenticated) {
      return (<Redirect to={`${_.isEmpty(redirectUrl) ? '/posts' : redirectUrl}`} />);
    }

    return (
      <CenteredWhiteDiv>
        <h2 style={{ paddingTop: '1em' }}>Welcome to _plog</h2>
        <LoginForm
          loginUser={this.props.loginUser}
        />
        {
          isAuthenticating &&
          (<p style={{ paddingTop: '1em' }}>Logging you in...</p>)
        }
      </CenteredWhiteDiv>
    );
  }
}

LoginPage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  loginUser: PropTypes.func.isRequired,
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
)(LoginPage);
