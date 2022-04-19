import React, { useState } from "react";
import { LoadingMask } from "../loadingMask";
import { changePassword } from "../../api";
import UserSettingChangePasswordForm from "./userSettingChangePasswordForm";

import "./userSettingPassword.css";

const UserSettingPassword = props => {
  const [displayLoading, setDisplayLoading] = useState(false);

  const handleFormSubmit = (
    values,
    { setSubmitting, setStatus, resetForm }
  ) => {
    // clear the previous errors in the form
    setStatus({});
    setDisplayLoading(true);
    changePassword({
      oldPassword: values.currentPassword,
      newPassword: values.newPassword
    })
      .then(({ data }) => {
        setStatus({});
        if (data.success) {
          resetForm({
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: ""
          });
          setStatus({
            successMessage: "Your password has been updated successfully."
          });
          setTimeout(() => {
            setStatus({});
          }, 3000);
        } else {
          setStatus({ apiError: data.errors || [] });
        }
      })
      .catch(e => {
        const apiError =
          e.response && e.response.data && e.response.data.errors
            ? e.response.data.errors
            : new Array({ message: e.message });
        setStatus({ apiError: apiError || [] });
      })
      .finally(() => {
        setDisplayLoading(false);
        setSubmitting(false);
      });
  };

  return (
    <>
      {displayLoading && <LoadingMask />}
      <div className="us-change-password">
        <p className="cp-lbl">Change your password</p>
        <UserSettingChangePasswordForm onSubmit={handleFormSubmit} />
      </div>
    </>
  );
};

export default UserSettingPassword;
