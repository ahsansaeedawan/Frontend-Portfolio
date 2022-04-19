import React, { Component } from "react";
import Modal from "react-modal";
import SlidingModal from "../ReactSlideModal";
import "./viewOrganizationUser.css";
import { DetailItem } from "../viewOrganizationDetailItem";

export default class ViewOrganizationUser extends Component {
  componentDidMount() {
    Modal.setAppElement(this.el);
  }

  render() {
    const { user } = this.props;
    return (
      <>
        <div ref={ref => (this.el = ref)}>
          <SlidingModal isOpen={this.props.isPaneOpen} width="50%">
            <div className="organizations-modal">
              <div className="modal-header">
                <h2 style={{ flex: 1 }} className="modal-title">
                  {`${user.first_name} ${user.last_name}`}
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
                  <DetailItem heading="First Name" value={user.first_name} />
                  <DetailItem heading="Last Name" value={user.last_name} />
                  <DetailItem heading="Email" value={user.email} />
                  <DetailItem heading="Contact" value={user.contact} />
                  <DetailItem heading="Role" value={user.role.join(", ")} />
                </div>
                <button
                  style={{ minWidth: "135px" }}
                  className="btn-form-action primary-btn"
                  type="button"
                  onClick={() => this.props.onEditBtnClick(user)}
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
