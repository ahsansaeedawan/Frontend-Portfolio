import React from "react";
import { Formik, Form } from "formik";
import { SettingBox } from "./settingBox";
import { FormikInput } from "../../../components/formikInput";
import { changePasswordValidationSchema } from "../../../constants/formValidations";
import { CHANGE_PASSWORD_FORM_INITIAL_VALUES } from "../../../constants/formInitialValues";

export const SecurityAndLogin = ({ onSubmit }) => {
  return (
    <Formik
      initialValues={CHANGE_PASSWORD_FORM_INITIAL_VALUES}
      validationSchema={changePasswordValidationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting, errors, touched, isValid, dirty }) => (
        <Form className="admin-form no-margin" noValidate>
          <div className="setting-panel-body">
            <div className="panel-body-content">
              <SettingBox
                title="Password"
                iconPath="/assets/images/icon-settings-password.svg"
              >
                <div className="form-col-container">
                  <FormikInput
                    name="currentPassword"
                    placeholder="Current Password"
                    type="password"
                    autoComplete="new-password"
                    errors={errors.currentPassword}
                    touched={touched.currentPassword}
                  />
                </div>

                <div className="form-col-container">
                  <FormikInput
                    name="newPassword"
                    placeholder="New Password"
                    type="password"
                    autoComplete="new-password"
                    errors={errors.newPassword}
                    touched={touched.newPassword}
                  />
                </div>

                <div className="form-col-container">
                  <FormikInput
                    name="confirmNewPassword"
                    placeholder="Confirm New Password"
                    type="password"
                    autoComplete="new-password"
                    errors={errors.confirmNewPassword}
                    touched={touched.confirmNewPassword}
                  />
                </div>
              </SettingBox>
              <div className="form-actions  ">
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid || !dirty}
                  className="btn-form-action primary-btn"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
