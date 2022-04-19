import jwtDecode from "jwt-decode";
import {
  RESET_USER,
  CURRENT_USER,
  SET_APP_LOADING,
  SET_VOIP_CALL,
  USER_LOGOUT,
} from "../constants";
import { fetchUser } from "../api";
import { getUserPermissions } from "../config/perms";

export const toggleViopCallWidget = (isCalling) =>
  (dispatch) => {
    dispatch({
      type: SET_VOIP_CALL,
      payload: {isCalling}
    });
  }


export const loadUserFromToken = () =>
  (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token || token === "") {
      dispatch({
        type: SET_APP_LOADING,
        payload: { isLoading: false },
      });
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (
        decodedToken && decodedToken.role && Array.isArray(decodedToken.role)
      ) {
        fetchUser()
          .then(({ data }) => {
            const user = data.data;
            user.dealerId = decodedToken.dealerId || 0;
            user.subDealerId = decodedToken.subDealerId || 0;
            user.permissions = getUserPermissions(user.role);
            dispatch({
              type: CURRENT_USER,
              payload: { user },
            });
            dispatch({
              type: SET_APP_LOADING,
              payload: { isLoading: false },
            });
          })
          .catch((e) => {
            window.location.reload();
            console.log(e);
          });
      }
    } catch (e) {
      localStorage.removeItem("token");
      dispatch({
        type: RESET_USER,
      });
      dispatch({
        type: SET_APP_LOADING,
        payload: { isLoading: false },
      });
      window.location.reload();
    }
  };

export const setCurrentUser = (user) =>
  (dispatch) => {
    const decodedToken = jwtDecode(window.localStorage.getItem("token"));
    user.dealerId = decodedToken.dealerId || 0;
    user.subDealerId = decodedToken.subDealerId || 0;
    user.permissions = getUserPermissions(user.role);
    dispatch({
      type: CURRENT_USER,
      payload: { user },
    });
  };

export const logOut = () =>
  (dispatch) => {
    dispatch({
      type: USER_LOGOUT,
    });
  };
