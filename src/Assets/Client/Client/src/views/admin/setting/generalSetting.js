import React, { useContext } from "react";
import { UserContext } from "../../../context";
import { SettingBox } from "./settingBox";
import { SettingReadOnlyInput } from "./settingReadOnlyInput";
import { appRoles } from '../../../assets/roles';

const PersonalDetails = ({ fullName, organizatioName, role, label }) => {
  return (
    <SettingBox
      title="Personal Details"
      iconPath="/assets/images/icon-settings-personal.svg"
    >
      <SettingReadOnlyInput name="Full Name" value={fullName} label={'Full name'} />
      <SettingReadOnlyInput name="Organization Name" value={organizatioName} label={'Organization name'} />
      <SettingReadOnlyInput name="Role" value={role} label={'User role'} />
    </SettingBox>
  );
};

const ContactDetails = ({ email, phone, label }) => {
  return (
    <SettingBox
      title="Contact Details"
      iconPath="/assets/images/icon-settings-contact.svg"
    >
      <SettingReadOnlyInput name="Email" value={email} label={'Email address'} />
      {phone && <SettingReadOnlyInput name="Phone" value={phone} label={'Contact number'} />}
    </SettingBox>
  );
};

export const GeneralSetting = () => {
  const user = useContext(UserContext);

  const roleFormat = (role) => {
    let updatedRole = role.map(role => role.split('_').join(' '));
    return updatedRole.join(',  ');
  }

  return (
    <div className="setting-panel-body">
      <div className="panel-body-content admin-form no-margin">


        {
          user.role.includes(appRoles.oa) ? // if Logged user is Organization Admin then
            <>
              <PersonalDetails
                fullName={`${user.organization.person ? user.organization.person : ""}`} //if Organization admin then displaying person name 
                organizatioName={`${user.organization.name ? user.organization.name : ""}`}
                role={`${user.role ? roleFormat(user.role) : ""}`}
                label={{ name: 'Full name', organizatioName: 'Organization name', role: 'Role' }}
              />
              <ContactDetails
                email={`${user.email ? user.email : ""}`}
                phone={`${user.organization.contact ? user.organization.contact : ""}`}
                label={{ email: 'Email address', phone: 'Contact number' }}
              />
            </>
            : user.role.includes(appRoles.sa) ? // if Logged user is Super Admin then 
              <>
                <PersonalDetails
                  fullName={`${user.first_name ? user.first_name : ""} ${user.last_name ? user.last_name : ""
                    }`}
                  organizatioName={`Iylus inc`}
                  role={`${user.role ? roleFormat(user.role) : ""}`}
                  label={{ name: 'Full name', organizatioName: 'Organization name', role: 'Role' }}
                />

                <ContactDetails
                  email={`${user.email ? user.email : ""}`}
                  label={{ email: 'Email address', phone: 'Contact number' }}
                />
              </>
              : //else
              <>
                <PersonalDetails
                  fullName={`${user.first_name && user.last_name ? (user.first_name + ' ' + user.last_name) : ""}`} //if Organization admin then displaying person name 
                  organizatioName={`${user.organization.name ? user.organization.name : ""}`}
                  role={`${user.role ? roleFormat(user.role) : ""}`}
                  label={{ name: 'Full name', organizatioName: 'Organization name', role: 'Role' }}
                />

                <ContactDetails
                  email={`${user.email ? user.email : ""}`}
                  phone={`${user.contact ? user.contact : ""}`}
                  label={{ email: 'Email address', phone: 'Contact number' }}
                />
              </>
        }
      </div>
    </div>
  );
};
