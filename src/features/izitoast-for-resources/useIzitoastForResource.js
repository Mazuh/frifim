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

    iziToast.show({
      title: message.isError ? 'Erro' : 'Notificação',
      message: message.text,
      color: message.isError ? 'red' : 'green',
      position: 'topRight',
      timeout: 2500,
    });

    dispatch(makeClearMessageAction(resource));

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
