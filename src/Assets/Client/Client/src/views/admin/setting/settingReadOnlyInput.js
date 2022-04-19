import React from "react";
import "./settingReadOnlyInput.css";

export const SettingReadOnlyInput = ({ name, value, label }) => {
  return (
    <div className="form-col-container">
      <div className="form-group">
        {/* <span className="label">{label}</span> */}
        <label className="top-label" htmlFor={name}>{label}</label>
        <input
          className="form-input"
          type="text"
          name={name}
          value={value}
          readOnly
        />
      </div>
    </div>
  );
};
