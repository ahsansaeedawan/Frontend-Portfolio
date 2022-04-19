import React, {
    useState
} from 'react';
import { useSelector } from 'react-redux';
import ToggleSwitch from "../toggleSwitch/toggleSwitch";
import { CustomScroll } from "../customScroll";
import { LoadingMask } from "../loadingMask";
import "./notifications.css";
import { NotificationListItem } from "./notificationListItem";
import classNames from "classnames";
import "./notificationsList.css";

//FOr now we are not use this function
// const NotificationError = ({ error, onRetry }) => {
//   if (!error) return null;
//   return (
//     <p className="--notification-error">
//       Unable to load notifications
//       <span className="--a-retry" onClick={onRetry}>
//         Click here to retry.
//       </span>
//     </p>
//   );
// };


const LoadMoreNotifications = ({ onClick }) => {
    return (
        <button onClick={onClick} className="btn btn-mini-primary --btn-load-more">
            Load More
        </button>
    );
};


const NotificationsList = ({
    notifications = [],
    assignedNotifications,
    loading,
    total,
    onNotificationMinimize,
    onToggleAssignedNotifications,
    onLoadMore,
    onViewDetail,
}) => {
    //getting logged user's role 
    const notification = useSelector(state => state.notification);


    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const handleTabBtnClick = e => {
        setActiveTabIndex(e.target.tabIndex);
    };

    return (
        <div className="--notifications-list">
            {loading ? <LoadingMask /> : null}
            <CustomScroll
                autoHide
                autoHideTimeout={500}
                autoHideDuration={200}
                hideTracksWhenNotNeeded
            >
                <div className="--list-operation ">
                    <button className="--minimize" onClick={onNotificationMinimize} />
                    <ToggleSwitch
                        className="green"
                        checked={assignedNotifications}
                        onChange={onToggleAssignedNotifications}
                        label={"Show only my notifications"}
                    />
                    {/* <div className="tabs-btn-container">
                        <button
                            className={classNames("tab-btn", {
                                "active-tab": activeTabIndex === 0
                            })}
                            onClick={handleTabBtnClick}
                            tabIndex={0}
                        >

                            Incident Notifications

                       </button>
                        <button
                            className={classNames("tab-btn", {
                                "active-tab": activeTabIndex === 1
                            })}
                            onClick={handleTabBtnClick}
                            tabIndex={1}
                        >

                            SL Breaches Notifications
                     </button>
                    </div> */}
                    {/* for now this will be comment we will provide in second release */}

                </div>
                {activeTabIndex === 1 && (
                    <div>


                    </div>
                )}
                {activeTabIndex === 0 && (
                    <div className="--inner-list">
                        <div className="notification-action">

                            {/* <ToggleSwitch
                                className="green"
                                checked={assignedNotifications}
                                onChange={onToggleAssignedNotifications}
                                label={"High Priority"}
                            /> */}
                        </div>


                        {notifications.length > 0 && (
                            <ul className="--notifications">
                                {notifications.map((notification, i) => (
                                    <NotificationListItem
                                        key={`${notification.mac}-${i}-${notification.createdAt}`}
                                        notification={notification}
                                        onViewDetail={onViewDetail}
                                    />
                                ))}
                            </ul>
                        )}
                        {total && notifications.length < total ? (
                            <LoadMoreNotifications onClick={onLoadMore} />
                        ) : null}
                    </div>
                )}
            </CustomScroll>
        </div>
    );
};


export default NotificationsList;
