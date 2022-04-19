import React, { Component } from "react";
import Modal from "react-modal";
import SlidingModal from "../ReactSlideModal";
import Spinner from "../../assets/images/spinner.gif";
import "./viewOrganization.css";
import { DetailItem } from "../viewOrganizationDetailItem";

export default class ViewOrganization extends Component {
  componentDidMount() {
    Modal.setAppElement(this.el);
  }

  render() {
    const { organization } = this.props;
    return (
      <>
        <div ref={ref => (this.el = ref)}>
          <SlidingModal isOpen={this.props.isPaneOpen} width="50%">
            <div className="organizations-modal">
              <div className="modal-header">
                <img
                  style={{
                    width: "80px",
                    height: "80px",
                    border: "2px solid #58BDFF",
                    borderRadius: "10px",
                    marginRight: "20px",
                    backgroundImage: `url(${Spinner})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "28px"
                  }}
                  src={organization.logo}
                  alt=""
                />
                <h2 style={{ flex: 1 }} className="modal-title">
                  {organization.name}
                </h2>
                <img
                  onClick={this.props.onClose}
                  src={"/assets/icons/icon-modal-close.png"}
                  alt="Close"
                  style={{ width: "24px", cursor: "pointer" }}
                />
              </div>
              <div className="modal-body">
                <h2
                  style={{
                    fontSize: 24,
                    color: "#2c2e2f",
                    width: "100%",
                    borderBottom: "2px solid #2c2e2f",
                    marginTop: "50px",
                    paddingBottom: "10px"
                  }}
                  className="details-heading"
                >
                  Details
                </h2>

                <div className="organization-details-container">
                  <DetailItem heading="Name" value={organization.name} />
                  <DetailItem heading="Email" value={organization.email} />
                  <DetailItem
                    heading="Contact Person"
                    value={organization.person}
                  />
                  <DetailItem
                    heading="Phone Number"
                    value={organization.contact}
                  />
                  <DetailItem heading="Address" value={organization.address} />
                  <DetailItem heading="Country" value={organization.country} />
                  <DetailItem heading="City" value={organization.city} />
                  <DetailItem
                    heading="Latitude"
                    value={organization.coordinates[0]}
                  />
                  <DetailItem
                    heading="Longitude"
                    value={organization.coordinates[1]}
                  />
                </div>
                <button
                  style={{ minWidth: "135px" }}
                  className="btn-form-action primary-btn"
                  type="button"
                  onClick={() => this.props.onEditBtnClick(organization)}
                >
                  Edit
                </button>
              </div>
            </div>
          </SlidingModal>
        </div>
      </>
    );
  }
}
