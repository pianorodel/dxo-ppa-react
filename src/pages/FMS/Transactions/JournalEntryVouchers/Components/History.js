import InfiniteScroll from "react-infinite-scroll-component";
import { Card, CardBody, Col, Input, Row } from "reactstrap";

import { AvatarIcon } from "@/components/Common/AvatarIcon";
import { ExportButton } from "@/components/Common/Buttons";
import ExportExcelModal from "@/components/Common/Modals/ExportExcelModal";
import MultipleFileRenderer from "@/components/Common/MultipleFileRenderer";
import useCustomHook from "@/components/Hooks/useCustomHook";
import useInfiniteScroll from "@/components/Hooks/useInfiniteScrollHook";
import { useNotificationModal } from "@/context/notificationContext";
import { formatDate, formatTime } from "@/helpers/date_helper";

import {
  useExportJournalEntryVoucherLogsMutation,
  useGetJournalEntryVoucherLogsQuery,
} from "@/api/Endpoints/FMS/Transactions/JournalEntryVoucher/JournalEntryVoucherLogs";

const MODULE_NAME = "Journal Entry Voucher";

const History = ({ parentId, isModalLogs, isFullScreen }) => {
  const { notification } = useNotificationModal();
  const { state, customFunction } = useCustomHook({ history: [] });
  const { pageDetails, searchTerm, setSearchTerm, handleKeyDown, fetchNext } = useInfiniteScroll();
  const { data, isFetching } = useGetJournalEntryVoucherLogsQuery(
    { ...pageDetails, journalEntryVoucherId: parentId },
    { skip: !parentId, refetchOnMountOrArgChange: true },
  );
  const [exportList, { isLoading: isExporting }] = useExportJournalEntryVoucherLogsMutation();

  const items = data?.items ?? [];
  const totalRecords = data?.totalRecords ?? 0;
  const hasMore = items.length < totalRecords;

  const handleExport = async (e) => {
    if (e) {
      const res = await exportList({
        ...state.pageDetails,
        journalEntryVoucherId: parentId,
      });
      if (res) {
        notification({
          type: "success",
          title: MODULE_NAME,
          header: `Export List of ${MODULE_NAME} History`,
          message: `${MODULE_NAME} were exported successfully.`,
        });
      } else {
        notification({ type: "error", title: MODULE_NAME, message: `Failed to export ${MODULE_NAME}.` });
      }
    }
    customFunction.updateToggle("toggleExport");
  };

  return (
    <div>
      <ExportExcelModal
        show={state.toggle.toggleExport}
        onCloseClick={handleExport}
        data={state?.history}
        title={"Export List of Journal Entry Voucher Request Logs"}
      />

      <Card>
        <CardBody>
          <div className="d-flex align-items-center mb-4">
            <h5 className="card-title flex-grow-1 mb-0">History</h5>
            <div className="flex-shrink-0">
              <ExportButton isExporting={isExporting} onClick={() => customFunction.updateToggle("toggleExport")} />
            </div>
          </div>

          <Row>
            <Col xl={12}>
              <Card>
                <CardBody className="border border-dashed border-end-0 border-start-0">
                  <Row className={"mt-10"}>
                    <Col sm={6}>
                      <div className={"search-box me-2 mb-2 d-inline-block w-100"}>
                        <Input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="form-control bg-light border-light"
                          placeholder={"Search here..."}
                        />
                        <i className="bx bx-search-alt search-icon"></i>
                      </div>
                    </Col>
                  </Row>

                  <Row className="mt-10">
                    <div className="acitivity-timeline no-scrollbar-container">
                      <InfiniteScroll
                        dataLength={items.length}
                        next={() => fetchNext(hasMore, isFetching)}
                        hasMore={hasMore && !isFetching}
                        height={isModalLogs ? (isFullScreen ? "650px" : "500px") : "800px"}
                        style={{ overflowX: "clip" }}>
                        {Array.isArray(items) && items.length > 0 ? (
                          items.map((log, index) => (
                            <div className="acitivity-item py-3 d-flex" key={index}>
                              <AvatarIcon name={log.fullName} avatarImg={log?.avatar} color={log.badgeColor} />
                              <div className="flex-grow-1 ms-3">
                                <h6 className="mb-1">{log.fullName}</h6>
                                <small className="text-muted mb-2">
                                  {log.title}{" "}
                                  {log.badgeText && (
                                    <span className={`badge bg-${log.badgeColor}-subtle text-${log.badgeColor} align-middle`}>{log.badgeText}</span>
                                  )}
                                </small>
                                <p
                                  className="mb-2"
                                  dangerouslySetInnerHTML={{
                                    __html: log.description,
                                  }}
                                />
                                {log.remarks && (
                                  <p
                                    className="mb-2 fst-italic"
                                    dangerouslySetInnerHTML={{
                                      __html: log.remarks,
                                    }}
                                  />
                                )}
                                <small className="mb-0">
                                  {formatDate(log.logDate)},<small className="text-muted"> {formatTime(log.logDate)}</small>
                                </small>
                                <div className="mt-2">
                                  <MultipleFileRenderer files={log.files} />
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-muted">No history available.</p>
                        )}
                      </InfiniteScroll>
                    </div>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

export default History;
