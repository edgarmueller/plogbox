/* eslint-disable quotes,object-curly-spacing */
import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import { authSuccess } from "../actions";
import { saveToken } from "../api/dropbox";
import { parseQueryString } from "../utils";

function getAccessTokenFromUrl() {
  return parseQueryString(window.location.hash).access_token;
}

// If the user was just redirected from authenticating, the urls hash will
// contain the access token.
// function isAuthenticated() {
//   return !!getAccessTokenFromUrl();
// }

class DropboxReceiver extends React.Component {
  handleSuccess = async (accessToken) => {
    saveToken(accessToken);
  };

  constructor(props) {
    super(props);
    this.state = {
      success: false,
    };
  }

  handleError = (error) => {
    // eslint-disable-next-line no-console
    console.error(error.message);
  };

  componentDidMount() {
    const token = getAccessTokenFromUrl();
    if (token) {
      this.handleSuccess(token);
      this.setState({ success: true });
    }
  }

  render() {
    if (this.state.success) {
      return <Redirect to="/" />;
    }
    return null;
  }
}

DropboxReceiver.propTypes = {
  authSuccess: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  authSuccess(token, user) {
    dispatch(authSuccess(token, user));
  },
});

export default connect(
  null,
  mapDispatchToProps
)(DropboxReceiver);
