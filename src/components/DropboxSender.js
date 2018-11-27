import React from 'react';
import { OauthSender } from 'react-oauth-flow';

const DropboxSender = () => {
  console.log('>>', process.env.REACT_APP_CLIENT_ID)
  return (
    <OauthSender
      authorizeUrl="https://www.dropbox.com/oauth2/authorize"
      clientId={process.env.REACT_APP_CLIENT_ID}
      redirectUri="http://localhost:3000/auth"
      render={({ url }) => <a href={url}>Connect to Dropbox</a>}
    />
  );
}

export default DropboxSender;
