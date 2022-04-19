import React, { useState } from "react";
import { useDispatch } from "react-redux";
import LoginForm from "./loginForm";
import BrandMessage from "../../assets/images/login-brand-message.png";
import { LoadingMask } from "../../components/loadingMask";
import { login } from "../../api";
import "./login.css";
import { setCurrentUser } from "../../actions/appActions";

const Login = (props) => {
  const [isLoading, setIsloading] = useState(false);
  let dispatch = useDispatch();
  const handleFormSubmit = (values, { setSubmitting, setStatus }) => {
    // clear the previous errors in the form
    setStatus({});
    setIsloading(true);
    login({ email: values.email, password: values.password })
      .then(({ data }) => {
        setStatus({});
        // Remove any previously stored token.
        localStorage.removeItem("token");
        if (data.success) {
          // Store token          
          localStorage.setItem("token", data.data.token);
          setIsloading(false);
          dispatch(setCurrentUser(data.data.user));
          //this.props.navigate("/");
        } else {
          setIsloading(false);
          setStatus({ apiError: data.message });
        }
      })
      .catch(e => {
        // we can create a map for the error types and display appropriate error, currently its generic.
        const apiError =
          e.response && e.response.data && e.response.data.message
            ? e.response.data.message
            : e.message;
        setStatus({ apiError });
        setSubmitting(false);
        setIsloading(false);
      });
  };
  const handleForgotPassword = () => {
    props.navigate("/reset-password");
  };


  return (
    <div className="login-container">
      {isLoading && <LoadingMask />}
      <img
        className="login-logo"
        src="/assets/images/app-logo@2x.png"
        alt=""
      />
      <div className="login-form-view-container">
        <div className="login-form">
          <h2 className="l-title">Welcome to Settings</h2>
          <h2 className="l-s-title">Sign into your account to start</h2>
          <LoginForm onSubmit={handleFormSubmit} />
          <span onClick={handleForgotPassword} className="t-trbl">
            Having trouble signing in?
            </span>
        </div>
        <div className="login-brand-message">
          <img src={BrandMessage} alt="" />
        </div>
      </div>
    </div>
  );
}
export default Login;