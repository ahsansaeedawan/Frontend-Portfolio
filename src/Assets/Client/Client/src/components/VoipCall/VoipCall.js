import React, { useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { toggleViopCallWidget } from '../../actions/appActions';
import { UserContext } from "../../context";
import { makePhoneCall, updatePhoneCallStatus } from "../../api/api";
import { success, error } from "../toast";

export function VoipCall({ number, mac }) {

  let dispatch = useDispatch();
  const user = useContext(UserContext);
  const [calling, setCalling] = useState(false);
  const { showCallWidget } = useSelector(state => state.callWidgetReducer);

  let interval = null;

  function updateCallStatus(data) {
    updatePhoneCallStatus(data)
      .then(() => { })
      .catch(() => { });
  }

  function handleOnCall() {

    if (!showCallWidget) {
      setCalling(true);
      const crmUniqueId = `${number}-${new Date().getTime()}`;
      // const agentName = user.voip_username; //! we are not using this variable any where 
      const callerNo = `${number}`;
      dispatch(toggleViopCallWidget(true));
      interval = setTimeout(() => {
        setCalling(false);
      }, 2000);
    }
    else error("Call Widget is visible");

    // makePhoneCall({
    //   callerno: callerNo,
    //   agentname: agentName,
    //   crmuniqueid: crmUniqueId,
    // })
    //   .then(({ data }) => {
    //     success(`Calling: ${number}`);

    //     // Update server with call status
    //     updateCallStatus({
    //       agentName,
    //       crmUniqueId,
    //       callerNo,
    //       mac,
    //       apiResponse: `${data}`,
    //     });

    //     setCalling(false);
    //   })
    //   .catch((e) => {
    //     error("Call Failed");
    //     if (e.response && e.response.data) {
    //       // Update server with call status
    //       updateCallStatus({
    //         agentName,
    //         crmUniqueId,
    //         callerNo,
    //         mac,
    //         apiResponse: `${e.response.data}`,
    //       });
    //     }
    //     setCalling(false);
    //   });
  }
  useEffect(() => {
    return () => {
      clearInterval(interval);
      dispatch(toggleViopCallWidget(false));
    }
  }, []);

  if (user && user.hasOwnProperty("voip_username")) {
    return (
      <button
        disabled={calling}
        onClick={handleOnCall}
        className="btn btn-voipcall"
      >
        {calling ? "Calling" : "Call"}
      </button>
    );
  }

  return null;
}
