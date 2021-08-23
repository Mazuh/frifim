import React from 'react';
import Decimal from 'decimal.js';
import { LastUpdateContext } from '../../app/contexts';

export default function LastUpdateFlag({ className }) {
  const { lastUpdate } = React.useContext(LastUpdateContext);
  const [timeElapsed, setTimeElapsed] = React.useState(0);

  React.useEffect(() => {
    const lastUpdateTimeout = setTimeout(() => {
      const lastUpdateTimeStamp = lastUpdate.getTime();
      const now = new Decimal(Date.now());
      setTimeElapsed(now.minus(lastUpdateTimeStamp).dividedBy(1000).valueOf());
    }, 500);

    return () => clearTimeout(lastUpdateTimeout);
  }, [lastUpdate, timeElapsed]);

  if (!lastUpdate) {
    return null;
  }

  const elapsedMinutes = new Decimal(timeElapsed).dividedBy(60);

  return (
    <small className={`text-muted ${className}`}>
      {elapsedMinutes.lessThan(1)
        ? 'Atualizado há segundos.'
        : `Atualizado há ${elapsedMinutes.toFixed(0)}min.`}
    </small>
  );
}
