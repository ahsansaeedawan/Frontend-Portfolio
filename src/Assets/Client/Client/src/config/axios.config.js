import axios from "axios";
import axiosRetry from "axios-retry";
import { toast } from "../components/toast";
import { NETWORK_ERROR } from "../constants/errors";
const requestMap = {};
// default configuration for axios-retry can be overwritten in respective request
axiosRetry(axios, {
  retries: 0,
  retryDelay: () => 5000,
  retryCondition: error => {
    const shouldRetry =
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      axiosRetry.isRetryableError(error) ||
      (error && error.message === NETWORK_ERROR);
    return shouldRetry;
  }
});

export const initAxios = () => {
  // Redirect User to Login if UnAuthorized
  axios.interceptors.request.use(request => {
    if (request.errorHandling && request.errorHandling.global) {
      requestMap[request.url] = requestMap[request.url] + 1 || 1;
    }
    return request;
  });

  axios.interceptors.response.use(
    response => {
      requestMap[response.config.url] = requestMap[response.config.url] - 1;

      return response;
    },
    error => {
      if (error.config.errorHandling && error.config.errorHandling.global) {
        requestMap[error.config.url] = requestMap[error.config.url] - 1;
        if (requestMap[error.config.url] === 0) {
          const errorMessage =
            error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : error.message;
          toast("error", errorMessage);
        }
      }

      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        return Promise.reject(error);
      }

      if (error.response && error.response.status === 403) {
        const errorMessage =
          error.response && error.response.data && error.response.data.message
            ? error.response.data.message
            : error.message;
        toast("error", errorMessage);
        setTimeout(() => {
          localStorage.removeItem("token");
          window.location.reload();
        }, 1000)
      }
      else {
        return Promise.reject(error);
      }

    }
  );
};
