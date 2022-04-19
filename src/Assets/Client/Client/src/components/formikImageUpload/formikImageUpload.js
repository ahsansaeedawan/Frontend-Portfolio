import React from "react";
import classNames from "classnames";
import { FormImageThumbnail } from "../formImageThumbnail";

function FormikImageUpload({
  errors,
  touched,
  name,
  value,
  onTouched,
  onValueChange
}) {
  return (
    <div
      className={classNames("form-group", {
        "has-errors": errors && touched,
        valid: !errors && touched
      })}
    >
      <div className="form-image">
        <input
          name={name}
          type="file"
          id="form-image"
          accept="image/x-png,image/gif,image/jpeg"
          onChange={event => {
            onTouched(name);
            onValueChange(name, event.currentTarget.files[0], true);
            event.target.value = null;
          }}
        />
        {!value && (
          <label
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              height: "100%"
            }}
            htmlFor="form-image"
          >
            <i className="sf-icon i-image-upload-camera" />
            <div className="form-image-ins">
              <p>Choose file to upload</p>
              <span className="image-size-info">
                {/* image should be 512*512 pixels */}
                You can upload .jpg or .png image
              </span>
            </div>
          </label>
        )}

        <FormImageThumbnail
          file={value}
          removeImage={() => {
            onTouched(name);
            onValueChange(name, null, true);
          }}
        />
      </div>
      {errors && touched && <span className="form-field-error">{errors}</span>}
    </div>
  );
}

export default FormikImageUpload;
