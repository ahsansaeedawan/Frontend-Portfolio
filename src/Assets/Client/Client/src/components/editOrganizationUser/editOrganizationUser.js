import React, { Component } from "react";
import Modal from "react-modal";
import SlidingModal from "../ReactSlideModal";
import { LoadingMask } from "../loadingMask";
import { UserContext } from "../../context";
import { editOrganizationUser } from "../../api/";
import { multiSelectOptions, parentMultiSelectOptions } from "../../utils/userHelpers";
import { success } from "../../components/toast";
import { USER_UPDATE_SUCCESS } from "../../constants/messages";
import OrganizationUserForm from "../organizationUserForm/organizationUserForm";
import { logAmplitudeEvent } from "../../api";
import { ACCOUNT_MANAGEMENT_EDIT_USER } from "../../constants/amplitude";

export const userRolesMap = {
  MONITORING_ADMIN: {
    value: "MONITORING_ADMIN",
    label: "Monitoring Admin"
  },
  MONITORING_AGENT: {
    value: "MONITORING_AGENT",
    label: "Monitoring Agent"
  },

  RESPONSE_ADMIN: {
    value: "RESPONSE_ADMIN",
    label: "Response Admin"
  },
  RESPONSE_AGENT: {
    value: "RESPONSE_AGENT",
    label: "Response Agent"
  },
  RESPONSE_UNIT: {
    value: "RESPONSE_UNIT",
    label: "Rapid Responder"
  },
  ORGANIZATION_ADMIN: {
    value: "ORGANIZATION_ADMIN",
    label: "Organization Admin"
  }
};

class EditOrganizationUser extends Component {
  static contextType = UserContext;
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      options: []
    };
  }

  componentWillMount() {
    const options = this.multiSelectOptions();
    this.setState({ options });
  }

  multiSelectOptions = () => {
    const role =
      this.context && this.context.role && this.context.role.sort().join("_");
    if (this.context.organization && this.context.organization.parent && this.context.organization.parent !== undefined) {
      if (multiSelectOptions[role]) {
        return multiSelectOptions[role];
      }
    }
    else {
      if (parentMultiSelectOptions[role]) {
        return parentMultiSelectOptions[role];
      }
    }

    return [];
  };

  componentDidMount() {
    Modal.setAppElement(this.el);
  }

  handleFormSubmit = (values, { setSubmitting, setStatus, resetForm }) => {
    // clear the previous errors in the .form
    let role = values["role"].some((e) => (
      e.value !== "RESPONSE_UNIT"
    ));
    setStatus({});
    this.setState({ isLoading: true });
    const formData = new FormData();
    formData.set("first_name", values.first_name);
    formData.set("last_name", values.last_name);
    // formData.set("voip_username", values.voip_username);
    formData.set("email", values.email);
    formData.set("contact", values.contact);
    if (role) {
      formData.set("intelliconAgent", JSON.stringify(values.intelliconAgent));
    }
    else {
      formData.set("intelliconAgent", JSON.stringify({ username: null, password: null }));
    }
    values.role.forEach(r => {
      formData.append("role[]", r.value);
    });

    if (this.props.user.avatar !== values.avatar) {
      formData.append("avatar", values.avatar);
    }
    if (values.organization !== "0") formData.set("organization", values.organization);

    editOrganizationUser(
      this.props.organizationId,
      this.props.user._id,
      formData
    )
      .then(({ data }) => {
        logAmplitudeEvent({
          event_type: ACCOUNT_MANAGEMENT_EDIT_USER
        }).catch(() => { });
        setStatus({});
        if (data.success) {
          this.props.onClose();
          this.setState({ isLoading: false }, this.props.onSuccess);
          success(USER_UPDATE_SUCCESS);
        } else {
          setStatus({ apiError: data.errors || [] });
          this.setState({ isLoading: false });
        }
      })
      .catch(e => {
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
    const { user } = this.props;
    return (
      <>

        {this.state.isLoading && <LoadingMask />}
        <div ref={ref => (this.el = ref)}>
          <SlidingModal isOpen={this.props.isPaneOpen} width="50%">
            <div className="users-modal">
              <div className="modal-header">
                <h2 className="modal-title">Edit User</h2>
                <i
                  className="sf-icon i-modal-close"
                  onClick={this.props.onClose}
                />
              </div>
              <div className="modal-body">
                <OrganizationUserForm
                  type="edit"
                  initialValues={{
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    contact: user.contact,
                    address: user.address,
                    role: user.role.map(role => userRolesMap[role]),
                    avatar: user.avatar,
                    organization: user.organization,
                    intelliconAgent: user.intelliconAgent,
                    user: user
                  }}
                  onSubmit={this.handleFormSubmit}
                  onCancel={this.props.onClose}
                  submitBtnText={"Update"}
                  options={this.state.options}
                />
              </div>
            </div>
          </SlidingModal>
        </div>
      </>
    );
  }
}

export default EditOrganizationUser;
