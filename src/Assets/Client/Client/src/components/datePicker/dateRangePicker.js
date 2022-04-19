import React from "react";
import RangePicker from "@wojtekmaj/react-daterange-picker";
import "./dateRangePicker.css";

const DateRangePicker = ({ value, onChange, children, ...rest }) => {
  return (
    <div className="date-range-picker">
      {children}
      <RangePicker onChange={onChange} value={value} {...rest} />
    </div>
  );
};

export default DateRangePicker;
