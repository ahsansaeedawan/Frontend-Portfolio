import React, { useContext } from "react";
import { UserContext } from "../../../context";
import { SettingBox } from "./settingBox";
import { SettingReadOnlyInput } from "./settingReadOnlyInput";


const OrganizationSLA = () => {
    const user = useContext(UserContext);
    return (
        < div className="setting-panel-body" >
            <div className="panel-body-content admin-form no-margin">
                < SettingBox
                    title="Organization Service Levels"
                    iconPath="/assets/images/icon-settings-personal.svg"
                >
                    <SettingReadOnlyInput name="verificationTime" value={user.organization.slas.verificationTime} label={"Verification Time"} />
                    <SettingReadOnlyInput name="acknowledgmentTime" value={user.organization.slas.acknowledgmentTime} label={"Acknowledgment Time"} />
                    <SettingReadOnlyInput name="responseUnitAssignmentTime" value={user.organization.slas.responseUnitAssignmentTime} label={"ResponseUnit Assignment Time"} />
                    <SettingReadOnlyInput name="responseUnitArrivalTime" value={user.organization.slas.responseUnitArrivalTime / 60} label={"ResponseUnit Arrival Time"} />
                    <SettingReadOnlyInput name="localAuthoritiesEngagementTime" value={user.organization.slas.localAuthoritiesEngagementTime} label={"Engagement of Local Authorities"} />
                    <SettingReadOnlyInput name="intimatingLocalAuthoritiesEngagementTime" value={user.organization.slas.intimatingLocalAuthoritiesEngagementTime} label={"Intimating Iylus Monitoring Center about engagement of Local Authorities"} />
                </SettingBox>

            </div>
        </div >



    );
};

export default OrganizationSLA;