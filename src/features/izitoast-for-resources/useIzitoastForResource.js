import React from "react";
import { useSelector, useDispatch } from "react-redux";
import iziToast from "izitoast";

export default function useIzitoastForResource(resource) {
  const dispatch = useDispatch();
  const message = useSelector(state => state[resource].currentMessage);

  React.useEffect(() => {
    if (!message) {
      return;
    }

    const clearMessage = () => dispatch(makeClearMessageAction(resource));

    iziToast.show({
      title: message.isError ? 'Erro' : 'Notificação',
      message: message.text,
      onClosing: clearMessage,
      color: message.isError ? 'red' : 'green',
      position: 'topRight',
    });
  }, [dispatch, message, resource]);
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
