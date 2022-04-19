import React from "react";
import { Formik, Field, Form } from "formik";
import classNames from "classnames";
import * as Yup from "yup";

const passwordValidation = {
  regex: new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-]).{8,}$"
  ),
  errorMessage:
    "Must contain 8 Characters, One Uppercase, One Number and one special case character."
};

const ValidationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Current password is required.")
    .matches(passwordValidation.regex, passwordValidation.errorMessage),
  newPassword: Yup.string()
    .required("Password is required.")
    .matches(passwordValidation.regex, passwordValidation.errorMessage)
    .notOneOf(
      [Yup.ref("currentPassword"), null],
      "Current and New password should not be same."
    ),
  confirmNewPassword: Yup.string()
    .required("Confirm Password is required.")
    .oneOf([Yup.ref("newPassword"), null], "Passwords must match")
});

const UserSettingChangePasswordForm = ({ onSubmit }) => (
  <Formik
    initialValues={{
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: ""
    }}
    validationSchema={ValidationSchema}
    onSubmit={onSubmit}
  >
    {({ isSubmitting, errors, status, touched, isValid, dirty }) => (
      <Form noValidate>
        <div
          className={classNames("form-group", {
            "has-errors": errors.currentPassword && touched.currentPassword,
            valid: !errors.currentPassword && touched.currentPassword
          })}
        >
          <label className="input-lbl" htmlFor="currentPassword">
            Current password
          </label>
          <Field
            className="form-input"
            type="password"
            autoComplete="new-password"
            name="currentPassword"
            id="currentPassword"
            required
          />
          {errors.currentPassword && touched.currentPassword && (
            <span className="form-field-error">{errors.currentPassword}</span>
          )}
        </div>
        <div
          className={classNames("form-group", {
            "has-errors": errors.newPassword && touched.newPassword,
            valid: !errors.newPassword && touched.newPassword
          })}
        >
          <label className="input-lbl" htmlFor="newPassword">
            New password
          </label>
          <Field
            className="form-input"
            autoComplete="new-password"
            type="password"
            name="newPassword"
            id="newPassword"
            required
          />
          {errors.newPassword && touched.newPassword && (
            <span className="form-field-error">{errors.newPassword}</span>
          )}
        </div>
        <div
          className={classNames(
            "form-group",
            { "last-child": status && status.apiError },
            {
              "has-errors":
                errors.confirmNewPassword && touched.confirmNewPassword,
              valid: !errors.confirmNewPassword && touched.confirmNewPassword
            }
          )}
        >
          <label className="input-lbl" htmlFor="confirmNewPassword">
            Confirm password
          </label>
          <Field
            type="password"
            name="confirmNewPassword"
            id="confirmPassword"
            autoComplete="new-password"
            className="form-input"
            required
          />
          {errors.confirmNewPassword && touched.confirmNewPassword && (
            <span className="form-field-error">
              {errors.confirmNewPassword}
            </span>
          )}
        </div>
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
          <div className="form-success">{status.successMessage}</div>
        )}
        <div className="form-actions">
          <button
            className="form-submit-btn"
            type="submit"
            disabled={isSubmitting || !isValid || !dirty}
          >
            Save Changes
          </button>
        </div>
      </Form>
    )}
  </Formik>
);

export default UserSettingChangePasswordForm;
