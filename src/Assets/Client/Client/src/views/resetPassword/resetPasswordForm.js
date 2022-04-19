import React from "react";
import { Formik, Field, Form } from "formik";
import classNames from "classnames";
import * as Yup from "yup";

const ValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid Email")
    .required("Email is required.")
});

const ResetPasswordForm = ({ onSubmit }) => (
  <Formik
    initialValues={{
      email: ""
    }}
    validationSchema={ValidationSchema}
    onSubmit={onSubmit}
  >
    {({ isSubmitting, errors, status, touched, isValid }) => (
      <Form className="reset-password-form" noValidate>
        <div
          className={classNames("form-group", {
            "has-errors": errors.email && touched.email,
            valid: !errors.email && touched.email
          })}
        >
          <Field
            className="username"
            placeholder="abc@xyz.com"
            autoComplete="username"
            name="email"
            required
          />
          {errors.email && touched.email && (
            <span className="form-field-error">{errors.email}</span>
          )}
        </div>
        {status && status.apiError && status.apiError.length > 0 && (
          <>
            <div className="form-error">
              {"This email does not exists"}
            </div>

          </>
        )}
        <button
          className="login-form-submit-btn"
          type="submit"
          disabled={isSubmitting || !isValid}
        >
          Submit
        </button>
      </Form>
    )}
  </Formik>
);

export default ResetPasswordForm;
