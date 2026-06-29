import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import React, { Fragment, useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { Row, Spinner, Table } from "reactstrap";

const StaticTableContainer = ({ isLoading, columns, data, tableClass, theadClass, trClass, thClass, divClass }) => {
  const pageStateRef = useRef({
    pageIndex: 0,
    sorting: [],
  });
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(data.length / pagination.pageSize));
    const safePageIndex = Math.min(pageStateRef.current.pageIndex, maxPage - 1);

    const sortingUnchanged = JSON.stringify(pageStateRef.current.sorting) === JSON.stringify(sorting);

    setPagination((prev) => ({
      ...prev,
      pageIndex: sortingUnchanged ? safePageIndex : 0,
    }));
  }, [data]);

  useEffect(() => {
    pageStateRef.current = {
      pageIndex: pagination.pageIndex,
      sorting,
    };
  }, [pagination.pageIndex, sorting]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableSorting: true,
    manualPagination: false,
    manualSorting: false,
    autoResetPageIndex: false,
    defaultColumn: {
      size: 150,
    },
  });

  const { getHeaderGroups, getRowModel, getPageCount, getState, previousPage, nextPage, setPageIndex } = table;

  const { pageIndex, pageSize } = getState().pagination;

  return (
    <Fragment>
      <style>
        {`
        .table th, .table td {
          text-align: left;
          vertical-align: middle;
        }
      `}
      </style>

      <div className={divClass} style={{ minHeight: "250px" }}>
        <Table hover className={tableClass}>
          {!isMobile && (
            <thead className={theadClass}>
              {getHeaderGroups().map((headerGroup) => (
                <tr className={trClass} key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={thClass}
                      style={{ cursor: header.column.getCanSort() ? "pointer" : "default" }}
                      onClick={() => {
                        if (header.column.getCanSort()) {
                          header.column.toggleSorting();
                        }
                      }}>
                      {header.isPlaceholder ? null : (
                        <>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span
                            style={{
                              color:
                                header.column.getIsSorted() === "asc" ? "#22c55e" : header.column.getIsSorted() === "desc" ? "#ef4444" : "inherit",
                            }}>
                            {{
                              asc: " ▲",
                              desc: " ▼",
                            }[header.column.getIsSorted()] ?? null}
                          </span>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
          )}

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center", height: "150px" }}>
                  <Spinner color="primary" />
                </td>
              </tr>
            ) : getRowModel().rows.length > 0 ? (
              getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.columnDef.minSize,
                        maxWidth: cell.column.columnDef.maxSize,
                      }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: "center", padding: "2rem" }}>
                  No Data Found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
        <div className="col-sm">
          <div className="text-muted">
            Showing <span className="fw-semibold ms-1">{pageIndex * pageSize + getRowModel().rows.length}</span> of{" "}
            <span className="fw-semibold">{data.length}</span> Results
          </div>
        </div>
        {getPageCount() > 1 && (
          <div className="col-sm-auto">
            <ul className="pagination pagination-separated pagination-md justify-content-center justify-content-sm-start mb-0">
              {!isMobile && (
                <li className={`page-item ${pageIndex === 0 ? "disabled" : ""}`}>
                  <button type="button" className="page-link bg-info-subtle" onClick={() => setPageIndex(0)}>
                    First
                  </button>
                </li>
              )}
              <li className={`page-item ${pageIndex === 0 ? "disabled" : ""}`}>
                <button type="button" className="page-link bg-info-subtle" onClick={previousPage}>
                  Previous
                </button>
              </li>
              <li className="page-item">
                <div className="text-muted mt-2">
                  &nbsp;Page <span className="fw-semibold ms-1">{pageIndex + 1}</span> of <span className="fw-semibold">{getPageCount()}</span>
                </div>
              </li>
              <li className={`page-item ${pageIndex >= getPageCount() - 1 ? "disabled" : ""}`}>
                <button type="button" className="page-link bg-success-subtle" onClick={nextPage}>
                  Next
                </button>
              </li>
              {!isMobile && (
                <li className={`page-item ${pageIndex >= getPageCount() - 1 ? "disabled" : ""}`}>
                  <button type="button" className="page-link bg-success-subtle" onClick={() => setPageIndex(getPageCount() - 1)}>
                    Last
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </Row>
    </Fragment>
  );
};

export default StaticTableContainer;
