import React from 'react';
import { MdOutlineSavings, MdNotificationImportant } from 'react-icons/md';
import useEmergencySaving from './useEmergencySaving';

const EmergencySavingIcon = () => {
  const shouldEmergencySaving = useEmergencySaving();

  return shouldEmergencySaving ? <MdNotificationImportant color="orange" /> : <MdOutlineSavings />;
};

export default EmergencySavingIcon;
