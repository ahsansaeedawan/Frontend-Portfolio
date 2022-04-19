import React, { useState } from "react";
import classNames from "classnames";
import { GeneralSetting } from "./generalSetting";
import { SecurityAndLogin } from "./securityAndLogin";
import { changePassword, } from "../../../api";
import { LoadingMask } from "../../../components/loadingMask";
import { success, error } from "../../../components/toast";
import { Header } from "../../../components/adminHeader";
import { USERS_PASSWORD_SUCCESS } from "../../../constants/messages";
import "./setting.css";
import { useSelector } from 'react-redux';
import OrganizationSLA from "./orgSla";
import { appRoles } from "../../../assets/roles";

const TabButton = ({ activeTabIndex, tabIndex, onClick, label }) => {
  return (
    <button
      className={classNames("tab-btn", {
        "active-tab": activeTabIndex === tabIndex
      })}
      onClick={onClick}
      tabIndex={tabIndex}
    >
      {label}
    </button>
  );
};

const SettingTabButtons = ({ onClick, activeTabIndex }) => {
  const role = useSelector(state => state.user.role[0]);
  return (
    <>
      <TabButton
        label="General"
        tabIndex={0}
        onClick={onClick}
        activeTabIndex={activeTabIndex}
      />
      {
        role === appRoles.oa ? <TabButton
          label="Service Levels"
          tabIndex={1}
          onClick={onClick}
          activeTabIndex={activeTabIndex}
        /> : null
      }
      <TabButton
        label="Security and Login"
        tabIndex={2}
        onClick={onClick}
        activeTabIndex={activeTabIndex}
      />


    </>
  );
};


const Setting = () => {

  const [activeTabIndex, setactiveTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabBtnClick = e => {
    if (activeTabIndex === e.target.tabIndex) return;
    setactiveTabIndex(e.target.tabIndex);
  };

  const handleFormSubmit = (values, { setSubmitting, resetForm }) => {
    setIsLoading(true)
    changePassword({
      oldPassword: values.currentPassword,
      newPassword: values.newPassword
    })
      .then(() => {
        resetForm({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        });
        setSubmitting(false);
        setIsLoading(false);
        success(USERS_PASSWORD_SUCCESS);
      })
      .catch(e => {
        setSubmitting(false);
        setIsLoading(false);
        const apiError =
          e.response && e.response.data && e.response.data.message
            ? e.response.data.message
            : e.message;
        error(apiError);
      });
  };
  return (
    <>
      {isLoading && <LoadingMask />}
      <div className="organization-container">
        <Header title="Settings" />
        <div className="panel-outer-container">
          <div className="panel-container panel-with-header pos-r">
            <div className="panel-header users-header">
              <div className="tabs-btn-container">
                <SettingTabButtons
                  onClick={handleTabBtnClick}
                  activeTabIndex={activeTabIndex}
                />
              </div>
            </div>
            <div className="panel-body">
              {activeTabIndex === 0 && <GeneralSetting />}
              {activeTabIndex === 1 && <OrganizationSLA />}
              {activeTabIndex === 2 && (
                <SecurityAndLogin onSubmit={handleFormSubmit} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );

}

export default Setting;