import capitalize from 'lodash.capitalize';
import { monthToString } from '../transactions/dates';

export const makePeriod = (date = new Date()) => ({
  month: date.getMonth(),
  year: date.getFullYear(),
});

export const periodToString = (period) =>
  [capitalize(monthToString(period.month)), period.year].join('/');
