import React from "react";
import { ToggleSwitch } from "../toggleSwitch";

function FormikToggle({
  label,
  touched,
  errors,
  name,
  readOnly = false,
  fieldStyle,
  onValueChange,
  onTouch,
  disabled,
  checked,
  className = "green"
}) {
  function handleOnChange() {
    onValueChange(name, !checked);
    onTouch(name, true, false);
  }
  return (
    <ToggleSwitch
      label={label}
      checked={checked}
      name={name}
      onChange={handleOnChange}
      className={className}
      disabled={disabled}
    />
  );
}

export default FormikToggle;
