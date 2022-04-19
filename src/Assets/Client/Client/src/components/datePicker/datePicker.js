import React from "react";
import ReactDatePicker from "react-date-picker";
import "./datePicker.css";

const DatePicker = ({ value, onChange, children, ...rest }, ref) => {
  return (
    <div className="datepicker">
      {children}
      <ReactDatePicker ref={ref} onChange={onChange} value={value} {...rest} />
    </div>
  );
};

export default React.forwardRef(DatePicker);
