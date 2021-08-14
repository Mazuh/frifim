import React from 'react';
import { LastUpdateContext } from '../../app/contexts';

const LastUpdateFlag = ({ className }) => {
  const { lastUpdate } = React.useContext(LastUpdateContext);

  if (!lastUpdate) return <></>;

  return <span className={className}>Última atualização: {lastUpdate}</span>;
};

export default LastUpdateFlag;
