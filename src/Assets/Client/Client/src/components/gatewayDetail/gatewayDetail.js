import React, { useContext } from "react";
import classNames from "classnames";
import ContactDetail from "./contactDetail";
import GatewayInformation from "./gatewayInfromation";
import GatewayTimeline from "./gatewayTimeline";
import GatewayDetailMap from "./gatewayDetailMap";
import { CustomScroll } from "../customScroll";
import CloseIcon from "../../assets/images/icon-close.png";
import "./gatewayDetail.css";
import { VerifyAlarm, AcknowledgeAlarm } from "./gatewayIncidentVerify";
import { UserContext } from "../../context";
import VehicleAssignment from "../vehicleAssignment/vehicleAssignment";
import InfoMessage from "../infoMessage/infoMessage";
import {
  GATEWAY_OPERATION_NOT_ASSIGNED,
  NO_SUBSCRIPTION,
  NO_ADDON
} from "../../constants/messages";
import { CloseAlarm } from "../closeAlarm/closeAlarm";
import { DisableOperations } from "../disableOperations/disableOperations";
import LawEnforcementAction from "./gatewayLawEnforcementAction";

const GatewayDetailsPanel = ({ title, className, children }) => {
  return (
    <div className={classNames("gateway-details-panel", className)}>
      <h2 className="panel-heading">{title}</h2>

      <CustomScroll
        autoHide
        autoHideTimeout={500}
        autoHideDuration={200}
        hideTracksWhenNotNeeded
      >
        <div className="panel-body">{children}</div>
      </CustomScroll>
    </div>
  );
};

const AddOn = ({ addonName }) => {
  return (
    <div className="addon-container">
      {
        addonName === "" ? <div className="addon">
          {NO_ADDON}
        </div> :
          addonName.split(",").map((addOn, i) => (
            <div key={`${addOn}--${i}`} className="addon">
              {addOn}
            </div>
          ))}
    </div>
  );
}

const SubscriptionPlan = ({ planName, addOn, billingPlan }) => {
  if (billingPlan.action === "live") {
    return (
      <div className="gateway-subscription-plan abs-sf-icon">
        <h4>Subscription Plan</h4>
        <h3>{planName ? planName : NO_SUBSCRIPTION}</h3>
        <AddOn addonName={addOn} />
      </div>
    );
  }
  return (
    <div className="gateway-subscription-plan abs-sf-icon">
      <h3>{`Your Subscripton status is ${billingPlan.action}`}</h3>
    </div>
  );


};

const GatewayDetail = ({
  isVisible,
  gatewayDetailInitialized,
  gateway,
  onClose,
  onGatewayAction,
}) => {
  const user = useContext(UserContext);
  return (
    <>
      <div
        className={classNames(
          "gateway-detail",
          "animated",
          { "d-none": !gatewayDetailInitialized },
          { slideInLeft: isVisible },
          { slideOutLeft: !isVisible }
        )}
      >
        {gateway && (
          <>
            <img
              className="detail-close"
              onClick={onClose}
              src={CloseIcon}
              alt=""
            />
            <GatewayDetailMap
              center={gateway.coordinates}
              status={gateway.status}
              mac={gateway.macAddress}
              online={gateway.online}
            />

            <div className="detail-cnt">
              <GatewayDetailsPanel className="details" title="Details">
                <SubscriptionPlan billingPlan={gateway.subscriptionStatus} planName={gateway.currentPlan} addOn={gateway.addons} />

                <ContactDetail
                  assignedAgent={gateway.assignedAgent}
                  mac={gateway.macAddress}
                  contacts={gateway.contacts}
                  showCallBtn={true}
                  user={user}
                />

                <GatewayInformation
                  mac={gateway.macAddress}
                  countryFields={gateway.countryFields}
                  information={{
                    address: gateway.address.fullAddress,
                    floor: gateway.info.floors || 0,
                    childrens: gateway.info.infants || 0,
                    adults: gateway.info.persons || 0,
                    handicapped: gateway.info.disables || 0,
                    pets: gateway.info.pets || 0,
                    elder: gateway.info.persons || 0,
                    duressCode: gateway.duressCode || "N/A",
                    pinCode: gateway.pinCode || "N/A",
                  }}
                />
                <GatewayTimeline
                  status={gateway.status}
                  mac={gateway.macAddress}
                  isVisible={isVisible}
                />
              </GatewayDetailsPanel>
              <GatewayDetailsPanel
                className="gateway-operations"
                title="Operations"
              >
                {gateway.status === "idle" || gateway.status === "armed" ? (
                  <InfoMessage message={GATEWAY_OPERATION_NOT_ASSIGNED} />
                ) : (
                    gateway.assignedAgent && gateway.assignedAgent.id == user._id ?
                      <div className="operations-wizard-container">
                        <div
                          className={classNames("wizard-panel", {
                            current: gateway.status === "incident",
                            complete:
                              gateway.status === "verified" ||
                              gateway.status === "acknowledged",
                          })}
                        >
                          <span className="step-count">Step 1 of 5</span>
                          <h2 className="wizard-panel-heading">Incident Alert Verification  </h2>
                          <div className="wizard-panel-body">

                            <VerifyAlarm
                              status={gateway.status}
                              gatewayId={gateway.macAddress}
                              onClick={onGatewayAction}
                            />
                          </div>
                        </div>
                        <div
                          className={classNames("wizard-panel", {
                            current: gateway.status === "verified",
                            complete: gateway.status === "acknowledged",
                          })}
                        >
                          <span className="step-count">Step 2 of 5</span>
                          <h2 className="wizard-panel-heading">Incident Alert Acknowledgement</h2>
                          <div className="wizard-panel-body">
                            <AcknowledgeAlarm
                              status={gateway.status}
                              gatewayId={gateway.macAddress}
                              onClick={onGatewayAction}
                            />



                          </div>
                        </div>
                        <div
                          className={classNames("wizard-panel", {
                            current:
                              gateway.status === "acknowledged" &&
                              !gateway.assignmentComplete,
                            complete:
                              gateway.status === "acknowledged" &&
                              gateway.assignmentComplete,
                          })}
                        >
                          <span className="step-count">Step 3 of 5</span>
                          <h2 className="wizard-panel-heading">Local Authorities Engagement</h2>
                          <div className="wizard-panel-body">
                            {user &&
                              gateway.status === "acknowledged" &&
                              !gateway.assignmentComplete &&

                              <LawEnforcementAction
                                status={gateway.status}
                                gatewayId={gateway.macAddress}
                                onClick={onGatewayAction}
                                assignedAgent={gateway.assignedAgent} />
                            }
                          </div>
                        </div>

                        <div
                          className={classNames("wizard-panel", {
                            current:
                              gateway.status === "acknowledged" &&
                              !gateway.assignmentComplete,
                            complete:
                              gateway.status === "acknowledged" &&
                              gateway.assignmentComplete,
                          })}
                        >
                          <span className="step-count">Step 4 of 5</span>
                          <h2 className="wizard-panel-heading">Assignment Rapid Responder </h2>
                          <div className="wizard-panel-body">
                            {user &&
                              gateway.status === "acknowledged" &&
                              !gateway.assignmentComplete &&
                              user.permissions.assignResponseUnit && (
                                <VehicleAssignment
                                  mac={gateway.macAddress}
                                  lat={gateway.coordinates.lat}
                                  lng={gateway.coordinates.lng}
                                />
                              )
                            }
                          </div>
                        </div>





                        <div
                          className={classNames("wizard-panel", {
                            current: gateway.assignmentComplete,
                          })}
                        >
                          <span className="step-count">Step 5 of 5</span>
                          <h2 className="wizard-panel-heading">Incident Closed</h2>
                          <div className="wizard-panel-body">
                            {gateway.assignmentComplete ? (
                              <CloseAlarm
                                onClick={onGatewayAction}
                                mac={gateway.macAddress}
                                status={gateway.status}
                              />
                            ) : null}
                          </div>
                        </div>
                      </div> : <DisableOperations />

                  )}
              </GatewayDetailsPanel>
            </div>
          </>
        )}
        {!gateway && <p>Please Select Gateway In Order to View The Details.</p>}
      </div>
    </>
  );
};

GatewayDetail.propTypes = {};

export default GatewayDetail;
