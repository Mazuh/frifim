import React from 'react';
import firebase from 'firebase/app';

export default function useRecaptcha(widgetId) {
  const [isRecaptchaVerified, setRecaptchaVerified] = React.useState(false);
  const recaptchaVerifierRef = React.useRef();

  React.useEffect(() => {
    if (recaptchaVerifierRef.current) {
      console.warn('Already exists', recaptchaVerifierRef.current);
      return () => {};
    }

    const timer = setTimeout(() => {
      recaptchaVerifierRef.current = new firebase.auth.RecaptchaVerifier(widgetId, {
        'callback': () => setRecaptchaVerified(true),
        'expired-callback': () => setRecaptchaVerified(false),
      });
      recaptchaVerifierRef.current.render();
    }, 100);

    return () => {
      clearTimeout(timer);

      setRecaptchaVerified(false);

      if (recaptchaVerifierRef.current) {
        if (document.getElementById(widgetId)) {
          recaptchaVerifierRef.current.clear();
        } else {
          recaptchaVerifierRef.current = null;
        }
      }
    };
  }, [widgetId]);

  return { isRecaptchaVerified };
}
