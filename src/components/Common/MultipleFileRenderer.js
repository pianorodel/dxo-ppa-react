import React, { useState } from "react";
import { Row } from "reactstrap";

import { formatSize, getFileIconClass, getTypeIcon, isImageFile } from "@/constants/fileTypes";

import { DateTimeLabel } from "./DateTimeLabel";
import FileViewer from "./Modals/FileViewer";
import { PhotoViewer } from "./PhotoViewer";

const S3_BASE = process.env.REACT_APP_S3;

const getFullUrl = (path) => `${S3_BASE}${path}`;

const MultipleFileRenderer = ({
  files = [],
  showDocumentType = false,
  showDateUploaded = false,
}) => {
  const [openPrint, setOpenPrint] = useState(false);
  const [printUrl, setPrintUrl] = useState("");
  const [printName, setPrintName] = useState("");
  const [originalUrl, setOriginalUrl] = useState("");

  const handlePrint = React.useCallback(() => setOpenPrint(false), []);

  const openFileViewer = (file) => {
    const fullRoute = getFullUrl(file.original);
    const ext = file.fileName.split(".").pop().toLowerCase();

    // GOOGLE DOCS VIEWER https://docs.google.com/viewer?url=${encodeURIComponent(fullRoute)}&embedded=true

    const viewerUrl = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)
      ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullRoute)}`
      : fullRoute;

    // const viewerUrl = [
    //   "doc",
    //   "docx",
    //   "xls",
    //   "xlsx",
    //   "ppt",
    //   "pptx",
    //   "pdf",
    //   "txt",
    // ].includes(ext)
    //   ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullRoute)}`
    //   : fullRoute;

    setPrintUrl(viewerUrl);
    setOriginalUrl(getFullUrl(file.original));
    setPrintName(file.fileName);
    setOpenPrint(true);
  };

  return (
    <>
      <FileViewer data={printUrl} originalUrl={originalUrl} onCloseClick={handlePrint} show={openPrint} moduleName={`View: ${printName}`} />
      <Row className="g-2">
        {files.map((file) => {
          const isImg = isImageFile(file.fileName);
          const previewSrc = file.thumbnail || file.small || file.medium || file.original;
          const fullSrc = file.large || file.medium || file.small || file.original;

          return (
            <div className="col-auto cursor-pointer" key={file.fileId}>
              {isImg ? (
                <PhotoViewer src={getFullUrl(fullSrc)}>
                  <div
                    className="d-flex border border-dashed p-2 rounded position-relative align-items-center cursor-pointer"
                    // style={{ minWidth: 200 }}
                    title={file.fileName}>
                    <div className="flex-shrink-0">
                      <img src={getFullUrl(previewSrc)} alt={file.fileName} style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }} />
                    </div>
                    <div className="flex-grow-1 ms-2">
                      <div>{file.fileName}</div>
                      {showDocumentType && <div className="text-muted fs-12">{file.documentType}</div>}
                      {showDateUploaded && file.dateUploaded && (
                        <DateTimeLabel value={file.dateUploaded} />
                      )}
                      <div>{formatSize(file.fileSize)}</div>
                    </div>
                  </div>
                </PhotoViewer>
              ) : (
                <div
                  className="d-flex border border-dashed p-2 rounded position-relative align-items-center cursor-pointer"
                  onClick={() => openFileViewer(file)}
                  title={file.fileName}>
                  <div className="flex-shrink-0">
                    {getTypeIcon(file.fileName) ? (
                      <img
                        src={getTypeIcon(file.fileName)}
                        className="img-thumbnail avatar-sm"
                        style={{ width: "40px", height: "40px" }}
                        alt={file.fileName}
                      />
                    ) : (
                      <i className={`fs-17 ${getFileIconClass(file.fileName)}`}></i>
                    )}
                  </div>
                  <div className="flex-grow-1 ms-2">
                    <div>{file.fileName}</div>
                    {showDocumentType && <div className="text-muted fs-12">{file.documentType}</div>}
                    {showDateUploaded && file.dateUploaded && (
                      <DateTimeLabel value={file.dateUploaded} />
                    )}
                    <div>{formatSize(file.fileSize)}</div>
                    {/*                 
                    <h6 className="mb-1 text-truncate" style={{ maxWidth: 250, paddingRight: "10px" }}>
                      {file.fileName}
                    </h6>
                    <p className="text-muted mb-0 fs-12">{file.documentType}</p>
                    <p className="mb-0 fs-12">{formatSize(file.fileSize)}</p>
                    <DateTimeLabel value={file.dateUploaded} /> */}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </Row>
    </>
  );
};

export default React.memo(MultipleFileRenderer);
