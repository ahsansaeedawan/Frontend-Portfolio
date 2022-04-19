import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import AddOrganization from "../../../components/addOrganization/addOrganization";
import EditOrganization from "../../../components/editOrganization/editOrganization";
import ViewOrganization from "../../../components/viewOrganization/viewOrganization";
import { LoadingMask } from "../../../components/loadingMask";
import { confirmationAlert } from "../../../components/confirmationAlert";
import "./organizations.css";
import {
  deleteOrganization,
  updateOrganizationStatus,
  fetchOrganizationsCount
} from "../../../api";
import { Header } from "../../../components/adminHeader";
import OrganizationsDataTable from "./organizationsDataTable";
import { alertIconMap } from "../users/userDataTable";
import { success } from "../../../components/toast";
import {
  ORG_DELETED_SUCCESS,
  ORGANIZATION_DEACTIVE_STATUS,
  ORGANIZATION_ACTIVE_STATUS
} from "../../../constants/messages";
import { ORGANIZATIONS_COLUMNS } from "../../../constants/tableColumns";
import { useSelector } from "react-redux";



const Organizations = () => {


  const ORGANIZATION_DEFAULT = {
    name: "",
    contact: "",
    email: "",
    zoom: "",
    coordinates: ["0", "0"],
    address: "",
    logo: null
  };

  //states for this components

  const [isLoading, setIsLoading] = useState(false);
  const [editPaneOpen, setEditPaneOpen] = useState(false);
  const [viewPaneOpen, setViewPaneOpen] = useState(false);
  const [organization, setOrganizaton] = useState(ORGANIZATION_DEFAULT);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [count, setCount] = useState({ all: 0, active: 0, inactive: 0 });

  //refs for this components
  let allOrgRef = useRef();
  let activeOrgRef = useRef();
  let inactiveOrgRef = useRef();


  //useEffect for lifecycle
  useEffect(() => {
    updateCount();

  }, []);

  const reduxOrganization = useSelector(state => state.organizations);

  //function for api calling
  const updateCount = () => {
    setIsLoading(true);
    fetchOrganizationsCount()
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

  const refreshOrganizations = () => {
    switch (activeTabIndex) {
      case 0:
        if (allOrgRef) {

          allOrgRef.current.fetchOrganizations();
          updateCount();
        }
        break;
      case 1:
        if (activeOrgRef) {
          activeOrgRef.current.fetchOrganizations();
          updateCount();
        }
        break;
      case 2:
        if (inactiveOrgRef) {
          inactiveOrgRef.current.fetchOrganizations();
          updateCount();
        }
        break;
      default:
        break;
    }
  };

  const handleTabBtnClick = e => {
    setActiveTabIndex(e.target.tabIndex);
  };

  const changeOrganizationStatus = (id, status) => {
    setIsLoading(true);
    updateOrganizationStatus(id, !status)
      .then(({ data }) => {
        if (data.success) {
          setIsLoading(false);
          refreshOrganizations();
          success(
            status ? ORGANIZATION_DEACTIVE_STATUS : ORGANIZATION_ACTIVE_STATUS
          );
        } else {
          setIsLoading(false);
        }
      })
      .catch(e => {
        setIsLoading(false);
        console.log(e);
      });
  };

  const handleDeleteOrganization = id => {

    setIsLoading(true);
    deleteOrganization(id)
      .then(({ data }) => {
        if (data.success) {
          setIsLoading(false);
          refreshOrganizations();
          success(ORG_DELETED_SUCCESS);
        } else {
          setIsLoading(false);
        }
      })
      .catch(e => {
        setIsLoading(false);
      });
  };
  const handleEditOrganizationView = organization => {
    setOrganizaton(organization);
    setEditPaneOpen(true);
  };

  const handleEditOrganizationViewClose = () => {
    setEditPaneOpen(false);
    setOrganizaton(ORGANIZATION_DEFAULT);
  };

  const handleOrganizationViewOpen = (e, row, rowIndex) => {
    handleEditOrganizationBtnClick(row);
  };

  const handleOrganizationViewClose = () => {
    setViewPaneOpen(false);
    setOrganizaton(ORGANIZATION_DEFAULT);
  };

  const handleEditOrganizationBtnClick = organization => {
    setViewPaneOpen(false);
    handleEditOrganizationView(organization);
  };

  const actionFormatter = (cell, row) => {
    return (
      <div className="data-table-actions">
        <i
          title={
            row.active
              ? "Deactivate Rapid Response Partner"
              : "Activate Rapid Response Partner"
          }
          onClick={e => {
            e.stopPropagation();
            confirmationAlert({
              title: `You are about to ${
                row.active ? "deactivate" : "activate"
                } this Rapid Response Partner`,
              message: `This action will ${
                row.active ? "deactivate" : "activate"
                } your Rapid Response Partner and all users associated with this Rapid Response Partner.`,
              confirmMessage: `Are you sure you want to ${
                row.active ? "deactivate" : "activate"
                } it?`,
              confirmBtnText: "Yes",
              cancelBtnText: "No",
              iconClass:
                alertIconMap[row.active ? "deactivate" : "activate"],
              onConfirm: () => {
                changeOrganizationStatus(row._id, row.active);
              }
            });
          }}
          className={`sf-icon ${
            row.active ? "i-deactivate-user" : "i-activate-user"
            }`}
        ></i>
        <i
          title="Delete Rapid Response Partner"
          onClick={e => {
            e.stopPropagation();
            confirmationAlert({
              title: `You are about to delete this Rapid Response Partner`,
              message: `This action will permanently delete your Rapid Response Partner and all users associated with this Rapid Response Partner.`,
              confirmMessage: `Are you sure you want to delete it?`,
              confirmBtnText: "Yes",
              cancelBtnText: "No",
              iconClass: "i-delete",
              onConfirm: () => {
                handleDeleteOrganization(row._id);
              }
            });
          }}
          className="sf-icon i-delete"
        ></i>
        <i
          onClick={e => {
            e.stopPropagation();
            handleEditOrganizationView(row);
          }}
          title="Edit Rapid Response Partner"
          className="sf-icon i-edit-pencil"
        ></i>
      </div>
    );
  }

  const rowEvents = {
    onClick: handleOrganizationViewOpen
  };
  //Here we assign the ORGANIZATIONS_COLUMNS into columns then find the length and assign the
  // action column into lastObject and the add formmater into  last Object
  // beacuse in this component the all of actions functions are declare so thats why we do it
  let columns = ORGANIZATIONS_COLUMNS;
  let lastIndex = columns.length - 1;
  let lastObject = columns[lastIndex];
  lastObject.formatter = actionFormatter;

  return (
    <>
      {isLoading && <LoadingMask />}
      <EditOrganization
        organization={organization}
        isPaneOpen={editPaneOpen}
        onClose={handleEditOrganizationViewClose}
        onSuccess={refreshOrganizations}
      />
      <ViewOrganization
        organization={organization}
        isPaneOpen={viewPaneOpen}
        onEditBtnClick={handleEditOrganizationBtnClick}
        onClose={handleOrganizationViewClose}
      />
      <div className="organization-container">
        <Header title="Rapid Response Partner" />
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
                  Active Rapid Response Partner
                    <span className="count">{count.active}</span>
                </button>
                <button
                  onClick={handleTabBtnClick}
                  tabIndex={2}
                  className={classNames("tab-btn", {
                    "active-tab": activeTabIndex === 2
                  })}
                >
                  Inactive Rapid Response Partner
                    <span className="count">{
                    count.inactive}</span>
                </button>
              </div>
              <div className="header-actions">
                <AddOrganization onSuccess={refreshOrganizations} />
              </div>
            </div>
            <div className="panel-body">
              <div className="data-table-container">
                {
                  activeTabIndex === 0 && (
                    <OrganizationsDataTable
                      columns={columns}
                      rowEvents={rowEvents}
                      updateCount={updateCount}
                      ref={allOrgRef}
                    />
                  )}
                {
                  activeTabIndex === 1 && (
                    <OrganizationsDataTable
                      columns={columns}
                      rowEvents={rowEvents}
                      updateCount={updateCount}
                      ref={activeOrgRef}
                      active
                    />
                  )}
                {activeTabIndex === 2 && (
                  <OrganizationsDataTable
                    columns={columns}
                    rowEvents={rowEvents}
                    updateCount={updateCount}
                    ref={inactiveOrgRef}
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

export default Organizations;