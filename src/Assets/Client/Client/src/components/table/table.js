import React from 'react';
import paginationFactory, {
    PaginationProvider,
    PaginationListStandalone,
    PaginationTotalStandalone
} from "react-bootstrap-table2-paginator";
 bimport BootstrapTable from "react-bootstrap-table-next";


function NoDataIndication() {
    return <div className="no-data-found">No events found</div>;
}

const customTotal = (from, to, size) => (
    <span className="table-pagination-total">
        {from} - {to} of {size}
    </span>
);

const Table = ({
    data,
    columns,
    rowEvents,
    page,
    sizePerPage,
    totalSize,
    onTableChange,
    ...rest
}) => (
        <div className="bs4-wrapper bs-table-overrides">
            <PaginationProvider
                pagination={paginationFactory({
                    custom: true,
                    page,
                    sizePerPage,
                    totalSize,
                    hideSizePerPage: true,
                    withFirstAndLast: false,
                    showTotal: true,
                    paginationTotalRenderer: customTotal,
                })}
            >
                {({ paginationProps, paginationTableProps }) => {
                    return (
                        <>
                            <BootstrapTable
                                keyField="_id"
                                data={data}
                                columns={columns}
                                rowEvents={rowEvents}
                                onTableChange={onTableChange}
                                hover
                                {...paginationTableProps}
                                {...rest}
                                noDataIndication={() => <NoDataIndication />}
                            ></BootstrapTable>
                            <div className="custom-pagination-total">
                                <PaginationTotalStandalone {...paginationProps} />
                                <PaginationListStandalone {...paginationProps} />
                            </div>
                        </>
                    );
                }}
            </PaginationProvider>
        </div >
    );

export default Table;