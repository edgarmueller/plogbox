import React from 'react';
import { OauthSender } from 'react-oauth-flow';

const DropboxSender = () => (
  <OauthSender
    authorizeUrl="https://www.dropbox.com/oauth2/authorize"
    clientId={process.env.CLIENT_ID}
    redirectUri="http://localhost:3000/auth"
    render={({ url }) => <a href={url}>Connect to Dropbox</a>}
  />
);

export default DropboxSender;
