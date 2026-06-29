import { useEffect, useMemo } from "react";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardBody, Col, Row } from "reactstrap";

import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";

import { createPageStateUpdater } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";
import useCustomHook from "../Hooks/useCustomHook";
import { FilterButton } from "./Buttons";
import DeleteModal from "./Modals/DeleteModal";
import ExportExcelModal from "./Modals/ExportExcelModal";
import ModernAuditLogsModal from "./Modals/ModernAuditLogsModal";
import StaticTableContainer from "./StaticTableContainer";
import TableContainer from "./TableContainer";
import TableToolbar from "./TableToolbar";

const TabbedStaticResourcePage = ({
  moduleName,
  useGetQuery,
  useDeleteMutation,
  useExportMutation,
  getColumns,
  columnKey,
  codeField,
  SaveModalComponent,
  AdvanceFilterComponent,
  isReadOnly = false,
  isLocal = false,
  customListPayload = {},
  customInitialState = {},
  logType = "",
  accessRights = null,
  handlePrint = null,
  customToolbars,
  auditLogsQuery,
  auditLogsIdKey = "referenceId",
  saveModalProps = {},
  renderExpandedRow,
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

  const handleActions = (toggle, data) => {
    const actionMap = {
      export: "toggleExport",
      filter: "toggleFilter",
      logs: "toggleLogs",
      print: "togglePrint",
    };

    if (!isReadOnly) {
      Object.assign(actionMap, {
        delete: "toggleDelete",
        update: "toggleUpdate",
      });
    }

    const action = actionMap[toggle];
    if (action) customFunction.updateToggle(action, data);
  };

  const columns = useMemo((customFunction) => getColumns(handleActions, { ...customFunction }), [handleActions]);

  return (
    <div className="">
      <ExportExcelModal show={state.toggle.toggleExport} onCloseClick={handleExport} title={`Export List of ${moduleName}`} />

      {!isReadOnly && (
        <SaveModalComponent
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
          transactionId={state?.trxValue?.[columnKey] || 0}
          queryArg={{ logType: logType || "" }}
          useLogsQuery={auditLogsQuery}
          idKey={auditLogsIdKey}
          onClose={() => handleActions("logs")}
        />
      )}

      <div>
        <Row>
          {state.toggle.toggleFilter && (
            <Col xl={3} lg={3}>
              <AdvanceFilterComponent pageDetails={state.pageDetails} updateState={customFunction.updateState} />
            </Col>
          )}
          <Col className={state.toggle.toggleFilter ? "col-xl-9 col-lg-9" : "col-xl-12 col-lg-12"}>
              <div className="card-body p-0">
                <CardBody>
                  <TableToolbar
                    handleFilter={
                      AdvanceFilterComponent && <FilterButton onClick={() => handleActions("filter")} toggle={state.toggle.toggleFilter} />
                    }
                    handleCreate={!isReadOnly && hasWriteAccess(accessRights) ? () => handleActions("update") : undefined}
                    handleExport={() => handleActions("export")}
                    handlePrint={handlePrint}
                    handleSearch={
                      isLocal ? (keyword) => customFunction.updateState({ searchValue: keyword }) : (keyword) => updatePageState("search", keyword)
                    }
                    buttonCreateName={`Add ${moduleName}`}
                    customToolbars={customToolbars}
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
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TabbedStaticResourcePage;
