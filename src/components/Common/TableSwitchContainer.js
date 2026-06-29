import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";

import Pagination from "@/components/Common/Pagination";
import TableContainer from "@/components/Common/TableContainer";

const TableSwitchContainer = ({
  viewMode = "grid",
  data,
  isLoading = false,
  columns,
  GridComponent,
  gridProps = {},
  pageDetails,
  onPageChange,
  onSortChange,
  onPageSizeChange,
  showPagination = true,
  cardClassName = "",
  tableConfig = {},
  isReadOnly = false,
}) => {
  const items = data?.items || [];
  const totalRecords = data?.totalRecords || 0;
  const currentPage = pageDetails?.page || 1;
  const pageSize = pageDetails?.pageSize || 10;

  const displayedCount = pageSize * (currentPage - 1) + items.length;

  if (viewMode === "grid") {
    return (
      <>
        <GridComponent isLoading={isLoading} data={data} {...gridProps} isReadOnly={isReadOnly} />

        {showPagination && (
          <div className="d-flex justify-content-md-between justify-content-center flex-wrap">
            <div className="mt-2 mb-3 text-muted">
              Showing <span className="fw-semibold ms-1">{displayedCount}</span> of <span className="fw-semibold">{totalRecords}</span> Results
            </div>
            <Pagination data={items} totalRecords={totalRecords} currentPage={currentPage} setCurrentPage={onPageChange} perPageData={pageSize} />
          </div>
        )}
      </>
    );
  }

  if (!isLoading && items.length === 0) return null;

  return (
    <Card className={cardClassName}>
      <CardBody>
        <TableContainer
          isLoading={isLoading}
          columns={columns}
          data={items}
          divClass={tableConfig.divClass || "table-responsive mb-1"}
          tableClass={tableConfig.tableClass || "mb-0 align-top"}
          theadClass={tableConfig.theadClass || "table-light"}
          pageSize={pageSize}
          totalRecords={totalRecords}
          currentPage={currentPage}
          onPageChange={onPageChange}
          onSortChange={onSortChange}
          onPageSizeChange={onPageSizeChange}
        />
      </CardBody>
    </Card>
  );
};

export default TableSwitchContainer;
