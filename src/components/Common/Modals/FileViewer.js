import React, { useState } from "react";
import {
    Modal,
    ModalBody,
    ModalHeader
} from "reactstrap";

import { getCurrentUser } from "@/helpers/session_helper";

const FileViewer = ({ data = null, originalUrl = null, show, moduleName, onCloseClick }) => {
    const [toggleExpand, setToggleExpand] = useState(false)

    const downloadFile = async (fileUrl) => {
        try {

            const link = document.createElement('a');
            link.href = fileUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (err) {
            console.error("Download failed:", err);
        }
    };

    return (
        <React.Fragment>
            <Modal
                modalClassName="flip"
                id="fileViewer"
                fullscreen={toggleExpand}
                isOpen={show}
                size="xl"
                toggle={onCloseClick}
                scrollable={false}
                centered
                backdrop="static"
            >
                <ModalHeader
                    className="pt-0 py-2 pt-2 bg-success-subtle d-flex align-items-center justify-content-between position-relative"
                    close={
                        <div className="d-flex align-items-center gap-2">
                            <button
                                type="button"
                                className="btn btn-sm"
                                title="Download"
                                onClick={() => downloadFile(originalUrl)}
                            >
                                <i className="ri-download-2-line text-bold" style={{ fontSize: "14px" }} />
                            </button>

                            <button
                                type="button"
                                className="btn btn-sm "
                                onClick={() => setToggleExpand(!toggleExpand)}
                                title="Expand"
                            >
                                {toggleExpand ? (
                                    <i
                                        className="ri-fullscreen-exit-line text-bold"
                                        style={{ fontSize: "14px" }}
                                    ></i>
                                ) : (
                                    <i
                                        className="ri-fullscreen-line text-bold"
                                        style={{ fontSize: "14px" }}
                                    ></i>
                                )}
                            </button>

                            <button
                                type="button"
                                className="btn-close"
                                onClick={onCloseClick}
                                aria-label="Close"
                            ></button>
                        </div>
                    }
                >
                    {moduleName}
                </ModalHeader>
                <ModalBody
                    className="p-0"
                    style={{ height: "calc(100vh - 150px)", overflow: "hidden" }}
                >
                    <iframe
                        src={`${data}#zoom=100`}
                        title={`${moduleName}`}
                        width="100%"
                        height="100%"
                        style={{ border: "none" }}
                    />
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default React.memo(FileViewer);