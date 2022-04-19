import React, { useContext, useState } from "react";
import classNames from "classnames";
import { Link } from "@reach/router";
import { MenuSearch } from "../menuSearch";
import { GatewayList } from "../gatewayList";
import { CustomScroll } from "../customScroll";
import { UserSettings } from "../userSettings";
import { UserContext } from "../../context";
import { appRoles } from "../../assets/roles";
import { getIncidentTabs, vehicleTabs } from "../../constants/tabs";
import MenuSecondaryTabs from "../menuSecondaryTabs/menuSecondaryTabs";
import { VehicleList } from "../vehicleList";
import "./menu.css";
import { logAmplitudeEvent } from "../../api";
import {
  VEHICLES_VIEW_VEHICLES,
  INCIDENT_VIEW_INCIDENT,
} from "../../constants/amplitude";
import { ToggleSwitch } from "../toggleSwitch";
import { useSelector, useDispatch } from 'react-redux';
import { showAllGatewayOnMap } from "../../actions/dashboardActions";
import BoardName from "../userSettings/boardName";
function MenuTabs({ onClick }) {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const user = useContext(UserContext);

  function handleTabBtnClick(e) {
    if (e.target.tabIndex === activeTabIndex) return;
    setActiveTabIndex(e.target.tabIndex);
    onClick(e.target.tabIndex);
    logAmplitudeEvent({ event_type: e.target.title }).catch(() => { });
  }

  return (
    <div className="menu-tabs">
      <button
        className={classNames("menu-tab", {
          "active-tab": activeTabIndex === 0,
        })}
        tabIndex={0}
        onClick={handleTabBtnClick}
        title={INCIDENT_VIEW_INCIDENT}
      >
        <span>Incidents</span>
      </button>
      {user && user.permissions && user.permissions.vehicles && (
        <button
          onClick={handleTabBtnClick}
          className={classNames("menu-tab", {
            "active-tab": activeTabIndex === 1,
          })}
          tabIndex={1}
          title={VEHICLES_VIEW_VEHICLES}
        >
          <span>Vehicles</span>
        </button>
      )}
    </div>
  );
}

function MenuToggleButton({ open, onClick }) {
  return (
    <button
      className={classNames(
        "menu-toggle-btn",
        "animated",
        { fadeOutLeft: open },
        { fadeInLeft: !open },
      )}
      onClick={onClick}
    >
    </button>
  );
}

function MenuHeader({ onClick }) {
  const user = useContext(UserContext);
  return (
    <button className="menu-header" onClick={onClick}>
      <img
        src={user && user.organization
          ? user.organization.logo
          : "/assets/images/iylusWhite2.png"}
        alt=""
      />
    </button>
  );
}

function Menu({
  open,
  firstLoad,
  eventSearch,
  vehicleSearch,
  onTrigger,
  onEventSearchChange,
  onVehicleSearchChange,
  onTabChange,
  onVehicleTabChange,
  gateways,
  onGatewayDetail,
  selectedGateway,
  isGatewayDetailVisible,
  vehicles,
  assignOperationDisable
}) {
  const user = useContext(UserContext);
  // 0 = Incidents, 1 = Vehicles
  const [activeMenuTab, setActiveMenuTab] = useState(0);
  const [showToogle, setShowToogle] = useState(false);
  function handleMenuTabChange(index) {
    if (index === activeMenuTab) return;
    setActiveMenuTab(index);
    // Reset to Initial Filter
    // If Selected Tab is Incident
    if (index === 0) {
      onTabChange(
        getIncidentTabs(
          user.permissions.monitoring,
          user.permissions.response,
        )[0].status,
      );
    }

    // If Selected Tab is Vehicles
    if (index === 1) {
      onVehicleTabChange(vehicleTabs[0].status);
    }
  }

  function handleIncidentsTabChange(index) {
    onTabChange(
      getIncidentTabs(user.permissions.monitoring, user.permissions.response)[
        index
      ].status,
    );
  }

  function handleVehiclesTabChange(index) {
    //to be implemented when integrating vehicles section
    (index === 0 || index === 1) ? setShowToogle(false) : setShowToogle(true);
    onVehicleTabChange(vehicleTabs[index].status);
  }

  let dispatch = useDispatch();
  const { allGatewayOnMap } = useSelector(state => state.appSetting);
  const handleChangeStatus = () => {
    dispatch(showAllGatewayOnMap());
  }
  return (
    <>
      <MenuToggleButton open={open} onClick={onTrigger} />

      <div
        className={classNames(
          "menu",
          "animated",
          { "d-none": !firstLoad },
          { fadeOutLeft: !open },
          { fadeInLeft: open },
        )}
      >

        <div className="menu-container">
          <MenuHeader onClick={onTrigger} />
          <BoardName />

          <MenuTabs onClick={handleMenuTabChange} />

          {activeMenuTab === 0 && (
            <>
              <MenuSearch
                placeholder={"Search Events(Cnic)"}
                searchValue={eventSearch}
                onSearchChange={onEventSearchChange}
              />
              <div className="show-gateway-container">
                <ToggleSwitch
                  onChange={handleChangeStatus}
                  checked={allGatewayOnMap}
                  className="status-toggle"
                  label={"Show All Iylus Gateways"}
                />
              </div>

              <MenuSecondaryTabs onClick={handleIncidentsTabChange}>
                {(handleTabBtnClick, activeTabIndex) => {
                  return getIncidentTabs(
                    user.permissions.monitoring,
                    user.permissions.response,
                  ).map((tab, i) => (
                    <button
                      key={tab.id}
                      onClick={handleTabBtnClick}
                      tabIndex={i}
                      className={classNames("sub-tab", {
                        active: activeTabIndex === i,
                      })}
                    >
                      {tab.label}
                    </button>
                  ));
                }}
              </MenuSecondaryTabs>
              <CustomScroll
                autoHide
                autoHideTimeout={500}
                autoHideDuration={200}
                hideTracksWhenNotNeeded
              >
                <GatewayList
                  assignOperationDisable={assignOperationDisable}
                  gateways={gateways}
                  onGatewayDetail={onGatewayDetail}
                  selectedGateway={selectedGateway}
                  isGatewayDetailVisible={isGatewayDetailVisible}
                />
              </CustomScroll>
            </>
          )}

          {activeMenuTab === 1 && (
            <>
              <MenuSearch
                placeholder={"Search Vehicles"}
                searchValue={vehicleSearch}
                onSearchChange={onVehicleSearchChange}
              />
              <MenuSecondaryTabs onClick={handleVehiclesTabChange}>
                {(handleTabBtnClick, activeTabIndex) => {
                  return vehicleTabs.map((tab, i) => (
                    <button
                      key={tab.id}
                      onClick={handleTabBtnClick}
                      tabIndex={i}
                      className={classNames("sub-tab", {
                        active: activeTabIndex === i,
                      })}
                    >
                      {tab.label}
                    </button>
                  ));
                }}
              </MenuSecondaryTabs>
              <CustomScroll
                autoHide
                autoHideTimeout={500}
                autoHideDuration={200}
                hideTracksWhenNotNeeded
              >
                <VehicleList vehicles={vehicles} showToogle={showToogle} />
              </CustomScroll>
            </>
          )}

          <div>
            <ul className="menu-act-btns">
              {user &&
                (user.role.includes(appRoles.radmin) ||
                  user.role.includes(appRoles.madmin))
                ? (
                  <>
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={"/admin/history"}
                      >
                        <button className="menu-act-btn abs-sf-icon">
                          <i className="sf-icon i-user-history" />
                          <span className="m-btn-title">History</span>
                        </button>
                      </Link>
                    </li>
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={"/admin/insights"}
                      >
                        <button className="menu-act-btn abs-sf-icon">
                          <i className="sf-icon i-user-insight" />
                          <span className="m-btn-title">Insight</span>
                        </button>
                      </Link>
                    </li>
                  </>
                )
                : null}

              {(user &&
                (user.role.includes(appRoles.sa) ||
                  user.role.includes(appRoles.oa))) ||
                user.role.includes(appRoles.radmin) ||
                user.role.includes(appRoles.madmin)
                ? (
                  <>
                    <li>
                      <Link
                        style={{ textDecoration: "none" }}
                        to={"/admin/users"}
                      >
                        <button className="menu-act-btn abs-sf-icon">
                          <i className="sf-icon i-acc-mgmnt" />
                          <span className="m-btn-title">
                            Users
                            </span>
                        </button>
                      </Link>
                    </li>
                  </>
                )
                : null}
            </ul>
          </div>

          <div className="user-setting">
            <UserSettings />
          </div>
        </div>

      </div>
    </>
  );
}

export default Menu;
