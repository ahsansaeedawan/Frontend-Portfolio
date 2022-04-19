import React, { Component } from "react";
import Modal from "react-modal";
import SlidingModal from "../ReactSlideModal";
import { LoadingMask } from "../../components/loadingMask";
import { addOrganization } from "../../api/api";
import { success } from "../../components/toast";
import { ORG_CREATED_SUCCESS } from "../../constants/messages";
import { ORGANIZATION_FORM_INITIAL_VALUES } from "../../constants/formInitialValues";
import OrganizationForm from "../organizationForm/organizationForm";

class AddOrganization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isPaneOpen: false,
      center: { lat: 33.596041, lng: 73.005094 },
      zoom: 8,
    };
    this.autocomplete = null;
  }

  componentDidMount() {
    Modal.setAppElement(this.el);
  }

  onAutocompleteLoad = (autocomplete) => {
    this.autocomplete = autocomplete;
  };

  onPlaceChanged = () => {
    if (this.autocomplete !== null) {
      console.log(this.autocomplete.getPlace());
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

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
    console.log("Values.role", values.role);
    // clear the previous errors in the form
    let sipAgents = [];
    values.intelliconUsername.map((e, i) => (
      sipAgents.push({ username: values.intelliconUsername[i], password: values.intelliconPassword[i] })
    ));
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
    formData.set("dealerId", values.dealerId);//After 02 15 2021 realese dealer subdealer conecpt are 
    formData.set("subDealerId", values.subDealerId); //remove from our project so remove or comment these lines
    formData.set("zoom", values.zoom);
    formData.set("videoFeed", values.videoFeed);
    // formData.set("delayTime", values.delayTime);
    formData.set("serviceUpTime", values.serviceUpTime);
    formData.set("verificationTime", values.verificationTime);
    formData.set("acknowledgmentTime", values.acknowledgmentTime);
    formData.set("responseUnitAssignmentTime", values.responseUnitAssignmentTime); //Treat this value as a minutes and convert minutes into seconds
    formData.set("responseUnitArrivalTime", (values.responseUnitArrivalTime * 60));
    formData.set("customerSatisfaction", values.customerSatisfaction);
    formData.set("responseUnitAutoAssignment", values.responseUnitAutoAssignment);
    formData.append("intelliconAgents", JSON.stringify(sipAgents));
    formData.append("coordinates[]", values.lat);
    formData.append("coordinates[]", values.lng);
    formData.append("logo", values.logo);
    formData.append("localAuthoritiesEngagementTime", values.localAuthoritiesEngagementTime);
    formData.append("intimatingLocalAuthoritiesEngagementTime", values.intimatingLocalAuthoritiesEngagementTime);

    if (!parentValue) formData.set("parent", values.parent);




    addOrganization(formData)
      .then(({ data }) => {
        setStatus({});
        if (data.success) {
          this.setState({ isLoading: false, isPaneOpen: false });
          resetForm(ORGANIZATION_FORM_INITIAL_VALUES);
          this.props.onSuccess();
          success(ORG_CREATED_SUCCESS);
        } else {
          setStatus({ apiError: data.errors || [] });
          this.setState({ isLoading: false });
        }
      })
      .catch((e) => {
        const apiError =
          e.response && e.response.data && e.response.data.errors
            ? e.response.data.errors
            : [{ message: e.message }];
        setStatus({ apiError: apiError || [] });
        this.setState({ isLoading: false });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  render() {
    return (
      <>
        {this.state.isLoading && <LoadingMask />}
        <div ref={(ref) => (this.el = ref)}>
          <button
            onClick={() => this.setState({ isPaneOpen: true })}
            className="btn-add-item"
            title="Add Rapid Response Partner"
          >
            <i className="sf-icon i-add-organization" />
          </button>
          <SlidingModal isOpen={this.state.isPaneOpen} width="50%">
            <div className="organizations-modal">
              <div className="modal-header">
                <h2 className="modal-title">Add Rapid Response Partner</h2>
                <i
                  className="sf-icon i-modal-close"
                  onClick={() => this.setState({ isPaneOpen: false })}
                />


              </div>
              <div className="modal-body">
                <OrganizationForm
                  type="add"
                  submitBtnText="Add"
                  initialValues={ORGANIZATION_FORM_INITIAL_VALUES}
                  onSubmit={this.handleFormSubmit}
                  center={this.state.center}
                  zoom={this.state.zoom}
                  onAutoCompleteLoad={this.onAutocompleteLoad}
                  onPlaceChanged={this.onPlaceChanged}
                  onMapCenterChange={this.handleCenterChange}
                  onMapLoad={this.handleMapOnLoad}
                  onCancel={() => this.setState({ isPaneOpen: false })}
                />
              </div>
            </div>
          </SlidingModal>
        </div>
      </>
    );
  }
}

export default AddOrganization;
