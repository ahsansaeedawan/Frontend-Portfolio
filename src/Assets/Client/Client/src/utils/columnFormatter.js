import React from 'react';
import Moment from "react-moment";


export function responseUnitHistoryNameFormatter(cell, row, rowIndex) {
    return (
        <div className="data-table-info">
            {typeof cell === "string" && Boolean(cell[0]) && (
                <div className="data-table-name-thumbnail">
                    {cell[0].toUpperCase()}
                </div>
            )}
            <span className="name">{cell}</span>
        </div>
    );
}


export function statusFormatter(cell, row) {
    if (!cell) return null;
    return (
        <label className={`response-unit-status ${cell.toLowerCase()}`}>
            {cell}
        </label>
    );
}

export function nameThumbnailColumnFormatter(cell, row) {
    if (typeof row.name === "string" && Boolean(row.name[0])) {
        return (
            <div className="data-table-name-thumbnail">
                {row.name[0].toUpperCase()}
            </div>
        );
    }
    return null;
}

export function dateFormatter(cell, row) {
    if (!cell) return "-- --";
    return (
        <Moment format="DD.MM.YYYY hh:mm:ss A" local>
            {cell}
        </Moment>
    );
}
export function timeFormatter(cell, row) {
    if (!cell) return "-- --";
    return (
        <Moment format="hh:mm:ss A" local>
            {cell}
        </Moment>
    );
}


export function distanceFormatter(cell, row) {
    if (!cell) return "-- --";
    return (
        <div>
            {`${cell} Km`}
        </div>

    );
}
