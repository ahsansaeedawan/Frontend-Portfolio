import React, {
  useReducer,
  useEffect,
  useState,
  useContext,
  useCallback,
} from "react";
import cn from "classnames";
import { SocketContext } from "../../context";
import { getNotifications } from "../../api";
import "./notifications.css";
import NotificationsList from "./notificationsList";
import NotificationBell from "./notificationBell";
import notificationReducer from "../../reducers/notificationReducer";
import { INITIAL_STATE } from "../../reducers/notificationReducer";
import {
  SET_NOTIFICATIONS,
  SET_METADATA,
  SET_ERROR,
} from "../../constants";



//funtion use to get data from api and save into redux notification store
const Notifications = ({ onViewDetail }) => {
  const socket = useContext(SocketContext);
  const [state, dispatch] = useReducer(notificationReducer, INITIAL_STATE);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [assignedNotifications, setAssignedNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const getNotificationsCallback = useCallback(() => {
    setLoading(true);
    setError(null);
    getNotifications({ assignedToMe: assignedNotifications })
      .then(({ data }) => {
        if (data.success) {
          dispatch({
            type: SET_NOTIFICATIONS,
            payload: { notifications: data.data.eventsRecord },
          });

          dispatch({
            type: SET_METADATA,
            payload: {
              metaData: data.data.metadata[0]
                ? data.data.metadata[0]
                : { total: null, page: "1" },
            },
          });
          setLoading(false);
        }
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
  }, [assignedNotifications]);

  // handle side-effects of notifications for socket
  useEffect(() => {
    // check if socket is loaded from context, attach the event listener/callback
    if (socket) {
      socket.on("eventOccured", getNotificationsCallback);
    }

    // cleanup function
    return () => {
      // check if socket is loaded from context, remove already attached event listener/callback to avoid attaching multiple listeners
      if (socket) {
        socket.off("eventOccured", getNotificationsCallback);
      }
    };
  }, [socket, getNotificationsCallback]);

  useEffect(() => {
    getNotificationsCallback();
  }, [getNotificationsCallback]);
  //Load notifications when the component render first time 

  function openNotifications() {
    setOpen(true);
  }

  function minimizeNotifications() {
    setOpen(false);
  }

  function toggleAssignedNotifications() {
    setAssignedNotifications((prevState) => !prevState);
  }

  function loadMoreNotifications() {
    const page = parseInt(state.metaData.page) + 1;
    setLoading(true);
    getNotifications({ page })
      .then(({ data }) => {
        if (data.success) {
          const notifications = state.notifications.concat(
            data.data.eventsRecord
          );
          dispatch({
            type: SET_NOTIFICATIONS,
            payload: { notifications },
          });

          dispatch({
            type: SET_METADATA,
            payload: { metaData: data.data.metadata[0] },
          });

          setLoading(false);
        }
      })
      .catch((e) => {
        dispatch({
          type: SET_ERROR,
        });
        setLoading(false);
      });
  }

  return (
    <div className={cn("notifications-container", { "--open": open })}>
      <NotificationBell onClick={openNotifications} />
      <NotificationsList
        onToggleAssignedNotifications={toggleAssignedNotifications}
        onNotificationMinimize={minimizeNotifications}
        onLoadMore={loadMoreNotifications}
        onViewDetail={onViewDetail}
        assignedNotifications={assignedNotifications}
        notifications={state.notifications}
        total={state.metaData.total}
        loading={loading}
      />
    </div>
  );
};

export default Notifications;
