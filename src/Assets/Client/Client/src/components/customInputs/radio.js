import React from "react";
import cn from "classnames";

import "./radio.css";

export default function Radio({
  id,
  name,
  label,
  onChange,
  checked,
  disabled
}) {
  return (
    <label
      htmlFor={id}
      className={cn("radio-container", { "radio-disabled": disabled })}
    >
      {label}
      <input
        disabled={disabled}
        type="radio"
        onChange={onChange}
        checked={checked}
        name={name}
      />
      <span className="radio-checkbox"></span>
    </label>
  );
}
