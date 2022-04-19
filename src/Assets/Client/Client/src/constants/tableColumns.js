import React from 'react'
import { nameColumnFormatter, nameColumnFormatterOrg } from "../utils/commonUtil";
import { confirmationAlert } from "../components/confirmationAlert";
import { userRolesMap } from "../components/editOrganizationUser/editOrganizationUser";
import { nameThumbnailColumnFormatter, dateFormatter, responseUnitHistoryNameFormatter, distanceFormatter, statusFormatter } from '../utils/columnFormatter';







export const HISTORY_COLUMN = [
    {
        dataField: "namethumbnail",
        formatter: nameThumbnailColumnFormatter,
        isDummyField: true,
        headerStyle: {
            width: "50px",
        },
        text: "",
        classes: () => {
            return "user-thumbnail-td";
        },
    },
    {
        dataField: "name",
        text: "Name",
    },
    {
        dataField: "mac",
        text: "MAC Address",
    },
    {
        dataField: "alarmType",
        text: "Type",
    },
    {
        dataField: "incidentTime",
        text: "Triggered Time",
        formatter: dateFormatter,
    },
    {
        dataField: "verifiedTime",
        text: "Verified Time",
        formatter: dateFormatter,
    },
    {
        dataField: "acknowledgedTime",
        text: "Acknowledged Time",
        formatter: dateFormatter,
    },
];




export const RESPONSE_UNIT_COLUMNS = [
    {
        dataField: "responseUnit",
        formatter: responseUnitHistoryNameFormatter,
        text: "Response Agent",
    },
    {
        dataField: "alarmMac",
        text: "MAC Address",
    },
    {
        dataField: "createdAt",
        text: "Starting Date and Time",
        formatter: dateFormatter,
    },
    {
        dataField: "updatedAt",
        text: "Arrival Time",
        formatter: dateFormatter,
    },
    {
        dataField: "timeDiff",
        text: "Trip Duration",
    },
    {
        dataField: "distance",
        text: "Distance Covered",
        formatter: distanceFormatter,
    },
    {
        dataField: "type",
        text: "Status",
        headerStyle: {
            width: "110px",
        },
        formatter: statusFormatter,
    },
];




export const USERS_COULUMNS = [
    {
        dataField: "first_name",
        text: "Name",
        formatter: nameColumnFormatter
    },
    {
        dataField: "email",
        text: "Email"
    },
    {
        dataField: "organizationDetail.name",
        text: "Rapid Response Partner"
    },
    {
        dataField: "contact",
        text: "Contact"
    },
    {
        dataField: "role",
        text: "Role",
        headerStyle: {
            width: "185px"
        },
        formatter: (cell, row) => {
            return (
                <span>{cell.map(role => userRolesMap[role].label).join(", ")}</span>
            );
        }
    },

    {
        dataField: "actions",
        text: "Actions",
        headerStyle: {
            width: "95px"
        },
       
    }
];


export const ORGANIZATIONS_COLUMNS = [
    {
        dataField: "name",
        text: "Name",
        formatter: nameColumnFormatterOrg
    },
    {
        dataField: "email",
        text: "Email"
    },
    {
        dataField: "person",
        text: "Contact Person"
    },
    {
        dataField: "contact",
        text: "Phone"
    },
    {
        dataField: "city",
        text: "City"
    },
    {
        dataField: "actions",
        text: "Actions",
        headerStyle: {
            width: "135px"
        },
    }
];