import React from "react";
import { Formik, Field, Form } from "formik";
import classNames from "classnames";
import * as Yup from "yup";

export const passwordValidation = {
  regex: new RegExp(
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#?!@$%^&*-]).{8,}$"
  ),
  errorMessage:
    "Must contain 8 Characters, One Uppercase, One Number and one special case character."
};

const ValidationSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required.")
    .matches(passwordValidation.regex, passwordValidation.errorMessage),
  passwordConfirm: Yup.string()
    .required("Confirm Password is required.")
    .oneOf([Yup.ref("password"), null], "Passwords must match")
});

const ChangePasswordForm = ({ onSubmit }) => (
  <Formik
    initialValues={{
      password: "",
      passwordConfirm: ""
    }}
    validationSchema={ValidationSchema}
    onSubmit={onSubmit}
  >
    {({ isSubmitting, errors, status, touched, isValid }) => (
      <Form className="reset-password-form" noValidate>
        <div
          className={classNames("form-group", {
            "has-errors": errors.password && touched.password,
            valid: !errors.password && touched.password
          })}
        >
          <Field
            className="username"
            placeholder="New password"
            autoComplete="new-password"
            name="password"
            type="password"
            required
          />
          {errors.password && touched.password && (
            <span className="form-field-error">{errors.password}</span>
          )}
        </div>
        <div
          className={classNames(
            "form-group",
            { "last-child": status && status.apiError },
            {
              "has-errors": errors.passwordConfirm && touched.passwordConfirm,
              valid: !errors.passwordConfirm && touched.passwordConfirm
            }
          )}
        >
          <Field
            type="password"
            name="passwordConfirm"
            placeholder="Confirm Password"
            autoComplete="new-password"
            className="password"
            required
            style={{ borderTop: `1px solid #eeeeee` }}
          />
          {errors.passwordConfirm && touched.passwordConfirm && (
            <span className="form-field-error">{errors.passwordConfirm}</span>
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
        <button
          className="login-form-submit-btn"
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          Save Password
        </button>
      </Form>
    )}
  </Formik>
);

export default ChangePasswordForm;
