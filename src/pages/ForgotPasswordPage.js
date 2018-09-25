import React from 'react';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import CenteredWhiteDiv from '../components/CenteredWhiteDiv';

export const ForgotPasswordPage = () => (
  <CenteredWhiteDiv>
    <h2 style={{ paddingTop: '1em', paddingBottom: '1em' }}>Reset your password</h2>
    <p style={{ fontSize: '0.85em' }}>
      Please enter your mail address, so we can you send a link to reset your password.
    </p>
    <ForgotPasswordForm />
  </CenteredWhiteDiv>
);

export default ForgotPasswordPage;
