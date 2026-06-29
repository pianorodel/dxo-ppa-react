import { useEffect, useMemo } from "react";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardBody, Col, Container, Row } from "reactstrap";

import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";

import { createPageStateUpdater } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";
import useCustomHook from "../Hooks/useCustomHook";
import BreadCrumb from "./BreadCrumb";
import { FilterButton } from "./Buttons";
import DeleteModal from "./Modals/DeleteModal";
import ExportExcelModal from "./Modals/ExportExcelModal";
import ModernAuditLogsModal from "./Modals/ModernAuditLogsModal";
import StaticTableContainer from "./StaticTableContainer";
import TableContainer from "./TableContainer";
import TableToolbar from "./TableToolbar";

// customModals sample usag:
// customModals = [
//   {
//     key: "approve",
//     component: ApproveModal,
//     toggleKey: "toggleApprove",
//     props: {
//       title: "Approve Item",
//     },
//     onAction: (data, helpers) => {},
//     propsMapper: (data, state, helpers) => {},
//   },
// ];

const ModernStaticResourcePage = ({
  title,
  moduleName,
  useGetQuery,
  useDeleteMutation,
  useExportMutation,
  getColumns,
  columnKey,
  codeField,
  breadCrumbs,
  SaveModalComponent,
  AdvanceFilterComponent,
  isTableOnly,
  isReadOnly = false,
  isLocal = false,
  customListPayload = {},
  customInitialState = {},
  logType = "",
  accessRights = null,
  handlePrint = null,
  customToolbars,
  customModals = [],
  customToolbarsEnd,
  advFilterProps = {},
  isHideSearchBar = false,
  renderExpandedRow,
  auditLogsQuery,
  auditLogsIdKey = "referenceId",
  saveModalProps = {},
}) => {
  const { state, customFunction } = useCustomHook(customInitialState);
  const { notification } = useNotificationModal();

  const { data, isLoading, isFetching, refetch } =
    typeof useGetQuery === "function"
      ? useGetQuery({ ...state.pageDetails, ...customListPayload }, { refetchOnMountOrArgChange: !isLocal })
      : { data: { items: [], totalRecords: 0 }, isLoading: false };

  const [deleteItem] = typeof useDeleteMutation === "function" ? useDeleteMutation() : [null];
  const [exportList] = typeof useExportMutation === "function" ? useExportMutation() : [null];

  const updatePageState = createPageStateUpdater(state, customFunction.updateState);

  useEffect(() => {
    if (isLocal) {
      refetch();
    }
  }, []);

  useEffect(() => {
    if (isLocal) {
      let filteredData = data?.items || data?.returnData || [];
      if (state?.searchValue) {
        filteredData = filteredData.filter((item) =>
          Object.keys(item).some((key) => String(item[key]).toLowerCase().includes(state.searchValue.toLowerCase())),
        );
      }
      customFunction.updateState({ rowData: filteredData });
    }
  }, [isLocal, state.searchValue, data]);

  const handleDeleteItem = async () => {
    if (isReadOnly || !deleteItem || typeof deleteItem !== "function") return;

    const id = state.trxValue[columnKey];
    if (!id) return;

    try {
      const res = await deleteItem({ [columnKey]: id }).unwrap();
      assertApiSuccess(res);
      notification({ type: "success", title: moduleName, message: `${moduleName} deleted successfully.` });
    } catch (error) {
      notification({ type: "error", title: moduleName, message: `Failed to delete ${moduleName}: ${error.message}` });
    } finally {
      customFunction.updateToggle("toggleDelete");
    }
  };

  const handleExport = async (e) => {
    if (!exportList || typeof exportList !== "function") {
      toast.error("Export function is not available.");
      return;
    }

    if (e) {
      try {
        const res = await exportList({
          keyword: state.pageDetails.keyword,
          page: state.pageDetails.page,
          pageSize: state.pageDetails.pageSize,
          ...state.pageDetails,
          ...customListPayload,
        });

        toast(res ? `${moduleName} was successfully downloaded.` : `${moduleName} failed to download.`, {
          position: "top-right",
          hideProgressBar: false,
          closeOnClick: true,
          className: `${res ? "bg-success" : "bg-danger"} text-white`,
        });
      } catch (error) {
        toast.error(`Export failed: ${error.message}`);
      }
    }

    handleActions("export");
  };

  const handleActions = async (toggle, data) => {
    const actionMap = {
      export: "toggleExport",
      filter: "toggleFilter",
      logs: "toggleLogs",
      print: "togglePrint",
    };

    customModals.forEach((modal) => {
      if (modal.key && modal.toggleKey) {
        actionMap[modal.key] = modal.toggleKey;
      }
    });

    if (!isReadOnly) {
      Object.assign(actionMap, {
        delete: "toggleDelete",
        update: "toggleUpdate",
      });
    }

    const toggleKey = actionMap[toggle];
    if (toggleKey) {
      customFunction.updateToggle(toggleKey, data);
    }

    if (toggle === "filter" && state.toggle.toggleFilter === true) {
      customFunction.updateState({
        pageDetails: {
          page: 1,
          pageSize: 10,
          sortField: "",
          sortOrder: "",
          keyword: state.pageDetails?.keyword || "",
        },
      });
    }

    const modalConfig = customModals.find((m) => m.key === toggle);
    if (modalConfig?.onAction && typeof modalConfig.onAction === "function") {
      try {
        await modalConfig.onAction(data, {
          state,
          notification,
          refetch,
          updateState: customFunction.updateState,
          updateToggle: customFunction.updateToggle,
        });
      } catch (error) {
        notification({
          type: "error",
          title: modalConfig.title || toggle,
          message: error.message,
        });
      }
    }
  };

  const columns = useMemo((customFunction) => getColumns(handleActions, { ...customFunction }), [handleActions]);

  return (
    <div className={isTableOnly ? "" : "page-content"}>
      <style>
        {`
[data-bs-theme="dark"] .card {
  background-color: #1f2636 !important;
  border: 1px solid #2e3a55 !important;
  color: #e6edf7;
  box-shadow: none;
}

[data-bs-theme="dark"] .card-body {
  background-color: transparent;
}

[data-bs-theme="dark"] .card-header,
[data-bs-theme="dark"] .card-footer {
  background-color: #222a3d;
  border-color: #2e3a55;
  color: #e6edf7;
}

[data-bs-theme="dark"] hr,
[data-bs-theme="dark"] .border-top,
[data-bs-theme="dark"] .border-bottom {
  border-color: #2e3a55 !important;
}

[data-bs-theme="dark"] .table > :not(caption) > * > * {
  background-color: #1f2636;
  color: #e6edf7;
  border-color: #2e3a55;
}

[data-bs-theme="dark"] .table thead th {
  background-color: #222a3d !important;
  color: #e6edf7;
  font-weight: 600;
}

[data-bs-theme="dark"] .table-light,
[data-bs-theme="dark"] .table-light th,
[data-bs-theme="dark"] .table-light td {
  background-color: #222a3d !important;
  color: #e6edf7 !important;
  border-color: #2e3a55 !important;
}

[data-bs-theme="dark"] .table-hover tbody tr:hover > * {
  background-color: #27324a;
}

[data-bs-theme="dark"] .table-striped tbody tr:nth-of-type(odd) > * {
  background-color: #222a3d;
}

[data-bs-theme="dark"] .pagination .page-link {
  background-color: #1f2636;
  color: #c7d2e5;
  border-color: #2e3a55;
}

[data-bs-theme="dark"] .pagination .page-link:hover {
  background-color: #27324a;
}

[data-bs-theme="dark"] .page-item.disabled .page-link {
  background-color: #1b2130;
  color: #6b7280;
}

[data-bs-theme="dark"] .text-muted {
  color: #9aa7bd !important;
}

[data-bs-theme="dark"] small,
[data-bs-theme="dark"] .form-label {
  color: #7f8fb0;
}

[data-bs-theme="dark"] .search-box .form-control {
  background-color: #1b2130 !important;
  border-color: #2e3a55 !important;
  color: #e6edf7 !important;
}

[data-bs-theme="dark"] .search-box .form-control::placeholder {
  color: #9aa7bd;
}

[data-bs-theme="dark"] .search-box .form-control:focus {
  background-color: #1b2130;
  border-color: #405189;
  box-shadow: 0 0 0 0.15rem rgba(64,81,137,.35);
}

[data-bs-theme="dark"] .search-box .search-icon {
  color: #9aa7bd;
}

[data-bs-theme="dark"] .dropdown-menu {
  background-color: #1f2636;
  border: 1px solid #2e3a55;
}

[data-bs-theme="dark"] .dropdown-item {
  color: #c7d2e5;
}

[data-bs-theme="dark"] .dropdown-item:hover {
  background-color: #27324a;
  color: #ffffff;
}

[data-bs-theme="dark"] .btn-soft-secondary {
  background-color: #1f2636;
  border-color: #2e3a55;
  color: #c7d2e5;
}

[data-bs-theme="dark"] .btn-soft-secondary:hover {
  background-color: #27324a;
  border-color: #405189;
  color: #ffffff;
}

[data-bs-theme="dark"] .form-control.bg-light {
  background-color: #1b2130 !important;
  border-color: #2e3a55 !important;
  color: #e6edf7 !important;
}

.card,
.table,
.form-control,
.dropdown-menu,
.btn {
  transition:
    background-color .25s ease,
    border-color .25s ease,
    color .25s ease;
}
`}
      </style>

      <ExportExcelModal show={state.toggle.toggleExport} onCloseClick={handleExport} title={`Export List of ${moduleName}`} />

      {customModals.map((modalConfig) => {
        const { key, component: ModalComponent, toggleKey, props = {}, propsMapper } = modalConfig;

        if (!ModalComponent || !toggleKey) return null;

        if (!state.toggle[toggleKey]) return null;

        const modalProps = {
          show: state.toggle[toggleKey],
          onCloseClick: () => handleActions(key),
          data: state.trxValue,
          ...props,
          ...(propsMapper && typeof propsMapper === "function"
            ? propsMapper(state.trxValue, state, { refetch, notification, updateToggle: customFunction.updateToggle })
            : {}),
        };

        return <ModalComponent key={key} {...modalProps} />;
      })}

      {!isReadOnly && SaveModalComponent && (
        <SaveModalComponent
          refetchParentList={() => {
            refetch();
            customFunction.updateState({ tableParentKey: (state?.tableParentKey ?? 0) + 1 });
          }}
          show={state.toggle.toggleUpdate}
          data={state.trxValue}
          accessRights={accessRights}
          onCloseClick={() => handleActions("update")}
          {...saveModalProps}
        />
      )}

      {!isReadOnly && (
        <DeleteModal
          title={`Delete ${moduleName} ${state?.trxValue?.[codeField] ? `- ${state.trxValue[codeField]}` : state?.trxValue?.code}`}
          show={state?.toggle?.toggleDelete}
          onDeleteClick={handleDeleteItem}
          onCloseClick={() => handleActions("delete")}
        />
      )}

      {state.toggle.toggleLogs && (
        <ModernAuditLogsModal
          show={state.toggle.toggleLogs}
          title="Audit Logs"
          // subTitle={state?.trxValue?.fullName}
          transactionId={state?.trxValue?.[columnKey] || 0}
          queryArg={{ logType: logType || "" }}
          useLogsQuery={auditLogsQuery}
          idKey={auditLogsIdKey}
          onClose={() => handleActions("logs")}
        />
      )}

      <Container fluid className={`${isMobile && `px-0 mx-0`}`}>
        {!isTableOnly && <BreadCrumb title={title} crumbs={breadCrumbs || []} />}
        <Row>
          {state.toggle.toggleFilter && (
            <Col xl={3} lg={3}>
              <AdvanceFilterComponent pageDetails={state.pageDetails} updateState={customFunction.updateState} {...advFilterProps} />
            </Col>
          )}
          <Col className={state.toggle.toggleFilter ? "col-xl-9 col-lg-9" : "col-xl-12 col-lg-12"}>
            <Card style={isMobile ? {} : { minHeight: "75vh" }}>
              <div className="card-body pt-0">
                <CardBody>
                  <TableToolbar
                    handleFilter={
                      AdvanceFilterComponent && <FilterButton onClick={() => handleActions("filter")} toggle={state.toggle.toggleFilter} />
                    }
                    handleCreate={!isReadOnly && hasWriteAccess(accessRights) ? () => handleActions("update") : undefined}
                    handleExport={() => handleActions("export")}
                    handlePrint={handlePrint}
                    handleSearch={
                      isHideSearchBar
                        ? null
                        : isLocal
                          ? (keyword) => customFunction.updateState({ searchValue: keyword })
                          : (keyword) => updatePageState("search", keyword)
                    }
                    buttonCreateName={`New ${moduleName}`}
                    customToolbars={customToolbars}
                    customToolbarsEnd={customToolbarsEnd}
                  />
                </CardBody>
                {isLocal ? (
                  <StaticTableContainer
                    isLoading={isLoading}
                    columns={columns}
                    data={state.rowData || []}
                    divClass="table-responsive mb-1"
                    tableClass="mb-0 align-top"
                    theadClass="table-light"
                  />
                ) : (
                  <TableContainer
                    key={state?.tableContainerKey}
                    isLoading={isLoading || isFetching}
                    columns={columns}
                    data={data?.items || data?.returnData || []}
                    divClass="table-responsive mb-1"
                    tableClass="mb-0 align-top"
                    theadClass="table-light"
                    pageSize={state.pageDetails.pageSize}
                    totalRecords={data?.totalRecords || 0}
                    currentPage={state.pageDetails.page}
                    onPageChange={(page) => updatePageState("pageChange", page)}
                    onSortChange={(field, order) => updatePageState("sortChange", { sortField: field, sortOrder: order })}
                    onPageSizeChange={(pageSize) => updatePageState("pageSizeChange", pageSize)}
                    renderExpandedRow={renderExpandedRow}
                  />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ModernStaticResourcePage;
