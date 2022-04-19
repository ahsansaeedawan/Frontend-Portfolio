import amplitude from "amplitude-js/amplitude";
import {AMPLITUDE_KEY} from "./keys.config";

// Initialize Amplitude Instance
amplitude.init(AMPLITUDE_KEY);


// Retrieve User Meta
export const getAmplitudeuserMeta = () => {
  const { _ua, _sessionId } = amplitude.getInstance();
  const userMeta = {
    session_id: _sessionId,
    device_type: _ua.os.name,
    os_name: _ua.browser.name,
    os_version: _ua.browser.version
  };
  return userMeta;
};



