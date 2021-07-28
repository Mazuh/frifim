import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { MonthContext } from '../../app/contexts';
import useProjectPeriods, { periodToString } from './useProjectPeriods';

export default function PeriodSelector({ className }) {
  const periods = useProjectPeriods().reverse();

  const { month, setMonth } = React.useContext(MonthContext);

  const handleMonthsDropdownSelect = (monthKey) => {
    const selectedMonthIndex = parseInt(monthKey, 10) - 1;
    if (Number.isNaN(selectedMonthIndex)) {
      return;
    }

    setMonth(selectedMonthIndex);
  };

  return (
    <DropdownButton
      id="main-month-dropdown"
      variant="secondary"
      className={className}
      title={periodToString({ month, year: 2021 })}
      onSelect={handleMonthsDropdownSelect}
    >
      {periods.map((period, index) => (
        <Dropdown.Item key={index + '/' + period.month + period.year} eventKey={period.month + 1}>
          {periodToString(period)}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}
