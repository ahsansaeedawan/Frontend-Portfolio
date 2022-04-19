import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { FormikInput } from "../formikInput";
import { FormikImageUpload } from "../formikImageUpload";
import { organizationValidationSchema } from "../../constants/formValidations";
import { AddOrganizationGoogleMap } from "../addOrganization/addOrganizationGoogleMap";
import { PrimaryButton } from "../button";
import { FormikRadio } from "../formikRadio";
import { FormikToggle } from "../formikToggle";
import "./organizationForm.css";
import { FormikSingleSelect } from "../formikSingleSelect";
import Select from 'react-select';
import classNames from "classnames";
import { getOrganization } from "../../api";
import { LoadingMask } from "../loadingMask";
import { IntelliconFields } from "../intelliconFields";
import IntelliconFieldsReadOnly from "../intelliconFields/intelliconFieldsReadOnly";

function OrganizationForm({
  type,
  onSubmit,
  submitBtnText,
  onCancel,
  initialValues,
  onMapCenterChange,
  onMapLoad,
  zoom,
  center,
  onAutoCompleteLoad,
  onPlaceChanged,
  orgId
}) {
  const intelliconAgents = initialValues.intelliconAgents;
  const [parentOrgs, setParentOrgs] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [step, setStep] = useState(true);

  const [noOfSipUser, setNoOfSipUser] = useState(['1']);

  const handleAddSipUsername = (length) => {
    setNoOfSipUser((prevCount) => [...prevCount, length]);
  }

  useEffect(() => {
    getOrganization().then(({ data }) => {
      let formattedData = []; // temp array
      setLoading(false);
      data.data.orgs.map((e) => {
        formattedData.push({ label: e.name, value: e._id })
      })
      setParentOrgs(formattedData);
    })
  }, []);
  const handleFormStep = () => {
    setStep(!step);
  }
  return (

    <>
      {isLoading && <LoadingMask />}
      {
        <Formik
          initialValues={initialValues}
          validationSchema={organizationValidationSchema}
          onSubmit={onSubmit}
        >
          {({
            handleBlur,
            isSubmitting,
            errors,
            status,
            touched,
            isValid,
            setFieldValue,
            setFieldTouched,
            values,
            dirty,
          }) => (
              <Form className="admin-form" noValidate>
                {step &&
                  <>
                    <div className="form-col-container">
                      <FormikInput
                        name="name"
                        placeholder="Organization name"
                        errors={errors.name}
                        touched={touched.name}
                      />
                    </div>
                    <div className="form-col-container">
                      <FormikInput
                        name="person"
                        placeholder="Contact person"
                        errors={errors.person}
                        touched={touched.person}
                      />

                      <FormikImageUpload
                        name="logo"
                        errors={errors.logo}
                        touched={touched.logo}
                        onTouched={setFieldTouched}
                        onValueChange={setFieldValue}
                        value={values.logo}
                      />
                    </div>
                    <div className="form-col-container">
                      <FormikInput
                        name="contact"
                        placeholder="Phone"
                        errors={errors.contact}
                        touched={touched.contact}
                      />
                      <FormikInput
                        name="email"
                        type="email"
                        placeholder="Email"
                        errors={errors.email}
                        touched={touched.email}
                      />
                    </div>

                    <div className="form-col-container">
                      <FormikInput
                        name="address"
                        placeholder="Address"
                        errors={errors.address}
                        touched={touched.address}
                      />
                    </div>

                    <div className="form-col-container">
                      <FormikInput
                        name="country"
                        placeholder="Country"
                        errors={errors.country}
                        touched={touched.country}
                      />

                      <FormikInput
                        name="city"
                        placeholder="City"
                        errors={errors.city}
                        touched={touched.city}
                      />
                    </div>
                    <div className="form-col-container">
                      <div className="col-container" style={{ borderBottom: "0px" }}>
                        <span className="col-title">Rapid Response Partner Type</span>
                        <div className="col-radiobuttons col-action">
                          <FormikRadio
                            onValueChange={setFieldValue}
                            onTouch={setFieldTouched}
                            label={"Parent"}
                            name="isParent"
                            checked={values["isParent"] === true}
                            value={true}
                          />
                          <FormikRadio
                            onValueChange={setFieldValue}
                            onTouch={setFieldTouched}
                            label={"Child"}
                            name="isParent"
                            checked={values["isParent"] === false}
                            value={false}
                          />

                        </div>
                      </div>
                    </div>
                    {
                      values["isParent"] == true ?
                        <>
                          {
                            values["parent"] = "0",
                            null
                          }
                        </>
                        :
                        <>
                          <div className="form-col-container">
                            <div className={classNames("form-group", {
                              "has-errors": errors.parent,
                              valid: errors.parent
                            })}>
                              <Select
                                className="react-multi-select "
                                classNamePrefix="react-select"
                                placeholder="Select Parent Organization "
                                name="parent"
                                isSearchable={false}
                                options={parentOrgs}
                                onBlur={handleBlur}
                                onChange={(e) => { setFieldValue("parent", e.value) }}
                                value={parentOrgs && parentOrgs.filter(data => data.value == values.parent)[0]} />
                              {errors.parent && <span className="form-field-error">{errors.parent}</span>}
                            </div>
                          </div>
                        </>
                    }

                    {/* //After 02 15 2021 realese dealer subdealer conecpt are remove from our project so remove or comment these lines */}
                    <div className="form-col-container">
                      <FormikSingleSelect
                        orgId={orgId}
                        dealerErrors={errors.dealerId}
                        dealerName="dealerId"
                        dealerValue={values.dealerId}
                        dealerOnTouched={setFieldTouched}
                        dealerOnValueChange={setFieldValue}
                        dealerOnBlur={handleBlur}

                        subDealerErrors={errors.subDealerId}
                        subDealerName="subDealerId"
                        subDealerValue={values.subDealerId}
                        subDealerOnTouched={setFieldTouched}
                        subDealerOnValueChange={setFieldValue}
                        subDealerOnBlur={handleBlur}
                      />

                    </div>
                    <div className="form-col-container">
                      <div className="col-container">
                        <span className="col-title">Rapid Response Auto Assignment </span>
                        <div className="col-radiobuttons col-action">
                          <FormikRadio
                            onValueChange={setFieldValue}
                            onTouch={setFieldTouched}
                            label={"True"}
                            name="responseUnitAutoAssignment"
                            checked={values["responseUnitAutoAssignment"] === true}
                            value={true}
                          />
                          <FormikRadio
                            onValueChange={setFieldValue}
                            onTouch={setFieldTouched}
                            label={"False"}
                            name="responseUnitAutoAssignment"
                            checked={values["responseUnitAutoAssignment"] === false}
                            value={false}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-col-container">
                      <div className="col-container">
                        <span className="col-title">Enable Video Access</span>
                        <div className="col-toggle col-action">
                          <FormikToggle
                            name="videoFeed"
                            checked={values["videoFeed"]}
                            onValueChange={setFieldValue}
                            onTouch={setFieldTouched}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="form-col-container">
                      <div className="col-container">
                        <span className="col-title">Assignment Delay </span>
                        <FormikInput
                          readOnly={true}
                          type="number"
                          name="delayTime"
                        />
                      </div>
                    </div>
                    {
                      type === "add" &&
                      <div className="form-col-container" >
                        <div className="col-container" style={{ flexDirection: "column", justifyContent: "center", alignItems: "normal" }}>
                          <span className="col-title" style={{ marginBottom: "15px" }}>Intellicon Users</span>
                          {noOfSipUser.map((_, i) => (
                            <IntelliconFields errors={errors} touched={touched} noOfSipUser={noOfSipUser} handleAddSipUsername={handleAddSipUsername} arrLength={noOfSipUser.length} key={`${noOfSipUser.length + 1, i}`} uid={i} />
                          ))}
                        </div>
                      </div>}
                    {

                      type === "edit" && initialValues.intelliconAgents !== undefined &&
                      <div className="form-col-container" >
                        <div className="col-container" style={{ flexDirection: "column", justifyContent: "center", alignItems: "normal" }}>
                          <span className="col-title" style={{ marginBottom: "15px" }}>Intellicon Users</span>
                          {
                            values["intelliconUsername"] = "  ", values["intelliconPassword"] = "  ",
                            intelliconAgents.map((e, i) => (
                              < IntelliconFieldsReadOnly key={`${e.username, i}`} data={e} />
                            ))
                          }
                        </div>
                      </div>
                    }

                    <div className="form-col-container">
                      <div className="col-container" style={{ borderBottom: "0px" }}>
                        <h2 className="col-title">Landing Map</h2>
                      </div></div>
                    <div className="form-col-container">
                      <FormikInput
                        name="lat"
                        placeholder="Latitude"
                        errors={errors.lat}
                        touched={touched.lat}
                        readOnly
                      />
                      <FormikInput
                        name="lng"
                        placeholder="Longitude"
                        errors={errors.lng}
                        touched={touched.lng}
                        readOnly
                      />
                      <FormikInput
                        name="zoom"
                        placeholder="Zoom Level"
                        errors={errors.zoom}
                        touched={touched.zoom}
                        readOnly
                      />
                    </div>

                    <div style={{ marginTop: "33px" }}>
                      <AddOrganizationGoogleMap
                        onCenterChanged={() => onMapCenterChange(setFieldValue)}
                        onLoad={onMapLoad}
                        zoom={zoom}
                        center={center}
                        onAutocompleteLoad={onAutoCompleteLoad}
                        onPlaceChanged={onPlaceChanged}
                      />
                    </div>
                  </>
                }

                {!step && <>

                  <div className="sla-container">



                    <h2 className="modal-title">Internal Service Levels: </h2>
                    <div className="form-col-container">
                      <div className="col-container">
                        <span className="col-title">Iylus Digital Services Uptime [98] % </span>
                        <FormikInput
                          min="0"
                          type="number"
                          name="serviceUpTime"
                          placeholder="Iylus Digital Services Uptime"
                          errors={errors.serviceUpTime}
                          touched={touched.serviceUpTime}
                        />

                      </div>
                    </div>
                    <div className="form-col-container">
                      <div className="col-container">
                        <span className="col-title">Transfer of Incident Alert from Iylus Monitoring Center to Response Center within [120] seconds to [240] seconds</span>
                        <FormikInput
                          min="120"
                          type="number"
                          name="verificationTime"
                          placeholder="Assignment and Verification Time"
                          errors={errors.verificationTime}
                          touched={touched.verificationTime}
                        />

                      </div>
                    </div>
                    {
                      values["isParent"] == true ?
                        <>
                          {
                            values["parent"] = "0",
                            null
                          }
                        </>
                        : <>
                          <h2 className="modal-title">External Service Levels: </h2>
                          <div className="form-col-container">
                            <div className="col-container">
                              <span className="col-title">Acknowledgement of receiving Incident Alert by Response Monitoring Agent within [60] seconds to [120] seconds</span>
                              <FormikInput
                                min="60"
                                type="number"
                                name="acknowledgmentTime"
                                placeholder="Acknowledgment Time receiving Incident Alert"
                                errors={errors.acknowledgmentTime}
                                touched={touched.acknowledgmentTime}
                              />

                            </div>
                          </div>
                          <div className="form-col-container">
                            <div className="col-container">
                              <span className="col-title">Assignment of Rapid Responder by Response Monitoring Agent within [60] seconds to [180] seconds of Incident Alert acknowledgement</span>
                              <FormikInput
                                min="60"
                                type="number"
                                name="responseUnitAssignmentTime"
                                placeholder="Assignment of Rapid Responder"
                                errors={errors.responseUnitAssignmentTime}
                                touched={touched.responseUnitAssignmentTime}
                              />


                            </div>
                          </div>
                          {/* when the requiremnts are clear and they will ask all things realted to this field is done just uncomment the below code */}
                          {/* <div className="form-col-container">
                      <div className="col-container">
                        <span className="col-title">Acknowledgement of receiving Incident Alert by Rapid Responder</span>
                        <FormikInput
                          min="60"
                          type="number"
                          name="responseUnitAcknowledgmentTime"
                          placeholder="Intimating Iylus Monitoring Center"
                          errors={errors.responseUnitAcknowledgmentTime}
                          touched={touched.responseUnitAcknowledgmentTime}
                        />
                      </div>
                    </div> */}

                          <div className="form-col-container">
                            <div className="col-container">
                              <span className="col-title">Engagement of Local Authorities by Response Monitoring Agent within [60] seconds to [240] seconds of Incident Alert Acknowledgement</span>
                              <FormikInput
                                min="60"
                                type="number"
                                name="localAuthoritiesEngagementTime"
                                placeholder="Engagement of Local Authorities"
                                errors={errors.localAuthoritiesEngagementTime}
                                touched={touched.localAuthoritiesEngagementTime}
                              />
                            </div>
                          </div>
                          <div className="form-col-container">
                            <div className="col-container">
                              <span className="col-title">Intimating Iylus Monitoring Center about engagement of Local Authorities within [60] seconds of engagement of Local Authorities</span>
                              <FormikInput
                                min="60"
                                type="number"
                                name="intimatingLocalAuthoritiesEngagementTime"
                                placeholder="Intimating Iylus Monitoring Center"
                                errors={errors.intimatingLocalAuthoritiesEngagementTime}
                                touched={touched.intimatingLocalAuthoritiesEngagementTime}
                              />
                            </div>
                          </div>


                          <div className="form-col-container">
                            <div className="col-container">
                              <span className="col-title">Arrival of Rapid Responder to the incident location within [15] minutes to [30] minutes</span>
                              <FormikInput
                                min="15"
                                type="number"
                                name="responseUnitArrivalTime"
                                placeholder="Arrival of Rapid Responder"
                                errors={errors.responseUnitArrivalTime}
                                touched={touched.responseUnitArrivalTime}
                              />


                            </div>
                          </div>

                          <div className="form-col-container">
                            <div className="col-container">
                              <span className="col-title">Customer Satisfaction [95] % positive feedback as per Iylus’s unified feedback mechanism</span>
                              <FormikInput
                                min="0"
                                type="number"
                                name="customerSatisfaction"
                                placeholder="Customer Satisfaction"
                                errors={errors.customerSatisfaction}
                                touched={touched.customerSatisfaction}
                              />
                            </div>
                          </div>
                        </>
                    }
                  </div>
                </>
                }



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
                  <div className="form-success" style={{ marginTop: "20px" }}>
                    {status.successMessage}
                  </div>
                )}
                <div className="form-actions">

                  {!step &&
                    <PrimaryButton
                      type="submit"
                      title={submitBtnText}
                      disabled={isSubmitting || !isValid || !dirty}

                    />
                  }
                  <PrimaryButton
                    title={step ? "Next" : "Back"}
                    disabled={type !== "edit" ? isSubmitting || !isValid || !dirty : false}
                    onClick={handleFormStep}
                    style={{ marginLeft: "15px" }}
                  />

                  <PrimaryButton
                    onClick={onCancel}
                    style={{ marginLeft: "15px" }}
                    title="Cancel"
                  />
                </div>
              </Form>
            )
          }
        </Formik >
      }
    </>
  );
}

export default OrganizationForm;
