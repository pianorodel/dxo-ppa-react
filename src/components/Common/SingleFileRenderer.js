import React, { useState } from "react";

import { formatSize, getTypeIcon, isImageFile } from "@/constants/fileTypes";
import FileViewer from "./Modals/FileViewer";
import { PhotoViewer } from "./PhotoViewer";

const S3_BASE = process.env.REACT_APP_S3;
const getFullUrl = (path) => `${S3_BASE}${path}`;
const getExt     = (path = "") => (path.split(".").pop() || "").toLowerCase();
const getBaseName = (path = "") => path.split("/").pop();

/**
 * SingleFileRenderer
 *
 * Props:
 *  - path   {string}  S3 path string from API (e.g. "dev/dxo/hris/file.pdf")
 *  - label  {string}  Optional label shown above the file card
 */
const SingleFileRenderer = ({ path, label, fileName }) => {
    const [openViewer, setOpenViewer] = useState(false);
    const [viewerUrl, setViewerUrl]   = useState("");
    const [viewerName, setViewerName] = useState("");
    const [originalUrl, setOriginalUrl] = useState("");

    if (!path) return null;

    const name    = getBaseName(path);
    const ext     = getExt(path);
    const fullUrl = getFullUrl(path);
    const isImg   = isImageFile(name);

    const handleOpen = () => {
        const resolved = ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)
            ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(fullUrl)}`
            : fullUrl;
        setViewerUrl(resolved);
        setOriginalUrl(fullUrl);
        setViewerName(name);
        setOpenViewer(true);
    };

    const iconSrc = getTypeIcon(name);

    const FileCard = (
        <div
            className="d-flex border border-dashed p-2 rounded position-relative align-items-center cursor-pointer"
            title={name}
            style={{ cursor: "pointer" }}
        >
            <div className="flex-shrink-0">
                {isImg ? (
                    <img
                        src={fullUrl}
                        alt={fileName}
                        style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }}
                    />
                ) : iconSrc ? (
                    <img
                        src={iconSrc}
                        className="img-thumbnail avatar-sm"
                        style={{ width: 40, height: 40 }}
                        alt={fileName}
                    />
                ) : (
                    <i className="ri-file-line fs-17" />
                )}
            </div>
            <div className="flex-grow-1 ms-2" style={{ minWidth: 0 }}>
                <div style={{
                    fontSize: 13, fontWeight: 600,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                    {fileName}
                </div>
                {label && (
                    <div className="text-muted" style={{ fontSize: 11 }}>{label}</div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <FileViewer
                data={viewerUrl}
                originalUrl={originalUrl}
                onCloseClick={() => setOpenViewer(false)}
                show={openViewer}
                moduleName={`View: ${fileName}`}
            />

            {isImg ? (
                <PhotoViewer src={fullUrl}>
                    {FileCard}
                </PhotoViewer>
            ) : (
                <div onClick={handleOpen}>
                    {FileCard}
                </div>
            )}
        </>
    );
};

export default React.memo(SingleFileRenderer);