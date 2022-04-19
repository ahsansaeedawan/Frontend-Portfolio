import React, { useContext } from "react";
import { Router, Redirect } from "@reach/router";
import { appRoles } from "../assets/roles";
import { Organizations } from "../views/admin/organizations";
import { Users } from "../views/admin/users";
import { Insights } from "../views/admin/insights";
import { UserContext } from "../context";
import { canAccessRoute } from "../utils/commonUtil";
import { History } from "../views/admin/history";
import { Setting } from "../views/admin/setting";
import { PageNotFound } from "../views/404";

const redirectMap = {
  [appRoles.sa]: "/admin/organizations",
  [appRoles.oa]: "/admin/users",
  [appRoles.madmin]: "/admin/users",
  [appRoles.radmin]: "/admin/users",
  [appRoles.ra]: "/admin/setting",
  [appRoles.ma]: "/admin/setting",
};

const ProtectedRoute = ({ component: Component, roles, ...rest }) => {
  const user = useContext(UserContext);
  if (canAccessRoute(user.role, roles)) {
    return <Component {...rest} />;
  } else {
    return <Redirect from="" to="/admin" noThrow />;
  }
};

export const AdminRouter = () => {
  const user = useContext(UserContext);
  return (
    <Router>
      <Redirect from="/" to={redirectMap[user.role[0]]} noThrow />
      <ProtectedRoute
        roles={[appRoles.sa]}
        component={Organizations}
        path="organizations"
      />
      <ProtectedRoute
        roles={[appRoles.sa, appRoles.oa, appRoles.radmin, appRoles.madmin]}
        component={Users}
        path="users"
      />

      <ProtectedRoute
        roles={[appRoles.madmin, appRoles.radmin]}
        component={History}
        path="history"
      />
      <ProtectedRoute
        roles={[appRoles.madmin, appRoles.radmin]}
        component={Insights}
        path="insights"
      />
      <ProtectedRoute
        roles={[
          appRoles.madmin,
          appRoles.radmin,
          appRoles.ma,
          appRoles.ra,
          appRoles.sa,
          appRoles.oa,
        ]}
        component={Setting}
        path="setting"
      />
      <PageNotFound path="*" />
    </Router>
  );
};
