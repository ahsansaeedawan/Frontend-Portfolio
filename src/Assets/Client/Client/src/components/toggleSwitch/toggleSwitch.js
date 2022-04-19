import React from "react";
import cn from "classnames";
import "./toggleSwitch.css";

const ToggleSwitch = ({
  checked = false,
  className,
  onChange,
  label,
  name,
  disabled,
  ...rest
}) => {
  return (
    <div className={cn("toggle-switch", { disabled })}>
      {label && <h3 className="label">{label}</h3>}
      <label className={cn("switch", className)}>
        <input
          type="checkbox"
          onChange={onChange}
          name={name}
          checked={checked}
          disabled={disabled}
          {...rest}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default ToggleSwitch;
