import React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import PropTypes from 'prop-types';
import { routerActions } from 'react-router-redux';
import red from 'material-ui/colors/red';
import { loginUser } from '../actions/index';
import '../common/tap';
import { getStatusText } from '../reducers/auth';
import LoginForm from '../components/LoginForm';
import CenteredWhiteDiv from '../components/CenteredWhiteDiv';

class LoginPage extends React.Component {

  constructor() {
    super();
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
  }

  handleFormSubmit(mail, password) {
    this.props.loginUser(mail, password);
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div style={{ marginTop: '1em' }}>
          <span style={{ color: red[400] }}>
            {this.props.errorMessage}
          </span>
        </div>
      );
    }

    return undefined;
  }

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

    if (isAuthenticating) {
      return (<p style={{ paddingTop: '1em' }}>Logging in...</p>);
    }
    return (
      <CenteredWhiteDiv>
        <h2 style={{ paddingTop: '1em' }}>Welcome to _plog</h2>
        <LoginForm
          handleFormSubmit={this.handleFormSubmit}
          renderAlert={this.renderAlert}
        />
      </CenteredWhiteDiv>
    );
  }
}

LoginPage.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  loginUser: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  location: PropTypes.shape({}).isRequired,
};

LoginPage.defaultProps = {
  errorMessage: undefined,
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

const mapDispatchToProps = {
  loginUser,
  replace: routerActions.replace,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginPage);
