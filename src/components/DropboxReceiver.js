/* eslint-disable quotes,object-curly-spacing */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { OauthReceiver } from 'react-oauth-flow';
import { Redirect } from 'react-router';
import { authSuccess } from '../actions';
import { getUser, setAccessToken, saveToken } from '../api/dropbox';

class DropboxReceiver extends React.Component {
  handleSuccess = async (accessToken) => {
    setAccessToken(accessToken);
    saveToken(accessToken);
    getUser().then((user) => {
      this.props.authSuccess(accessToken, user);
    });
  };

  handleError = (error) => {
    // eslint-disable-next-line no-console
    console.error(error.message);
  };

  render() {
    return (
      <OauthReceiver
        tokenUrl="https://api.dropbox.com/oauth2/token"
        clientId={process.env.REACT_APP_CLIENT_ID}
        clientSecret={process.env.REACT_APP_CLIENT_SECRET}
        redirectUri="http://localhost:3000/auth"
        onAuthSuccess={this.handleSuccess}
        onAuthError={this.handleError}
        render={({ processing, error }) => (
          <div>
            {processing && <p>Authorizing now...</p>}
            {error && (
              <p className="error">An error occurred: {error.message}</p>
            )}
            {
              !processing && !error && (
                <Redirect to="/" />
              )
            }
          </div>
        )}
      />
    );
  }
}

DropboxReceiver.propTypes = {
  authSuccess: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  authSuccess(token, user) {
    dispatch(authSuccess(token, user));
  }
});

export default connect(
  null,
  mapDispatchToProps
)(DropboxReceiver);
