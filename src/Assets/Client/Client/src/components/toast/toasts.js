import React from "react";
import toaster from "toasted-notes";
import { Toast } from "./";

export function toast(type, message) {
  toaster.notify(
    ({ onClose }) => <Toast type={type} onClose={onClose} message={message} />,
    {
      position: "bottom-right"
    }
  );
}

export function success(message) {
  toast("success", message);
}

export function error(message) {
  toast("error", message);
}

export function info(message) {
  toast("info", message);
}
