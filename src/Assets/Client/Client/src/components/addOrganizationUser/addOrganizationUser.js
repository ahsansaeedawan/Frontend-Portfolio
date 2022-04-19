import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import SlidingModal from "../ReactSlideModal";
import { LoadingMask } from "../loadingMask";
import { addOrganizationUser, logAmplitudeEvent } from "../../api";
import { fetchOrganizationUsers } from "../../actions/adminActions";
import { multiSelectOptions, parentMultiSelectOptions } from "../../utils/userHelpers";
import { UserContext } from "../../context";
import { success } from "../../components/toast";
import { USER_CREATED_SUCCESS } from "../../constants/messages";
import OrganizationUserForm from "../organizationUserForm/organizationUserForm";
import { USER_FORM_INITIAL_VALUES } from "../../constants/formInitialValues";
import { ACCOUNT_MANAGEMNT_ADD_USER } from "../../constants/amplitude";
import { appRoles } from "../../assets/roles";

class AddOrganizationUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isPaneOpen: false,
      options: []
    };
  }

  static contextType = UserContext;

  componentWillMount() {
    const options = this.multiSelectOptions();
    this.setState({ options });
  }

  componentDidMount() {
    Modal.setAppElement(this.el);
  }

  handleFormSubmit = (values, { setSubmitting, setStatus, resetForm }) => {
    // clear the previous errors in the form
    let role = values["role"].some((e) => (
      e.value !== "RESPONSE_UNIT"
    ));

    setStatus({});
    this.setState({ isLoading: true });
    const formData = new FormData();
    formData.set("first_name", values.first_name);
    formData.set("last_name", values.last_name);
    // formData.set("voip_username", values.voip_username); remove voip input field
    formData.set("email", values.email);
    formData.set("contact", values.contact);
    formData.set("password", values.emailPassword ? "" : values.password);
    formData.set("emailPassword", values.emailPassword);
    if (role) {
      formData.set("intelliconAgent", JSON.stringify(values.intelliconAgents[0]));
    }
    else {
      formData.set("intelliconAgent", JSON.stringify( {username: null , password: null}));
    }

    values.role.forEach(r => {
      formData.append("role[]", r.value);
    });
    formData.append("avatar", values.avatar);
    if (values.organization !== "0") formData.set("organization", values.organization);


    addOrganizationUser(this.props.organizationId, formData)
      .then(({ data }) => {
        setStatus({});

        if (data.success) {
          resetForm(USER_FORM_INITIAL_VALUES);
          this.setState(
            { isPaneOpen: false, isLoading: false },
            this.props.onSuccess
          );
          logAmplitudeEvent({
            event_type: ACCOUNT_MANAGEMNT_ADD_USER
          }).catch(() => { });
          success(USER_CREATED_SUCCESS);
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

  render() {
    return (
      <>
        {this.state.isLoading && <LoadingMask />}
        <div ref={ref => (this.el = ref)}>
          <button
            onClick={() => this.setState({ isPaneOpen: true })}
            className="btn-add-item"
            title="Add User"
          >
            <i className="sf-icon i-add-user" />
          </button>
          <SlidingModal isOpen={this.state.isPaneOpen} width="50%">
            <div className="users-modal">
              <div className="modal-header">
                <h2 className="modal-title">Add User</h2>

                <i
                  className="sf-icon i-modal-close"
                  onClick={() => this.setState({ isPaneOpen: false })}
                />
              </div>
              <div className="modal-body">
                <OrganizationUserForm
                  initialValues={USER_FORM_INITIAL_VALUES}
                  onCancel={() => this.setState({ isPaneOpen: false })}
                  onSubmit={this.handleFormSubmit}
                  options={this.state.options}
                  submitBtnText="Add"
                  type="add"
                />
              </div>
            </div>
          </SlidingModal>
        </div>
      </>
    );
  }
}

export default connect(null, { fetchOrganizationUsers })(AddOrganizationUser);
