import React from 'react';
import Alert from 'react-bootstrap/Alert';
import { useDispatch, useSelector } from 'react-redux';
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
      Hey, parece que você ainda não verificou seu e-mail: para receber um novo link de verificação.{' '}
      <Alert.Link href="#" role="button" onClick={handleSendClick}>
        clique aqui
      </Alert.Link>
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
