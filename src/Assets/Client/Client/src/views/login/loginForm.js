import React from "react";
import { Formik, Form } from "formik";
import classNames from "classnames";
import { FormikInput } from "../../components/formikInput";
import { loginFormValidationSchema } from "../../constants/formValidations";
import { LOGIN_FORM_INITIAL_VALUES } from "../../constants/formInitialValues"

const LoginForm = ({ onSubmit }) => (
  <Formik
    initialValues={LOGIN_FORM_INITIAL_VALUES}
    validationSchema={loginFormValidationSchema}
    onSubmit={onSubmit}
  >
    {({ isSubmitting, errors, status, touched, isValid, dirty }) => (
      <Form noValidate>
        <div
          className={classNames("form-group", {
            "has-errors": errors.email && touched.email,
            valid: !errors.email && touched.email
          })}
        >

          <FormikInput
            placeholder="Email"
            name="email"
            errors={errors.email}
            touched={touched.email}
            className="username"
            required
          />

        </div>
        <div
          className={classNames(
            "form-group",
            { "last-child": status && status.apiError },
            {
              "has-errors": errors.password && touched.password,
              valid: !errors.password && touched.password
            }
          )}
        >
          <FormikInput
            type="password"
            name="password"
            placeholder="Password"
            errors={errors.password}
            touched={touched.password}
            className="password"
            autoComplete="new-password"
            required
          />

        </div>
        {status && status.apiError && (
          <div className="form-error">{status.apiError}</div>
        )}
        <button
          className="login-form-submit-btn"
          type="submit"
          disabled={isSubmitting || !isValid || !dirty}
        >
          Sign in
        </button>
      </Form>
    )}
  </Formik>
);

export default LoginForm;
