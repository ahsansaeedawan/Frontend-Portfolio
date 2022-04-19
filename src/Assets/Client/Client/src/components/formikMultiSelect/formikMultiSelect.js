import React, { useContext } from "react";
import Select from "react-select";
import classNames from "classnames";
import { error } from "../../components/toast";
import { validateRole } from "../../utils/userHelpers";
import { ROLE_NOT_ALLOWED } from "../../constants/messages";
import { UserContext } from "../../context";

function FormikMultiSelect({
  touched,
  errors,
  name,
  value,
  placeholder,
  onValueChange,
  onTouch,
  options,
  callApi,
  values,
  disabled
}) {
  const user = useContext(UserContext);
  return (
    <div
      className={classNames("form-group", {
        "has-errors": errors && touched,
        valid: !errors && touched
      })}
    >
      <Select
        className="react-multi-select"
        classNamePrefix="react-select"
        placeholder={placeholder}
        name={name}
        value={value}
        isMulti
        isSearchable={false}
        onChange={selectedOptions => {
          const role = selectedOptions ? selectedOptions : [];

          if (validateRole(user.role, role)) {
            callApi(values);
            onValueChange(name, role);
          } else {
            error(ROLE_NOT_ALLOWED);
          }
          onTouch("role", true, false);
        }}
        options={options}
        isDisabled={disabled}
      />
      {errors && touched && <span className="form-field-error">{errors}</span>}
    </div>
  );
}

export default FormikMultiSelect;
