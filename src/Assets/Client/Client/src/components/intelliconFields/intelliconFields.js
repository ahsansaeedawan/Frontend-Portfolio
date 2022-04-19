import React from 'react';
import { FormikInput } from '../formikInput';
import "./intelliconFields.css";

const IntelliconFields = ({ uid, noOfSipUser, handleAddSipUsername, errors, touched, arrLength }) => {
    return (

        <div className="form-col-container">
            <FormikInput
                name={`intelliconUsername[${[uid]}]`}
                placeholder="Intellicon Username"
                errors={errors.intelliconUsername}
                touched={touched.intelliconUsername}
            />
            <FormikInput
                name={`intelliconPassword[${[uid]}]`}
                placeholder="Intellicon Password"
                errors={errors.intelliconPassword}
                touched={touched.intelliconPassword}

            />

            {

                arrLength - 1 === uid &&
                <div className="add-sip-btn" onClick={() => handleAddSipUsername(noOfSipUser.length + 1)}>
                    +
                 </div>
            }
        </div>

    );
}
export default IntelliconFields;