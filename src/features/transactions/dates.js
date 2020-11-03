/** transforms iso datetime string into a better human readable string  */
export function humanizeDatetime(isoDatetimeString, options = {}) {
  const dateEntity = new Date(isoDatetimeString);
  return dateEntity.toLocaleString(navigator.language, {
    day: 'numeric',
    month: 'short',
    ...options,
  });
}

/** returns current datetime-local input */
export function currentDatetimeValue() {
  const currentTimestamp = Date.now();
  const currentDateEntity = new Date(currentTimestamp);
  const offsetTimestamp = currentTimestamp - currentDateEntity.getTimezoneOffset() * 60000;
  const offsetCurrentDateEntity = new Date(offsetTimestamp);
  return offsetCurrentDateEntity.toISOString().substring(0, 16);
}
