import React from "react";
import "./formikCheckbox.css";

export default function FormikCheckbox({ id, label, field, type, checked }) {
  return (
    <label htmlFor={id} className="formik-checkbox-container">
      <input id={id} {...field} type={type} checked={checked} />
      <span className="checkmark"></span>
      <p className="checkbox-label">{label}</p>
    </label>
  );
}
