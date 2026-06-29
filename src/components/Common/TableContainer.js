import { flexRender, getCoreRowModel, getExpandedRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import React, { Fragment, useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Link } from "react-router-dom";
import Select from "react-select";
import { Row, Table } from "reactstrap";

import noResultImage from "@/assets/images/no-result.webp";

import LoadingOverlay from "./Loader/LoadingOverlay";
import PacmanLoader from "./Loader/PacmanLoader";

const TableContainer = ({
  isLoading,
  columns,
  data,
  pageSize,
  totalRecords = 0,
  customPageSize,
  onPageChange = () => { },
  onSortChange = () => { },
  onPageSizeChange = () => { },
  currentPage = 0,
  enableColumnResizing = true,
  disablePageSizeSelect = false,
  renderExpandedRow,
}) => {
  const pageCount = Math.ceil((totalRecords || 0) / pageSize);
  const [expanded, setExpanded] = useState({});
  // const [initialized, setInitialized] = useState(false);

  // useEffect(() => {
  //   if (initialized) return;

  //   const autoExpanded = {};

  //   table.getRowModel().rows.forEach((row) => {
  //     if (row.original?.files?.length > 0) {
  //       autoExpanded[row.id] = true;
  //     }
  //   });

  //   setExpanded(autoExpanded);
  //   setInitialized(true);
  // }, [initialized, data]);

  const table = useReactTable({
    columns,
    data,
    pageCount,
    manualPagination: true,
    state: {
      pagination: {
        pageSize: pageSize,
        pageIndex: currentPage,
      },
      expanded,
    },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    enableColumnResizing: enableColumnResizing,
    defaultColumn: {
      size: 150,
    },
    getRowCanExpand: () => true,
  });

  const { getHeaderGroups, getRowModel, setPageSize } = table;

  useEffect(() => {
    customPageSize && setPageSize(customPageSize);
  }, [customPageSize, setPageSize]);

  const [showDelayedLoader, setShowDelayedLoader] = useState(false);

  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => setShowDelayedLoader(true), 200); // show after 1s
    } else {
      setShowDelayedLoader(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <Fragment>
      <style>
        {`
          .table th {
              padding: 10px 16px;
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: .4px;
              color: var(--vz-text-muted, #6b7280);
              border-bottom: 2px solid var(--vz-border-color, #e9ebec);
              text-align: left;
              vertical-align: middle !important;
              white-space: nowrap;
          },
          .table td {
            text-align: left;
            vertical-align: middle !important;
          },
        `}
      </style>

      <div className={"table-responsive mb-1"} style={{ minHeight: "250px" }}>
        <LoadingOverlay loading={showDelayedLoader} loader={<PacmanLoader />}>
          <Table hover className={"table table-hover align-middle mb-0"}>
            {!isMobile ? (
              <thead className={"table-light"}>
                {getHeaderGroups().map((headerGroup) => (
                  <tr className={""} key={headerGroup.id}>
                    {headerGroup.headers.map((header, index) => (
                      <th
                        style={{ cursor: "pointer", width: header.column.getSize(), ...( header.column.columnDef.meta?.thStyle || {}) }}
                        key={index}
                        className={""}
                        {...{
                          onClick: () => {
                            if (!header.column.getCanSort()) return;

                            const isCurrentlyAsc = header.column.getIsSorted() === "asc";
                            header.column.toggleSorting(!isCurrentlyAsc);

                            if (header.column.getIsSorted() === "asc") {
                              header.column.toggleSorting(true);
                            } else {
                              header.column.toggleSorting(false);
                            }

                            if (totalRecords > pageSize) {
                              const sortField = header.column.columnDef.accessorKey;
                              let sortOrder = "";

                              const currentSort = header.column.getIsSorted();

                              if (currentSort == false) sortOrder = "asc";
                              else if (currentSort === "asc") sortOrder = "desc";
                              else sortOrder = "asc";

                              onSortChange(sortField, sortOrder);
                            }
                          },
                        }}>
                        {header.isPlaceholder ? null : (
                          <React.Fragment>
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <span
                              style={{
                                color:
                                  header.column.getIsSorted() === "asc"
                                    ? "#22c55e" // success green
                                    : header.column.getIsSorted() === "desc"
                                      ? "#ef4444" // danger red
                                      : "inherit",
                              }}>
                              {{
                                asc: " ▲",
                                desc: " ▼",
                              }[header.column.getIsSorted()] ?? null}
                            </span>
                          </React.Fragment>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
            ) : null}

            <tbody>
              {getRowModel().rows.length > 0 ? (
                getRowModel().rows.map((row, index) => (
                  <Fragment key={index}>
                    <tr>
                      {row.getVisibleCells().map((cell, index) => (
                        <td
                          key={index}
                          style={{
                            width: cell.column.getSize(),
                            minWidth: cell.column.columnDef.minSize,
                            maxWidth: cell.column.columnDef.maxSize,
                          }}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>

                    {row.getIsExpanded() && renderExpandedRow && (
                      <tr>
                        <td colSpan={row.getVisibleCells().length}>{renderExpandedRow(row)}</td>
                      </tr>
                    )}
                  </Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="text-center" style={{ height: "350px" }}>
                    {!isLoading && (
                      <div style={{ position: "relative" }}>
                        <img src={noResultImage} alt="no data found" style={{ width: "350px", height: "350px", objectFit: "contain" }} />
                        <h4
                          className="text-muted"
                          style={{ position: "absolute", bottom: "5%", transform: "translateY(-50%)", left: "50%", transform: "translateX(-50%)" }}>
                          Nothing to show here yet.
                        </h4>
                      </div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </LoadingOverlay>
      </div>

      <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
        <div className="col-sm">
          <div className="text-muted">
            {totalRecords == 0 ? (
              ""
            ) : (
              <>
                {totalRecords > 10 && !disablePageSizeSelect ? (
                  <div className="d-inline-block">
                    <Select
                      className="react-select me-2"
                      classNamePrefix="select"
                      options={[10, 20, 30, 40, 50].map((num) => ({
                        value: num,
                        label: num,
                      }))}
                      value={{ value: pageSize, label: pageSize }}
                      onChange={(option) => onPageSizeChange(option.value)}
                      placeholder="Select..."
                    />
                  </div>
                ) : null}
                Showing<span className="fw-semibold ms-1">{pageSize * (currentPage - 1) + data?.length}</span> of{" "}
                <span className="fw-semibold">{totalRecords}</span> Results
              </>
            )}
          </div>
        </div>
        {totalRecords != 0 && pageCount > 1 ? (
          <div className="col-sm-auto">
            <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
              {isMobile ? null : (
                <li className={currentPage > 1 ? "page-item" : "page-item disabled"}>
                  <Link
                    to="#"
                    className="page-link bg-info-subtle"
                    onClick={() => {
                      if (currentPage != 1) {
                        onPageChange(1);
                      }
                    }}>
                    First
                  </Link>
                </li>
              )}
              <li className={currentPage > 1 ? "page-item" : "page-item disabled"}>
                <Link
                  to="#"
                  className="page-link bg-info-subtle"
                  onClick={() => {
                    if (currentPage > 1) {
                      onPageChange(currentPage - 1);
                    }
                  }}>
                  Previous
                </Link>
              </li>
              <li className="page-item">
                <div className="text-muted mt-2 ">
                  &nbsp;Page<span className="fw-semibold ms-1">{pageCount > 0 ? currentPage : 0}</span> of{" "}
                  <span className="fw-semibold">{pageCount}</span>{" "}
                </div>
              </li>
              <li className={currentPage < pageCount ? "page-item" : "page-item disabled"}>
                <Link
                  to="#"
                  className="page-link bg-success-subtle"
                  onClick={() => {
                    if (currentPage < pageCount) {
                      onPageChange(currentPage + 1);
                    }
                  }}>
                  Next
                </Link>
              </li>
              {isMobile ? null : (
                <li className={currentPage < pageCount ? "page-item" : "page-item disabled"}>
                  <Link
                    to="#"
                    className="page-link bg-success-subtle"
                    onClick={() => {
                      if (currentPage < pageCount) {
                        onPageChange(pageCount);
                      }
                    }}>
                    Last
                  </Link>
                </li>
              )}
            </ul>
          </div>
        ) : (
          ""
        )}
      </Row>
    </Fragment>
  );
};

export default TableContainer;
