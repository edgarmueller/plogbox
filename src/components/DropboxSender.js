import React from 'react';
import { OauthSender } from 'react-oauth-flow';

const DropboxSender = () => (
  <OauthSender
    authorizeUrl="https://www.dropbox.com/oauth2/authorize"
    clientId={process.env.REACT_APP_CLIENT_ID}
    redirectUri={process.env.REACT_APP_REDIRECT_URI}
    render={({ url }) => <a href={url}>Connect to Dropbox</a>}
  />
);

export default DropboxSender;
