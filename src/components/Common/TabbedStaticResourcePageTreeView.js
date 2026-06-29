import { useMemo } from "react";
import { isMobile } from "react-device-detect";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";

import { createPageStateUpdater } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";
import useCustomHook from "../Hooks/useCustomHook";
import DeleteModal from "./Modals/DeleteModal";
import ExportExcelModal from "./Modals/ExportExcelModal";
import ModernAuditLogsModal from "./Modals/ModernAuditLogsModal";
import TableContainer from "./TableContainer";
import TableToolbar from "./TableToolbar";

const TabbedStaticResourcePageTreeView = ({
  codeField,
  title,
  moduleName,
  listName,
  useGetQuery,
  useDeleteMutation,
  useExportMutation,
  getColumns,
  columnKey,
  SaveModalComponent,
  TreeViewComponent,
  selectedTreeId,
  logType = "",
  accessRights,
  parentId = "parentId",
  parentName = "parentName",
  renderExpandedRow,
}) => {
  const { state, customFunction } = useCustomHook();
  const { notification } = useNotificationModal();
  const [deleteItem] = useDeleteMutation();
  const [exportList] = useExportMutation();
  const updatePageState = createPageStateUpdater(state, customFunction.updateState);

  const queryParams = {
    ...state.pageDetails,
    [parentId]: selectedTreeId || 0,
  };

  const { data, isLoading } = useGetQuery(queryParams, {
    refetchOnMountOrArgChange: true,
  });

  const handleDeleteItem = async () => {
    const id = state.trxValue[columnKey];
    if (!id) return;
    try {
      const res = await deleteItem({ [columnKey]: id }).unwrap();
      assertApiSuccess(res);
      notification({ type: "success", title: moduleName, message: `${moduleName} deleted successfully.` });
      customFunction.updateToggle("toggleDelete");
    } catch (error) {
      notification({ type: "error", title: moduleName, message: `Failed to delete ${moduleName}: ${error.message}` });
      customFunction.updateToggle("toggleDelete");
    }
  };

  const handleExport = async (e) => {
    if (e) {
      const res = await exportList({ keyword: state.pageDetails.keyword, page: state.pageDetails.page, pageSize: state.pageDetails.pageSize });
      toast(res ? `${moduleName} was successfully downloaded.` : `${moduleName} was failed to downloaded.`, {
        position: "top-right",
        hideProgressBar: false,
        closeOnClick: true,
        className: `${res ? "bg-success" : "bg-danger"} text-white`,
      });
    }
    handleActions("export");
  };

  const handleActions = (toggle, data) => {
    const actionMap = { delete: "toggleDelete", update: "toggleUpdate", export: "toggleExport", filter: "toggleFilter", logs: "toggleLogs" };
    const action = actionMap[toggle];
    if (action) customFunction.updateToggle(action, data);
  };

  const columns = useMemo(() => getColumns(handleActions), [handleActions]);

  return (
    <>
      <ExportExcelModal show={state.toggle.toggleExport} onCloseClick={handleExport} title={`Export List of ${moduleName}`} />
      <SaveModalComponent
        selectedTreeId={selectedTreeId}
        listName={listName}
        moduleName={moduleName}
        show={state.toggle.toggleUpdate}
        data={state.trxValue}
        onCloseClick={() => handleActions("update")}
        accessRights={accessRights}
      />

      <ModernAuditLogsModal
        show={state.toggle.toggleLogs}
        title="Audit Logs"
        transactionId={state?.trxValue?.[columnKey] || 0}
        queryArg={{ logType: logType || "" }}
        idKey="referenceId"
        onClose={() => handleActions("logs")}
      />

      <DeleteModal
        title={`Delete ${moduleName} - ${state?.trxValue?.[codeField]}`}
        show={state?.toggle?.toggleDelete}
        onDeleteClick={handleDeleteItem}
        onCloseClick={() => handleActions("delete")}
      />
      <div>
        <Row>
          <Col lg="3" xl="3">
            <Card style={isMobile ? {} : { minHeight: "74vh" }}>
              <div className="card-body ps-0">{TreeViewComponent}</div>
            </Card>
          </Col>
          {console.log("RODEL", selectedTreeId ?? 0)}
          <Col lg="9" xl="9">
            <Card style={isMobile ? {} : { minHeight: "74vh" }}>
              <div className="card-body p-0">
                <CardHeader>
                  <Row>
                    <Col lg={6}>
                      <h5 className="card-title mb-0">
                        List of {(selectedTreeId ?? 0) === 0 ? "" : `${title} under`}{" "}
                        <span className="text-success fw-500">{listName}</span>
                      </h5>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <TableToolbar
                    handleCreate={
                      hasWriteAccess(accessRights) ? () => handleActions("update", { [parentId]: selectedTreeId, [parentName]: listName }) : undefined
                    }
                    handleExport={() => handleActions("export")}
                    handleSearch={(keyword) => updatePageState("search", keyword)}
                    buttonCreateName={`Add ${moduleName}`}
                  />
                </CardBody>
                <TableContainer
                  isLoading={isLoading}
                  columns={columns}
                  data={data?.items || []}
                  divClass="table-responsive mb-1"
                  tableClass="mb-0 align-top table-borderless"
                  theadClass="table-light"
                  pageSize={state.pageDetails.pageSize}
                  totalRecords={data?.totalRecords || 0}
                  currentPage={state.pageDetails.page}
                  onPageChange={(page) => updatePageState("pageChange", page)}
                  onSortChange={(field, order) => updatePageState("sortChange", { sortField: field, sortOrder: order })}
                  onPageSizeChange={(pageSize) => updatePageState("pageSizeChange", pageSize)}
                  renderExpandedRow={renderExpandedRow}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default TabbedStaticResourcePageTreeView;
