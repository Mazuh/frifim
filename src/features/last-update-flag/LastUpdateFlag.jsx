import React from 'react';
import { LastUpdateContext } from '../../app/contexts';

export default function LastUpdateFlag({ className }) {
  const { lastUpdate } = React.useContext(LastUpdateContext);

  if (!lastUpdate) return <></>;

  return <small className={`text-muted ${className}`}>Última atualização: {lastUpdate}</small>;
}
