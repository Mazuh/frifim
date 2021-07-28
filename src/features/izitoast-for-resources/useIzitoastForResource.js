import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import iziToast from 'izitoast';
import { ViewportContext } from '../../app/contexts';

export default function useIzitoastForResource(resource) {
  const dispatch = useDispatch();
  const message = useSelector((state) => state[resource].currentMessage);
  const { isMobile } = React.useContext(ViewportContext);

  React.useEffect(() => {
    if (!message || !message.text) {
      return;
    }

    iziToast.show({
      title: message.isError ? 'Erro' : 'Notificação',
      message: message.text,
      color: message.isError ? 'red' : 'green',
      position: isMobile ? 'bottomCenter' : 'topRight',
      timeout: 2500,
    });

    dispatch(makeClearMessageAction(resource));
  }, [dispatch, message, resource, isMobile]);
}

function makeClearMessageAction(resource) {
  return {
    type: `RESOURCE_TOOLKIT__${resource}`,
    payload: {
      operation: 'CLEAR_CURRENT_MESSAGE',
      step: 'SUCCESS',
    },
  };
}
