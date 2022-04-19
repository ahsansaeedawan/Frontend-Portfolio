import React from "react";
import { Field } from "formik";
import classNames from "classnames";

function FormikInput({
  touched,
  errors,
  name,
  placeholder,
  type = "text",
  readOnly = false,
  fieldStyle,
  autoComplete,
  disabled,
  ...rest
}) {
  return (
    <div
      className={classNames("form-group", {
        "has-errors": errors && touched,
        valid: !errors && touched,
      })}
    >
      
      <Field
        className="form-input"
        type={type}
        name={name}
        placeholder={placeholder}
        readOnly={readOnly}
        style={fieldStyle}
        disabled={disabled}
        autoComplete={autoComplete}
        required
        {...rest}
      />
      {errors && touched && <span className="form-field-error">{errors}</span>}
    </div>
  );
}

export default FormikInput;
