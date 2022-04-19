import React, { useContext } from "react";
import { Router, Redirect } from "@reach/router";
import { Login as LoginView } from "../views/login";
import { ResetPassword as ResetPasswordView } from "../views/resetPassword";
import { PageNotFound } from "../views/404";
import { Dashboard } from "../views/dashboard";
import AdminDashboard from "../views/admin/adminDashboard";
import { UserContext } from "../context";
import { appRoles } from "../assets/roles";
import { canAccessRoute } from "../utils/commonUtil";

const AuthConsumer = ({ children }) => {
  const user = useContext(UserContext);
  return children({ user, isAuthenticated: user.role.length > 0 });
};

const ProtectedRoute = ({ component: Component, roles, ...rest }) => {
  return (
    <AuthConsumer>
      {({ user, isAuthenticated }) => {
        if (isAuthenticated) {
          if (!roles) {
            return <Component roles={user.role} {...rest} />;
          }
          if (canAccessRoute(user.role, roles)) {
            return <Component roles={user.role} {...rest} />;
          } else {
            return <Redirect from="" to="/" noThrow />;
          }
        } else {
          return <Redirect from="" to="/login" noThrow />;
        }
      }}
    </AuthConsumer>
  );
};

const Login = ({ component: Component, ...rest }) => (
  <AuthConsumer>
    {({ isAuthenticated }) =>
      isAuthenticated ? (
        <Redirect from="" to="/" noThrow />
      ) : (
        <Component {...rest} />
      )
    }
  </AuthConsumer>
);

export const AppRouter = () => {
  const user = useContext(UserContext);
  return (
    <Router>
      <ProtectedRoute
        path="/"
        component={
          user &&
          (user.role.includes(appRoles.sa) || user.role.includes(appRoles.oa))
            ? AdminDashboard
            : Dashboard
        }
      />
      <ProtectedRoute
        path="/dashboard"
        roles={[appRoles.ma, appRoles.madmin, appRoles.ra, appRoles.radmin]}
        component={Dashboard}
      />
      <Login component={LoginView} path="/login" />
      <Login component={ResetPasswordView} path="/reset-password" />
      <ResetPasswordView exact path="/reset-password/:hash" />
      <ProtectedRoute
        roles={[
          appRoles.sa,
          appRoles.oa,
          appRoles.madmin,
          appRoles.radmin,
          appRoles.ma,
          appRoles.ra
        ]}
        path="admin/*"
        component={AdminDashboard}
      />
      <PageNotFound path="*" />
    </Router>
  );
};
