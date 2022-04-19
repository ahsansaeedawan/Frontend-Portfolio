
import React from 'react';
import { FormikInput } from '../formikInput';
import "./intelliconFieldsReadOnly.css"

const IntelliconFieldsReadOnly = (data) => {
    return (
        < div className="intellicon-edit-field-container">
            <FormikInput
                readOnly={true}
                value={data.data.username}
            />
            <FormikInput
                readOnly={true}
                value={data.data.password}
            />
        </div >
    );

}
export default IntelliconFieldsReadOnly;