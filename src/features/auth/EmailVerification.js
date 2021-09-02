import React, { useState } from 'react';
import iziToast from 'izitoast';
import Alert from 'react-bootstrap/Alert';
import { sendEmailVerification } from '../../app/firebase-configs';
import useBasicRequestData from '../../app/useBasicRequestData';
import { useSelector } from 'react-redux';

export default function EmailVerification() {
  const { hasSocialMediaAuthType, sendVerificationLink, linkSent, emailVerified, isAuthorized } =
    useEmailVerification();

  if (!isAuthorized || hasSocialMediaAuthType || emailVerified) {
    return null;
  }

  return linkSent ? (
    <Alert variant="info">
      Enviamos um link de verificação ao seu e-mail. (Cheque a caixa de spam também!)
    </Alert>
  ) : (
    <Alert variant="warning">
      Hey, parece que você ainda não verificou seu e-mail:{' '}
      <Alert.Link href="#" onClick={sendVerificationLink}>
        clique aqui
      </Alert.Link>{' '}
      para receber um novo link de verificação.
    </Alert>
  );
}

export const useEmailVerification = () => {
  const { user } = useBasicRequestData();
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);
  const [linkSent, setLinkSent] = useState(false);

  const hasSocialMediaAuthType =
    user &&
    user.providerData &&
    user.providerData.some(({ providerId }) => providerId !== 'password');

  const { emailVerified = false } = user || {};

  const sendVerificationLink = () => {
    sendEmailVerification()
      .then(() => setLinkSent(true))
      .catch((error) => {
        console.log('Error', error);
        iziToast.show({
          title: 'Erro desconhecido',
          message: 'Erro ao enviar link de verificação.',
          color: 'red',
          position: 'topCenter',
          timeout: 2000,
        });
      });
  };

  return {
    hasSocialMediaAuthType,
    sendVerificationLink,
    linkSent,
    emailVerified,
    isAuthorized,
  };
};
