import React from "react";
import range from "lodash.range";
import capitalize from "lodash.capitalize";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { monthToString } from '../transactions/dates';
import { MonthContext, ProjectContext } from '../../app/contexts';

export default function PeriodSelector({ className }) {
  const { project } = React.useContext(ProjectContext);
  const projectCreation = new Date(project.createdAt);
  const projectCreationMonth = projectCreation.getMonth();

  const { month, setMonth } = React.useContext(MonthContext);

  const currentMonth = (new Date()).getMonth();
  const periods = range(projectCreationMonth, currentMonth + 1)
    .reverse()
    .map(it => ({ month: it, year: 2021 }));

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
        <Dropdown.Item
          key={index + '/' + period.month + period.year}
          eventKey={period.month + 1}
        >
          {periodToString(period)}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
}

const periodToString = (period) => capitalize(monthToString(period.month));
