import React, { useState, useRef, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import classNames from "classnames";
import AddOrganizationUser from "../../../components/addOrganizationUser/addOrganizationUser";
import EditOrganizationUser, {
  userRolesMap
} from "../../../components/editOrganizationUser/editOrganizationUser";
import ViewOrganizationUser from "../../../components/viewOrganizationUser/viewOrganizationUser";
import {
  fetchOrganizationUsers,
  fetchAllUsers
} from "../../../actions/adminActions";
import { LoadingMask } from "../../../components/loadingMask";
import {
  deleteOrganizationUser,
  updateOrganizationUserStatus,
  fetchUserCount
} from "../../../api";
import { appRoles } from "../../../assets/roles";
import { Header } from "../../../components/adminHeader";

import "./users.css";
import { success } from "../../../components/toast";
import { USER_DELETE_SUCCESS } from "../../../constants/messages";
import {
  ACCOUNT_MANAGEMENT_ACTIVATE_USER,
  ACCOUNT_MANAGEMENT_DELETE_USER
} from "../../../constants/amplitude";
import { logAmplitudeEvent } from "../../../api";
import UserDataTable from "./userDataTable";
import { nameColumnFormatter } from "../../../utils/commonUtil";
import { USERS_COULUMNS } from "../../../constants/tableColumns";
import { confirmationAlert } from "../../../components/confirmationAlert";


const Users = (props) => {

  const USER_DEFAULT = {
    first_name: "",
    last_name: "",
    password: "",
    role: [],
    email: "",
    contact: "",
    address: "",
    organization: {
      _id: null
    }
  };

  //states for this components
  const [isLoading, setIsLoading] = useState(false);
  const [editPaneOpen, setEditPaneOpen] = useState(false);
  const [viewPaneOpen, setViewPaneOpen] = useState(false);
  const [user, setUser] = useState(USER_DEFAULT);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [count, setCount] = useState({ all: 0, active: 0, inactive: 0 });

  //refs for this components
  let allUsersRef = useRef();
  let activeUsersRef = useRef();
  let inactiveUsersRef = useRef();

  //
  const dispatch = useDispatch();
  let { orgUsers } = useSelector(state => state);
  let userRedux = useSelector(state => state.user);

  //useEffect for lifecycle
  useEffect(() => {
    updateCount();

  }, []);

  //function for api calling
  const updateCount = () => {
    setIsLoading(true);
    fetchUserCount()
      .then(({ data }) => {
        const { count } = data.data;
        count &&
          setCount({
            all: count.total,
            active: count.active,
            inactive: count.inactive
          });

      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  //use for refresh the user count
  const refreshUsers = () => {
    switch (activeTabIndex) {
      case 0:
        if (allUsersRef) {
          allUsersRef.current.fetchUsers();
          updateCount();
        }
        break;
      case 1:
        if (activeUsersRef) {
          activeUsersRef.current.fetchUsers();
          updateCount();
        }
        break;
      case 2:
        if (inactiveUsersRef) {
          inactiveUsersRef.current.fetchUsers();
          updateCount();
        }
        break;
      default:
        break;
    }
  };


  //function changing the status active or inactive
  const changeOrganizationUserStatus = (id, status, organizationId) => {
    setIsLoading(true);
    updateOrganizationUserStatus(organizationId, id, !status)
      .then(({ data }) => {
        if (data.success) {
          if (props.user.role.includes(appRoles.sa)) {
            let data = dispatch(fetchAllUsers);
            data && setIsLoading(false);
          } else {
            let data = dispatch(fetchOrganizationUsers(props.user.organization._id))
            data && setIsLoading(false);
          }
        }
        else {
          setIsLoading(false);
        }
      })
      .catch(e => {
        setIsLoading(false);
      });
  };

  //function to delte the organization user
  const handleDeleteOrganizationUser = (id, organizationId) => {
    setIsLoading(true);
    deleteOrganizationUser(organizationId, id)
      .then(({ data }) => {
        if (data.success) {
          logAmplitudeEvent({
            event_type: ACCOUNT_MANAGEMENT_DELETE_USER
          }).catch(() => { });
          setIsLoading(false);
          refreshUsers();
          success(USER_DELETE_SUCCESS);
        } else {
          setIsLoading(false);
        }
      })
      .catch(e => {
        setIsLoading(false);
      });
  };



  const handleEditOrganizationUserView = user => {
    setUser(user);
    setEditPaneOpen(true);
  };

  const handleEditOrganizationUserViewClose = () => {
    setEditPaneOpen(false);
    setUser(USER_DEFAULT);
  };

  const handleOrganizationUserViewOpen = (e, row, rowIndex) => {
    handleEditOrganizationUserBtnClick(row);
  };

  const handleOrganizationUserViewClose = () => {
    setViewPaneOpen(false);
    setUser(USER_DEFAULT);
  };

  const handleEditOrganizationUserBtnClick = user => {
    setViewPaneOpen(false);
    handleEditOrganizationUserView(user)
  };

  const handleTabBtnClick = e => {
    setActiveTabIndex(e.target.tabIndex)
    logAmplitudeEvent({
      event_type: ACCOUNT_MANAGEMENT_ACTIVATE_USER
    }).catch(() => { });
  };

  const actionFormatter = (cell, row) => {
    return (
      <div className="data-table-actions">
        <i
          onClick={e => {
            e.stopPropagation();
            handleEditOrganizationUserView(row);
          }}
          className="sf-icon i-edit-pencil"
          title="Edit User"
        />
        <i
          onClick={e => {
            e.stopPropagation();
            confirmationAlert({
              title: `You are about to delete this user`,
              message: `This action will permanently delete this user and all data associated with it.`,
              confirmMessage: "Are you sure you want to delete it?",
              confirmBtnText: "Yes",
              iconClass: "i-delete",
              onConfirm: () => {
                handleDeleteOrganizationUser(
                  row._id,
                  row.organization
                );
              }
            });
          }}
          className="sf-icon i-delete"
          title="Delete User"
        />
      </div>

    );
  }
  const rowEvents = {
    onClick: handleOrganizationUserViewOpen
  };

  let orgID = userRedux.organization !== undefined ? userRedux.organization._id : "ObjectId('5f212ab201d8480222a8e835')"
  //Here we assign the ORGANIZATIONS_COLUMNS into columns then find the length and assign the
  // action column into lastObject and the add formmater into  last Object
  // beacuse in this component the all of actions functions are declare so thats why we do it
  let columns = USERS_COULUMNS;
  let lastIndex = columns.length - 1;
  let lastObject = columns[lastIndex];
  lastObject.formatter = actionFormatter;

  return (
    <>
      {isLoading && <LoadingMask />}
      <EditOrganizationUser
        organizationId={
          userRedux.role.includes(appRoles.sa)
            ? "5f212ab201d8480222a8e835"
            : userRedux.organization._id
        }
        user={user}
        isPaneOpen={editPaneOpen}
        onClose={handleEditOrganizationUserViewClose}
        onSuccess={refreshUsers}
      />
      <ViewOrganizationUser
        user={user}
        isPaneOpen={viewPaneOpen}
        onEditBtnClick={handleEditOrganizationUserBtnClick}
        onClose={handleOrganizationUserViewClose}
      />
      <div className="organization-container">
        <Header title="Users" />
        <div className="panel-outer-container">
          <div className="panel-container panel-with-header pos-r">
            <div className="panel-header users-header">
              <div className="tabs-btn-container">
                <button
                  className={classNames("tab-btn", {
                    "active-tab": activeTabIndex === 0
                  })}
                  onClick={handleTabBtnClick}
                  tabIndex={0}
                >
                  All<span className="count">{count.all}</span>
                </button>
                <button
                  onClick={handleTabBtnClick}
                  tabIndex={1}
                  className={classNames("tab-btn", {
                    "active-tab": activeTabIndex === 1
                  })}
                >
                  Active Users
                    <span className="count">{count.active}</span>
                </button>
                <button
                  onClick={handleTabBtnClick}
                  tabIndex={2}
                  className={classNames("tab-btn", {
                    "active-tab": activeTabIndex === 2
                  })}
                >
                  Inactive Users
                    <span className="count">{count.inactive}</span>
                </button>
              </div>

              <div className="header-actions">

                {userRedux.permissions.addUser && (

                  < AddOrganizationUser
                    organizationId={orgID}
                    onSuccess={refreshUsers}
                  />

                )}
              </div>
            </div>
            <div className="panel-body">
              <div className="data-table-container">
                {activeTabIndex === 0 && (
                  <UserDataTable
                    columns={USERS_COULUMNS}
                    rowEvents={rowEvents}
                    updateCount={updateCount}
                    ref={allUsersRef}
                  />
                )}
                {activeTabIndex === 1 && (
                  <UserDataTable
                    columns={USERS_COULUMNS}
                    rowEvents={rowEvents}
                    updateCount={updateCount}
                    ref={activeUsersRef}
                    active={true}
                  />
                )}
                {activeTabIndex === 2 && (
                  <UserDataTable
                    columns={USERS_COULUMNS}
                    rowEvents={rowEvents}
                    updateCount={updateCount}
                    ref={inactiveUsersRef}
                    active={false}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Users;