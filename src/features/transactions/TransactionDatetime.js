import React from 'react';
import Datetime from 'react-datetime-picker';
import './datetime.styles.css';

const TransationDatetime = ({ value = new Date(), onChange = () => {}, ...rest }) => (
  <Datetime className="form-control" onChange={onChange} value={value} {...rest} />
);

export default TransationDatetime;
