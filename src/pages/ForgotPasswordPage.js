import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import * as routerActions from 'react-router-redux';
import { red } from 'material-ui/colors';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import * as actions from '../actions';
import CenteredWhiteDiv from '../components/CenteredWhiteDiv';

export class ForgotPasswordPage extends React.Component {

  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
  }

  handleFormSubmit(mail) {
    this.props.forgotPassword(mail);
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div style={{ marginTop: '1em' }}>
          <span style={{ color: red }}>
            {this.props.errorMessage}
          </span>
        </div>
      );
    }

    return undefined;
  }

  render() {
    return (
      <CenteredWhiteDiv>
        <h2 style={{ paddingTop: '1em', paddingBottom: '1em' }}>Reset your password</h2>
        <p style={{ fontSize: '0.85em' }}>
          Please enter your mail address, so we can you send a link to reset your password.
        </p>
        <ForgotPasswordForm
          handleFormSubmit={this.handleFormSubmit}
          renderAlert={this.renderAlert}
        />
      </CenteredWhiteDiv>
    );
  }
}

ForgotPasswordPage.propTypes = {
  forgotPassword: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

ForgotPasswordPage.defaultProps = {
  errorMessage: undefined,
};

export const mapDispatchToProps = dispatch => ({
  forgotPassword(formProps) {
    dispatch(actions.forgotPassword(formProps.email));
    dispatch(routerActions.push('/'));
  },
  replace: routerActions.replace,
});


export default connect(
  null,
  mapDispatchToProps,
)(ForgotPasswordPage);
