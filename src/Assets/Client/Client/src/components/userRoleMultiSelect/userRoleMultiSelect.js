import React from 'react';
import Select from "react-select";
import "./userRoleMultiSelect.css";




const UserRoleMultiSelect = ({



}) => {
    return(    

        <div className="form-col-container">
        <div
                   className={classNames("form-group", {
                    "has-errors": errors.role && touched.role,
                    valid: !errors.role && touched.role
                  })}
            >
          <Select
            className="react-multi-select"
            classNamePrefix="react-select"
         
            placeholder="Role"
            name="role"
            value={values.role}
            isMulti
            isSearchable={false}
            onChange={selectedOptions => {
              const role = selectedOptions ? selectedOptions : [];
              setFieldValue("role", role);
              setFieldTouched('role',true,false);
            }}
            options={[
              {
                value: "MONITORING_AGENT",
                label: "Monitoring Agent"
              },
              { value: "RESPONSE_AGENT",
               label: "Response Agent" }
            ]}
          
          />
           {errors.role && touched.role && (
                <span className="form-field-error">
                  {errors.role}
           </span>)}
          </div>                      
           </div>
    );

}

export default UserRoleMultiSelect;