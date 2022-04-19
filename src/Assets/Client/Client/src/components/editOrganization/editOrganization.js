import React, { Component } from "react";
import Modal from "react-modal";
import SlidingModal from "../ReactSlideModal";
import { LoadingMask } from "../loadingMask";
import { editOrganization, logAmplitudeEvent } from "../../api";
import { success } from "../../components/toast";
import { ORG_UPDATED_SUCCESS } from "../../constants/messages";
import { ACCOUNT_MANAGEMENT_EDIT_ORGANIZATION } from "../../constants/amplitude";
import OrganizationForm from "../organizationForm/organizationForm";

class EditOrganization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      center: {
        lat: parseFloat(props.organization.coordinates[0]),
        lng: parseFloat(props.organization.coordinates[1]),
      },
      zoom: parseFloat(props.organization.zoom),
    };
  }

  componentWillReceiveProps(nextProps) {
    let zoom,
      center = {};

    if (this.props.organization.zoom !== nextProps.organization.zoom) {
      zoom = parseInt(nextProps.organization.zoom) || 0;
    }

    if (
      this.props.organization.coordinates !== nextProps.organization.coordinates
    ) {
      center.lat = parseFloat(nextProps.organization.coordinates[0]);
      center.lng = parseFloat(nextProps.organization.coordinates[1]);
    }

    if (this.props.organization !== nextProps.organization) {
      this.setState({ zoom, center });
    }
  }

  componentDidMount() {
    Modal.setAppElement(this.el);
  }

  handleMapOnLoad = (map) => {
    this.map = map;
  };

  handleCenterChange = (setFieldValue) => {
    if (this.map) {
      setFieldValue("lat", this.map.getCenter().lat());
      setFieldValue("lng", this.map.getCenter().lng());
      setFieldValue("zoom", this.map.getZoom());
    }
  };

  handleFormSubmit = (values, { setSubmitting, setStatus, resetForm }) => {
    // clear the previous errors in the form
    let parentValue = values.isParent;

    setStatus({});
    this.setState({ isLoading: true });
    const formData = new FormData();
    formData.set("name", values.name);
    formData.set("email", values.email);
    formData.set("person", values.person);
    formData.set("country", values.country);
    formData.set("city", values.city);
    formData.set("contact", values.contact);
    formData.set("address", values.address);
    formData.set("dealerId", values.dealerId);
    formData.set("subDealerId", values.subDealerId);
    formData.set("zoom", values.zoom);
    formData.set("videoFeed", values.videoFeed);
    // formData.set("delayTime", values.delayTime);
    formData.set("serviceUpTime", values.serviceUpTime);
    formData.set("verificationTime", values.verificationTime);
    formData.set("acknowledgmentTime", values.acknowledgmentTime);
    formData.set("responseUnitAssignmentTime", values.responseUnitAssignmentTime);
    // formData.set("responseUnitAcknowledgmentTime", values.responseUnitAcknowledgmentTime);
    formData.set("responseUnitArrivalTime", values.responseUnitArrivalTime * 60);// converting minutes into seconds 
    formData.set("customerSatisfaction", values.customerSatisfaction);
    formData.set("responseUnitAutoAssignment", values.responseUnitAutoAssignment);
    formData.append("coordinates[]", values.lat);
    formData.append("coordinates[]", values.lng);
    formData.append("localAuthoritiesEngagementTime", values.localAuthoritiesEngagementTime);
    formData.append("intimatingLocalAuthoritiesEngagementTime", values.intimatingLocalAuthoritiesEngagementTime);


    if (this.props.organization.logo !== values.logo) {
      formData.append("logo", values.logo);
    }
    if (!parentValue) formData.set("parent", values.parent);


    editOrganization(this.props.organization._id, formData)
      .then(({ data }) => {
        logAmplitudeEvent({
          event_type: ACCOUNT_MANAGEMENT_EDIT_ORGANIZATION,
        }).catch(() => { });
        setStatus({});
        if (data.success) {
          this.setState({ isLoading: false }, () => {
            this.props.onClose();
            this.props.onSuccess();
          });
          success(ORG_UPDATED_SUCCESS);
        } else {
          setStatus({ apiError: data.errors || [] });
          this.setState({ isLoading: false });
        }
      })
      .catch((e) => {
        const apiError =
          e.response && e.response.data && e.response.data.errors
            ? e.response.data.errors
            : new Array({ message: e.message });
        setStatus({ apiError: apiError || [] });
        this.setState({ isLoading: false });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  render() {
    const { organization } = this.props;
    const { dealerId = "", subDealerId = "" } = organization;
    return (
      <>
        {this.state.isLoading && <LoadingMask />}
        <div ref={(ref) => (this.el = ref)}>
          <SlidingModal isOpen={this.props.isPaneOpen} width="50%">
            <div className="organizations-modal">
              <div className="modal-header">
                <h2 className="modal-title">Edit Rapid Response Partner</h2>
                <i
                  className="sf-icon i-modal-close"
                  onClick={this.props.onClose}
                />
              </div>
              <div className="modal-body">
                <OrganizationForm
                  initialValues={{
                    name: organization.name,
                    address: organization.address,
                    contact: organization.contact,
                    email: organization.email,
                    zoom: organization.zoom,
                    lat: organization.coordinates[0],
                    lng: organization.coordinates[1],
                    logo: organization.logo,
                    person: organization.person,
                    country: organization.country,
                    city: organization.city,
                    dealerId,
                    subDealerId,
                    videoFeed: organization.videoFeed,
                    delayTime: organization.delayTime,
                    responseUnitAutoAssignment: organization.responseUnitAutoAssignment,
                    serviceUpTime: organization.slas && organization.slas.serviceUpTime ? organization.slas.serviceUpTime : 95,
                    verificationTime: organization.slas && organization.slas.verificationTime,
                    acknowledgmentTime: organization.slas && organization.slas.acknowledgmentTime,
                    responseUnitAssignmentTime: organization.slas && organization.slas.responseUnitAssignmentTime,
                    // responseUnitAcknowledgmentTime: organization.slas && organization.slas.responseUnitAcknowledgmentTime,
                    responseUnitArrivalTime: (organization.slas && organization.slas.responseUnitArrivalTime !== 60 ? (organization.slas.responseUnitArrivalTime / 60) : 15),
                    customerSatisfaction: organization.slas && organization.slas.customerSatisfaction ? organization.slas.customerSatisfaction : 95,
                    parent: organization.parent && organization.parent,
                    isParent: organization.parent !== undefined ? false : true,
                    localAuthoritiesEngagementTime: organization.slas && organization.slas.localAuthoritiesEngagementTime,
                    intimatingLocalAuthoritiesEngagementTime: organization.slas && organization.slas.intimatingLocalAuthoritiesEngagementTime,
                    intelliconAgents: organization.intelliconAgents

                  }}
                  onSubmit={this.handleFormSubmit}
                  type="edit"
                  submitBtnText="Update"
                  center={this.state.center}
                  zoom={this.state.zoom}
                  onMapCenterChange={this.handleCenterChange}
                  onMapLoad={this.handleMapOnLoad}
                  onCancel={this.props.onClose}
                  orgId={this.props.organization._id}
                />
              </div>
            </div>
          </SlidingModal>
        </div>
      </>
    );
  }
}

export default EditOrganization;
