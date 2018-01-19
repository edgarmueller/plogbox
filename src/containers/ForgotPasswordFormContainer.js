import React from 'react';
import PropTypes from 'prop-types';
import * as routerActions from 'react-router-redux';
import { red } from 'material-ui/colors';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import * as actions from '../actions';

export class ForgotPasswordFormContainer extends React.Component {

  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.renderAlert = this.renderAlert.bind(this);
  }

  handleFormSubmit(formProps) {
    this.props.loginUser(formProps);
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
    const { handleSubmit } = this.props;
    return (
      <ForgotPasswordForm
        handleSubmit={handleSubmit}
        handleFormSubmit={this.handleFormSubmit}
        renderAlert={this.renderAlert}
      />
    );
  }
}

ForgotPasswordFormContainer.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  loginUser: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

ForgotPasswordFormContainer.defaultProps = {
  errorMessage: undefined,
};


export const mapDispatchToProps = dispatch => ({
  forgotPassword(formProps) {
    dispatch(actions.forgotPassword(formProps.email));
    dispatch(routerActions.push('/'));
  },
  replace: routerActions.replace,
});
