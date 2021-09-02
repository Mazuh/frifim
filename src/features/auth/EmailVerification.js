import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { sendVerificationLink } from './authDuck';

export default function EmailVerification() {
  const dispatch = useDispatch();
  const handleSendClick = () => dispatch(sendVerificationLink());
  const isVerificationLinkSent = useSelector((state) => state.auth.isVerificationLinkSent);

  const isAccountVerified = useIsAccountVerified();
  if (isAccountVerified || isVerificationLinkSent) {
    return null;
  }

  return (
    <Alert variant="warning">
      <strong>Opa!</strong> Parece que você ainda não verificou seu e-mail. Para receber um novo
      link de verificação,{' '}
      <Link to="#" role="button" onClick={handleSendClick}>
        clique aqui
      </Link>
      .
    </Alert>
  );
}

export const useIsAccountVerified = () => {
  const user = useSelector((state) => state.auth.user);
  const { emailVerified = false, providerData = [] } = user;
  const hasSocialMediaAuthType = providerData.some(({ providerId }) => providerId !== 'password');
  const isAccountVerified = emailVerified || hasSocialMediaAuthType;
  return isAccountVerified;
};
