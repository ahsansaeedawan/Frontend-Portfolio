import React from "react";
import RadioInput from "../customInputs/radio";

function FormikRadio({
  label,
  touched,
  errors,
  name,
  readOnly = false,
  fieldStyle,
  value,
  onValueChange,
  onTouch,
  disabled,
  checked
}) {
  function handleRadioChange() {
    onValueChange(name, value);
    onTouch(name, true, false);
  }
  return (
    <RadioInput
      label={label}
      name={name}
      value={value}
      disabled={disabled}
      onChange={handleRadioChange}
      checked={checked}
    />
  );
}

export default FormikRadio;
