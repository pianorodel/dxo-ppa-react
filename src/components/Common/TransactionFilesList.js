import React, { useState } from "react";
import { Button, ButtonGroup, Col, Input, Row } from "reactstrap";

import "@/assets/scss/modern-file-list.css";
import { DateTimeLabel } from "@/components/Common/DateTimeLabel";
import FileViewer from "@/components/Common/Modals/FileViewer";
import { PhotoViewer } from "@/components/Common/PhotoViewer";
import Section from "@/components/Common/Section";
import { formatSize, getExtension, getTypeIcon, isImageFile } from "@/constants/fileTypes";

const S3_BASE = process.env.REACT_APP_S3;
const getFullUrl = (path) => `${S3_BASE}${path}`;

const groupByGroupName = (files, defaultDocumentType) =>
  files.reduce((acc, file) => {
    const key = file.groupName || file.documentType || defaultDocumentType;
    (acc[key] = acc[key] || []).push(file);
    return acc;
  }, {});

const TransactionFilesList = ({
  transactionId,
  useFilesQuery,
  idKey = "transactionId",
  queryArg = {},
  title = "Files",
  emptyMessage = "There are no files uploaded.",
  defaultDocumentType = "Transaction Files"
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState("dateUploaded");
  const [sortOrder, setSortOrder] = useState("desc");

  const [openViewer, setOpenViewer] = useState(false);
  const [viewerUrl, setViewerUrl] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");
  const [viewerName, setViewerName] = useState("");

  const {
    data,
    refetch: refetchFiles,
    isFetching,
  } = useFilesQuery(
    { [idKey]: transactionId, ...queryArg, keyword },
    { skip: !transactionId, refetchOnMountOrArgChange: true }
  );

  const files = isFetching ? [] : data?.returnData || [];

  const sortedFiles = [...files].sort((a, b) => {
    let cmp = 0;
    if (sortBy === "fileName") {
      cmp = (a.fileName || "").toLowerCase().localeCompare((b.fileName || "").toLowerCase());
    } else if (sortBy === "dateUploaded") {
      cmp = new Date(a.dateUploaded || 0) - new Date(b.dateUploaded || 0);
    }
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const handleChangeSearch = (e) => setSearchTerm(e.target.value);

  const handleKeySearchDown = (e) => {
    if (e.key === "Enter") setKeyword(searchTerm);
    if (e.key === "Escape") {
      setSearchTerm("");
      setKeyword("");
    }
  };

  const handleSortChange = (key) => {
    if (sortBy === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const openFileViewer = (file) => {
    const fullRoute = getFullUrl(file.original);
    const ext = getExtension(file.fileName);
    const url = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)
      ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullRoute)}`
      : fullRoute;

    setViewerUrl(url);
    setOriginalUrl(getFullUrl(file.original));
    setViewerName(file.fileName);
    setOpenViewer(true);
  };

  const handleCloseViewer = React.useCallback(() => setOpenViewer(false), []);

  const hasNoFiles = !files || files.length === 0;
  const hasNoSearchResults = files.length === 0 && searchTerm.trim() !== "";
  const grouped = groupByGroupName(sortedFiles, defaultDocumentType);

  return (
    <div className="pf-wrap">
      <FileViewer
        data={viewerUrl}
        originalUrl={originalUrl}
        onCloseClick={handleCloseViewer}
        show={openViewer}
        moduleName={`View: ${viewerName}`}
      />

      <div style={{ minHeight: "60vh" }}>
        <Section title={title} />
        <Row className="align-items-center mb-4">
          <Col sm={5}>
            <div className="search-box d-inline-block w-100">
              <Input
                className="form-control bg-light border-light"
                placeholder="Search here..."
                type="text"
                value={searchTerm}
                onChange={handleChangeSearch}
                onKeyDown={handleKeySearchDown}
              />
              <i
                className="bx bx-search-alt search-icon"
                style={{ cursor: "pointer" }}
                onClick={() => setKeyword(searchTerm)}
              />
            </div>
          </Col>
          <Col sm={7}>
            <div className="d-flex align-items-center justify-content-end gap-2">
              <span className="text-muted fs-13 me-2">Sort by:</span>
              <ButtonGroup size="sm">
                <Button
                  color={sortBy === "fileName" ? "primary" : "light"}
                  onClick={() => handleSortChange("fileName")}
                  className="d-flex align-items-center gap-1">
                  File Name
                  {sortBy === "fileName" && (
                    <i className={`bx bx-${sortOrder === "asc" ? "up" : "down"}-arrow-alt fs-14`} />
                  )}
                </Button>
                <Button
                  color={sortBy === "dateUploaded" ? "primary" : "light"}
                  onClick={() => handleSortChange("dateUploaded")}
                  className="d-flex align-items-center gap-1">
                  Date Uploaded
                  {sortBy === "dateUploaded" && (
                    <i className={`bx bx-${sortOrder === "asc" ? "up" : "down"}-arrow-alt fs-14`} />
                  )}
                </Button>
              </ButtonGroup>
            </div>
          </Col>
        </Row>

        {!isFetching && hasNoFiles ? (
          <div className="text-center py-5">
            <h5 className="fs-15 mt-2">{searchTerm ? "No Files Found" : "No Files Yet"}</h5>
            <p className="text-muted fs-13">
              {searchTerm ? `No files match your search "${searchTerm}"` : emptyMessage}
            </p>
            {hasNoSearchResults && (
              <button
                className="btn btn-sm btn-soft-primary mt-2"
                onClick={() => {
                  setSearchTerm("");
                  setKeyword("");
                }}>
                Clear Search
              </button>
            )}
          </div>
        ) : (
          Object.entries(grouped).map(([groupName, groupFiles]) => (
            <div key={groupName} className="pf-group">
              <div className="pf-group-header">
                <i className="bx bx-folder-open pf-group-icon" />
                <span className="pf-group-name">{groupName}</span>
                <span className="pf-group-count">{groupFiles.length}</span>
              </div>

              {groupFiles.map((file) => {
                const isImg = isImageFile(file.fileName);
                const previewSrc = file.thumbnail || file.small || file.medium || file.original;
                const fullSrc = file.large || file.medium || file.small || file.original;
                const typeIcon = getTypeIcon(file.fileName);

                const RowContent = (
                  <div
                    key={file["fileId"]}
                    className="pf-file-row"
                    onClick={!isImg ? () => openFileViewer(file) : undefined}
                    title={file.fileName}>
                    <div className="pf-file-icon-wrap">
                      {isImg ? (
                        <img src={getFullUrl(previewSrc)} alt={file.fileName} />
                      ) : typeIcon ? (
                        <img src={typeIcon} alt={file.fileName} className="icon" />
                      ) : (
                        <i className="ri-file-line" style={{ fontSize: "1.3rem", color: "var(--pf-text-muted)" }} />
                      )}
                    </div>

                    <div className="pf-file-info">
                      <div className="pf-file-name" title={file.fileName}>
                        {file.fileName}
                      </div>
                      <div className="pf-file-meta">
                        <span>{formatSize(file.fileSize)}</span>
                        <span className="dot">
                          <DateTimeLabel value={file.dateUploaded} />
                        </span>
                      </div>
                    </div>
                  </div>
                );

                return isImg ? (
                  <PhotoViewer key={file["fileId"]} src={getFullUrl(fullSrc)}>
                    {RowContent}
                  </PhotoViewer>
                ) : (
                  RowContent
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionFilesList;