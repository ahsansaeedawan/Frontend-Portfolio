import React, { useContext, useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { FormikInput } from "../formikInput";
import { FormikImageUpload } from "../formikImageUpload";
import {
  addUserValidationSchema,
  editUserValidationSchema
} from "../../constants/formValidations";
import { PrimaryButton } from "../button";
import FormikCheckbox from "../formikCheckbox/formikCheckbox";
import { FormikMultiSelect } from "../formikMultiSelect";
import { UserContext } from "../../context";
import Select from 'react-select';
import classNames from "classnames";
import { getOrganization, getIntelliconUsers } from "../../api";
import { LoadingMask } from "../loadingMask";
import { orgMultiSelectOptions } from "../../utils/userHelpers";

const validationSchema = {
  add: addUserValidationSchema,
  edit: editUserValidationSchema
};

function OrganizationUserForm({
  type = "add",
  onSubmit,
  submitBtnText,
  onCancel,
  initialValues,


}) {
  const [isRole, setRole] = useState();
  const [isIntelliconUsersAvailable, setIsIntelliconUsersAvailable] = useState();
  const user = useContext(UserContext);
  const [parentOrgs, setParentOrgs] = useState(null);
  const [intelliconUser, setIntelliconUser] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [roleOptions, setRoleOptions] = useState([])
  const [selectedIntellicon, setSelectedIntellicon] = useState(true)

  let editFormattedData;
  if (type === "edit" && initialValues.intelliconAgent !== undefined) {
    let formatedIntelliconAgents = initialValues.intelliconAgent;
    editFormattedData = { label: formatedIntelliconAgents.username, value: { username: formatedIntelliconAgents.username, password: formatedIntelliconAgents.password } }
  }
  const getIntelliconUsersAPI = (orgId) => {
    setLoading(true);
    getIntelliconUsers({ orgId }).then(({ data }) => {
      let formattedData = []; // temp array
      data.data.map((e) => {
        formattedData.push({ label: e.username, value: [{ username: e.username, password: e.password }] })
      })
      setIntelliconUser(formattedData);
      if (data.data.length === 0 && type === "add") {
        setIsIntelliconUsersAvailable(true);
      }
      if (data.data.length === 0 && type === "edit") {
        setIsIntelliconUsersAvailable(false);
      }
      setLoading(false);
    })
  }



  useEffect(() => {
    console.log("initialValues", initialValues, "and type", type)
    if (user.role[0] !== "SUPER_ADMIN") {
      getIntelliconUsersAPI(user.organization._id);
      //Below line is use for set bydefault roles while adding the organization user on the basis of parent and child organization
      user.organization.parent ? setRoleOptions(orgMultiSelectOptions['child']) : setRoleOptions(orgMultiSelectOptions['parent'])
    }
    if (user.role[0] === "SUPER_ADMIN") {
      getOrganization().then(({ data }) => {
        let formattedData = [];
        data.data.orgs.map((e) => {
          formattedData.push({ label: e.name, value: e._id, parent: e.parent ? false : true })
        })
        setParentOrgs(formattedData);
        setLoading(false);
      })
      if (type === "edit") {
        getIntelliconUsersAPI(initialValues.organization);
        if ((initialValues.user.organizationDetail.parent) ?? false) {
          setRoleOptions(orgMultiSelectOptions['child']);
        }
        else {
          setRoleOptions(orgMultiSelectOptions['parent']);
        }
        if (initialValues.role.some(e => e.value !== "RESPONSE_UNIT")) {
          if(initialValues.user.organizationDetail.parent)
          setRoleOptions(orgMultiSelectOptions['isRapidResponder']);

          else
          setRoleOptions(orgMultiSelectOptions['parent']);

        }
      }
    }
    else {
      setLoading(false);
    }
  }, []);

  const getOrgOptionsHandler = (e) => {
    console.log(e.parent)
    if (e ?? false) {
      if ((e.parent) ?? false) {
        setRoleOptions(orgMultiSelectOptions['parent']);
      }
      else {
        setRoleOptions(orgMultiSelectOptions['child']);
      }
    } else {
      return [];
    }
  }

  const validateUser = (values, type) => {
    if (type === "add") {
      if (values["role"].length > 0) {
        let role = values["role"][0]?.value === "RESPONSE_UNIT";
        if (role) {
          setSelectedIntellicon(false)
          setIsIntelliconUsersAvailable(false);
        }
        else {
          values["intelliconAgents"] !== "" ? setSelectedIntellicon(false) : setSelectedIntellicon(true);
          intelliconUser.length ? setIsIntelliconUsersAvailable(false) : setIsIntelliconUsersAvailable(true)
        }
      }
      else {
        values["intelliconAgents"] = "";
        setSelectedIntellicon(true)
      }
    }
    else if (type === "edit") {
      if (values["role"].length > 0) {
        let role = values["role"][0]?.value === "RESPONSE_UNIT"
        if (role) {
          values["intelliconAgents"] = "    "
          setSelectedIntellicon(false)
          setIsIntelliconUsersAvailable(false);
        }
        else {
          values["intelliconAgents"] = editFormattedData;
          setSelectedIntellicon(false);
          setIsIntelliconUsersAvailable(false);
        }
      }
      else {
        values["intelliconAgents"] = editFormattedData;
        setSelectedIntellicon(true)
      }
    }
  }
  const validateCall = (values) => {
    if (type === "edit") {
      let role = values["role"][0]?.value !== "RESPONSE_UNIT";
      if (role) {
        values["intelliconAgents"] = "    ";
        if (user.role[0] !== "SUPER_ADMIN") {
          getIntelliconUsersAPI(user.organization);
        }
        else {
          getIntelliconUsersAPI(initialValues.organization);
        }
      }
    }
  }

  const NoIntelliconUser = () => {
    return (
      <div className="form-col-container">
        <div className="form-group">
          <div className="has-error">
            <span className="form-field-error">No Intellicon User Available</span></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && <LoadingMask />}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema[type]}
        onSubmit={onSubmit}
      >
        {({
          isSubmitting,
          errors,
          status,
          touched,
          isValid,
          dirty,
          setFieldValue,
          setFieldTouched,
          values,
          handleBlur
        }) => (


          < Form className="admin-form" noValidate>
            {
              validateUser(values, type)
            }

            <div className="form-inputs">

              <div className="form-col-container">
                <FormikInput
                  name="first_name"
                  placeholder="First Name"
                  errors={errors.first_name}
                  touched={touched.first_name}
                />
              </div>

              <div className="form-col-container">
                <FormikInput
                  name="last_name"
                  placeholder="Last Name"
                  errors={errors.last_name}
                  touched={touched.last_name}
                />
              </div>

              <div className="form-col-container">
                <FormikInput
                  name="email"
                  type="email"
                  placeholder="Email"
                  errors={errors.email}
                  touched={touched.email}
                />
              </div>
              {type === "add" && (
                <div className="form-col-container">
                  <div className="form-user-password">
                    <FormikInput
                      name="password"
                      type="password"
                      placeholder="Password"
                      errors={errors.password}
                      touched={touched.password}
                      style={{
                        paddingRight: "152px",
                        cursor: values.emailPassword ? "no-drop" : "text"
                      }}
                      disabled={values.emailPassword}
                    />
                    <div className="email-password-container">
                      <Field
                        id="emailPassword"
                        name="emailPassword"
                        label="Send password email"
                        type="checkbox"
                        checked={values.emailPassword}
                        component={FormikCheckbox}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="form-col-container">
                <FormikImageUpload
                  name="avatar"
                  errors={errors.avatar}
                  touched={touched.avatar}
                  onTouched={setFieldTouched}
                  onValueChange={setFieldValue}
                  value={values.avatar}
                />
              </div>
              <div className="form-col-container">
                <FormikInput
                  name="contact"
                  placeholder="Phone"
                  errors={errors.contact}
                  touched={touched.contact}
                />
              </div>
              {

                user.role[0] !== "SUPER_ADMIN" ?
                  <>
                    {
                      values["organization"] = "0",
                      null
                    }
                  </>
                  : <div className="form-col-container">
                    <div className={classNames("form-group", {
                      "has-errors": errors.organization,
                      valid: errors.organization
                    })}>

                      <Select
                        className="react-multi-select "
                        classNamePrefix="react-select"
                        placeholder="Select Parent Rapid Response Partner "
                        name="organization"
                        isSearchable={false}
                        options={parentOrgs}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setLoading(true);
                          setFieldValue("organization", e.value)
                          getIntelliconUsersAPI(e.value);
                          getOrgOptionsHandler(e);
                        }
                        }
                        value={parentOrgs && parentOrgs.filter(data => data.value == values.organization)[0]} // input default value update
                        //defaultValue={this.state.defaultDealer && this.state.defaultDealer[0]}
                        isDisabled={initialValues.role[0]?.value === 'RESPONSE_UNIT' ? true : false}
                      />
                      {errors.organization && <span className="form-field-error">{errors.organization}</span>}
                    </div>

                  </div>
              }

              <div className="form-col-container">
                <FormikMultiSelect
                  touched={touched.role}
                  errors={errors.role}
                  placeholder="Role"
                  name="role"
                  value={values.role}
                  onValueChange={setFieldValue}
                  onTouch={setFieldTouched}
                  options={roleOptions}
                  callApi={validateCall}
                  values={values}
                  disabled={(type === 'edit' && initialValues.user?.intelliconAgent?.username == null) ? true : false}
                />
              </div>

              {
                isIntelliconUsersAvailable || isRole ? <NoIntelliconUser /> :
                  values["role"].some((e) => (
                    e.value !== "RESPONSE_UNIT"
                  )) &&
                  <div className="form-col-container">
                    <div className={classNames("form-group", {
                      "has-errors": errors.intelliconAgents,
                      valid: errors.intelliconAgents
                    })}>
                      <Select
                        className="react-multi-select "
                        classNamePrefix="react-select"
                        placeholder="Select Intellicon User Agent"
                        name="intelliconAgents"
                        isSearchable={false}
                        options={intelliconUser}
                        onBlur={handleBlur}
                        onChange={(e) => {
                          setFieldValue("intelliconAgents", e.value);
                          setFieldTouched("intelliconAgents", true, false);

                        }}
                        defaultValue={type === "edit" && editFormattedData}
                      />
                      {
                        selectedIntellicon && <span className="form-field-error">Intellicon agent is required</span>
                      }
                      {
                        intelliconUser.length > 0 && isIntelliconUsersAvailable && <span className="form-field-error">No Intellicon Agent Available</span>
                      }
                    </div>
                  </div>
              }

              {status && status.apiError && status.apiError.length > 0 && (
                <>
                  {status.apiError.map((error, i) => (
                    <div key={i} className="form-error">
                      {error.message}
                    </div>
                  ))}
                </>
              )}
              {status && status.successMessage && (
                <div className="form-success" style={{ marginTop: "20px" }}>
                  {status.successMessage}
                </div>
              )}
            </div>
            <div className="form-actions">
              <PrimaryButton
                type="submit"
                title={submitBtnText}
                disabled={isSubmitting || !isValid || !dirty || selectedIntellicon}
              />

              <PrimaryButton
                onClick={onCancel}
                style={{ marginLeft: "15px" }}
                title="Cancel"
              />
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default OrganizationUserForm;
