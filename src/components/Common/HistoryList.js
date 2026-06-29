import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";

import "@/assets/scss/modern-history.css";
import { AvatarIcon } from "@/components/Common/AvatarIcon";
import { DatePickerField } from "@/components/Common/Inputs";
import MultipleFileRenderer from "@/components/Common/MultipleFileRenderer";
import Section from "@/components/Common/Section";
import { formatDate, formatTime } from "@/helpers/date_helper";
import BlockchainIcon from "@/components/Common/BlockchainIcon";

import useInfiniteScroll from "../Hooks/useInfiniteScrollHook";
import { ExportButton } from "./Buttons";

const HistoryList = ({ transactionId, useLogsQuery, useExportQuery, startDate = null, idKey = "transactionId", queryArg = {}, title = "History" }) => {
  const { pageDetails, searchTerm, setSearchTerm, handleKeyDown, fetchNext } = useInfiniteScroll();
  const defaultValues = {
    dateTo: new Date().toISOString(),
    dateFrom: startDate,
  };

  const { control, reset, watch } = useForm({ defaultValues });

  const dateFrom = useWatch({ control, name: "dateFrom" });
  const dateTo = useWatch({ control, name: "dateTo" });

  const payload = { ...pageDetails, dateFrom, dateTo, [idKey]: transactionId, ...queryArg };
  const { data, isFetching } = useLogsQuery(payload, { refetchOnMountOrArgChange: true });

  const [exportFile, { isLoading: isExporting }] = useExportQuery?.(payload) ?? [null, { isLoading: false }];

  const items = data?.items ?? [];
  const totalRecords = data?.totalRecords ?? 0;
  const hasMore = items.length < totalRecords;

  useEffect(() => {
    reset(defaultValues);
  }, []);

  const handleExport = async () => {
    if (!exportFile) return;
    const res = await exportFile({ dateFrom, dateTo, [idKey]: transactionId, keyword: searchTerm, ...queryArg });
    toast(res ? `${title} was successfully downloaded.` : `${title} failed to download.`, {
      position: "top-right",
      hideProgressBar: false,
      closeOnClick: true,
      className: `${res ? "bg-success" : "bg-danger"} text-white`,
    });
  };

  return (
    <div className="pa-wrap">
      <div className="d-flex align-items-center justify-content-between">
        <Section title={title} />
      </div>

      <Row className="mt-10">
        <Col lg={4}>
          <div className="pa-datepicker">
            <DatePickerField
              control={control}
              name="dateFrom"
              label="Date From"
              placeholder="Date From..."
              options={{ maxDate: new Date() }}
              rules={{
                validate: (value) => {
                  const df = new Date(value);
                  const dtRaw = watch("dateTo");
                  if (!dtRaw) return true;
                  const dt = new Date(dtRaw);
                  if (isNaN(df.getTime()) || isNaN(dt.getTime())) return "Invalid date format";
                  if (df > dt) return "Date From should not be greater than Date To";
                  return true;
                },
              }}
            />
          </div>
        </Col>

        <Col lg={4}>
          <div className="pa-datepicker">
            <DatePickerField control={control} name="dateTo" label="Date To" placeholder="Date To..." options={{ maxDate: new Date() }} />
          </div>
        </Col>

        <Col lg={4}>
          <label className="pa-label">Search</label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div className="pa-search-box" style={{ flex: 1 }}>
              <i className="bx bx-search-alt pa-search-icon" />
              <input
                className="pa-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search here..."
              />
            </div>
            {useExportQuery && (
              <ExportButton isExporting={isExporting} onClick={handleExport} />
            )}
          </div>
        </Col>
      </Row>

      <hr className="pa-divider" style={{ marginBottom: "-16px" }} />

      <Row>
        <div
          id="pa-scrollable"
          className="pa-scroll-area pa-timeline"
          style={{ marginLeft: "16px", marginRight: "16px", height: "60vh", overflow: "auto", width: "100%" }}>
          <InfiniteScroll
            dataLength={items.length}
            next={() => fetchNext(hasMore, isFetching)}
            hasMore={hasMore && !isFetching}
            scrollableTarget="pa-scrollable">
            {items?.length ? (
              items.map((logData, index) => (
                <div key={index} className="pa-item">
                  <div className="pa-avatar">
                    <AvatarIcon marginRight="m-0" name={logData.fullName} avatarImg={logData?.avatar} color={logData.badgeColor} />
                  </div>

                  <div
                    className="pa-item-card"
                    style={{ position: "relative" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 4px 14px rgba(64,81,137,0.1)";
                      e.currentTarget.style.borderColor = "#c8cdd5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "var(--pa-shadow)";
                      e.currentTarget.style.borderColor = "var(--pa-border-card)";
                    }}>
                    <div className="pa-item-header">
                      <div className="pa-item-name-row">
                        <span className="pa-item-name">{logData.fullName}</span>
                        {logData.badgeText && (
                          <span className={`badge bg-${logData.badgeColor}-subtle text-${logData.badgeColor} align-middle`}>{logData.badgeText}</span>
                        )}
                      </div>
                      <span className="pa-ts">
                        <i className="mdi mdi-clock-outline" />
                        {formatDate(logData.logDate)}, {formatTime(logData.logDate)}
                      </span>
                    </div>

                    {logData.title && <small className="pa-item-subtitle">{logData.title}</small>}

                    {logData.description && <p className="pa-item-desc" dangerouslySetInnerHTML={{ __html: logData.description }} />}

                    {logData.remarks && <p className="pa-item-remarks" dangerouslySetInnerHTML={{ __html: `"${logData.remarks}"` }} />}

                    {logData.files?.length > 0 && (
                      <div className="mt-2">
                        <MultipleFileRenderer files={logData.files} />
                      </div>
                    )}

                    <div style={{ position: "absolute", bottom: "10px", right: "12px", opacity: 0.7 }}>
                      <BlockchainIcon
                        isValid={true}
                        //title={logData.securityHash ?? "No hash"}
                        size={20}
                      />
                    </div>

                  </div>
                </div>
              ))
            ) : (
              <div className="pa-empty">{isFetching ? "Loading..." : "No record found."}</div>
            )}
          </InfiniteScroll>
        </div>
      </Row>
    </div>
  );
};

export default HistoryList;
