import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { PeriodContext } from '../../app/contexts';
import { periodToString } from './period-lib';
import useProjectPeriods from './useProjectPeriods';

export default function PeriodSelector({ className }) {
  const periods = useProjectPeriods();

  const { period, setPeriod } = React.useContext(PeriodContext);

  const handleMonthsDropdownSelect = (eventKeyIndexStr) => {
    const eventKeyIndex = parseInt(eventKeyIndexStr, 10);
    if (Number.isNaN(eventKeyIndex)) {
      return;
    }

    const selectingPeriod = periods[eventKeyIndex];
    if (!selectingPeriod) {
      return;
    }

    setPeriod(selectingPeriod);
  };

  return (
    <DropdownButton
      id="main-month-dropdown"
      variant="secondary"
      className={className}
      title={periodToString(period)}
      onSelect={handleMonthsDropdownSelect}
    >
      {periods.map((period, index) => (
        <Dropdown.Item key={index + '/' + period.month + period.year} eventKey={index}>
          {periodToString(period)}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
