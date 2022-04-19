import React, { Component } from "react";
import ResetPasswordForm from "./resetPasswordForm";
import BrandMessage from "../../assets/images/login-brand-message.png";
import ChangePasswordForm from "./changePassword";
import SweetAlert from "react-bootstrap-sweetalert";
import { LoadingMask } from "../../components/loadingMask";
import { createPassword, forgotPassword } from "../../api";
import "./resetPassword.css";

function PasswordConfirmationAlert({ isVisible, onConfirm }) {
  return isVisible ? (
    <div className="bs4-wrapper">
      <SweetAlert
        success
        custom
        confirmBtnText="Login"
        confirmBtnBsStyle="primary"
        onConfirm={onConfirm}
      >
        Your password has been changed successfully!
      </SweetAlert>
    </div>
  ) : null;
}

function PasswordChanged({ onClick }) {
  return (
    <div className="pr-thank-u">
      <h2 className="l-title">Thank You!</h2>
      <p className="message">
        Your Password has been changed, you can now login with your new
        password.
      </p>
      <button onClick={onClick} className="login-form-submit-btn btn-thank-u">
        Login
      </button>
    </div>
  );
}

function EmailVerificationMessage({ onClick }) {
  return (
    <>
      <h2 className="l-title">E-mail Verification</h2>
      <p className="email-v-msg">
        A verification email has been sent to your account please check your
        email to reset your password.
      </p>

      <button onClick={onClick} className="login-form-submit-btn btn-thank-u">
        Login
      </button>
    </>
  );
}

class ResetPassword extends Component {
  
  constructor(props){
    super(props);
    this.state = {
      displayLoading: false,
      emailSent: false,
      changePassword: false,
      passwordChanged: false,
      showAlert: false
    };
  }

  componentWillMount() {
    if (this.props.hash) {
      this.setState({
        changePassword: true
      });
    }
  }

  handleFormSubmit = (values, { setSubmitting, setStatus }) => {
    // clear the previous errors in the form
    setStatus({});
    this.setState({ displayLoading: true });
    forgotPassword({ email: values.email })
      .then(() => {
        this.setState({ emailSent: true });
      })
      .catch(e => {
        const apiError =
          e.response && e.response.data && e.response.data.errors
            ? e.response.data.errors
            : new Array({ message: e.message });
        setStatus({ apiError: apiError || [] });
        this.setState({ displayLoading: false });
      })
      .finally(() => {
        setSubmitting(false);
        this.setState({ displayLoading: false });
      });
  };

  handleRedirectToLogin = () => {
    this.props.navigate("/login");
  };

  handlePasswordReset = (values, { setSubmitting, setStatus }) => {
    setStatus({});
    this.setState({ displayLoading: true });
    createPassword({ password: values.password, token: this.props.hash })
      .then(() => {
        this.setState({ displayLoading: false, showAlert: true });
      })
      .catch(e => {
        const apiError =
          e.response && e.response.data && e.response.data.errors
            ? e.response.data.errors
            : new Array({ message: e.message });
        setStatus({ apiError: apiError || [] });
        this.setState({ displayLoading: false });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  render() {
    return (
      <div className="login-container">
        {this.state.displayLoading && <LoadingMask />}
        <PasswordConfirmationAlert
          isVisible={this.state.showAlert}
          onConfirm={this.handleRedirectToLogin}
        />
        <img
          className="login-logo"
          src="/assets/images/app-logo@2x.png"
          alt=""
        />
        <div className="login-form-view-container">
          <div className="login-form reset-password-form-container">
            {this.state.emailSent && (
              <EmailVerificationMessage onClick={this.handleRedirectToLogin} />
            )}
            {!this.state.emailSent &&
              !this.state.changePassword &&
              !this.state.passwordChanged && (
                <>
                  <h2 className="l-title">Reset Password</h2>
                  <h2 className="l-s-title">
                    To reset your password enter your email.
                  </h2>
                  <ResetPasswordForm onSubmit={this.handleFormSubmit} />
                </>
              )}
            {!this.state.passwordChanged && this.state.changePassword && (
              <>
                <h2 className="l-title">Create your new Password</h2>
                <h2 className="l-s-title">Enter your new password below.</h2>
                <ChangePasswordForm onSubmit={this.handlePasswordReset} />
              </>
            )}
            {this.state.passwordChanged && (
              <PasswordChanged onClick={this.handleRedirectToLogin} />
            )}
          </div>
          <div className="login-brand-message">
            <img src={BrandMessage} alt="" />
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
