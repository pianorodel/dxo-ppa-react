import { useListAllNotificationsQuery } from "@/api/Endpoints/Core/Socials/Notifications";
import { formatDate, formatTime } from "@/helpers/date_helper";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import {
    Input,
    Modal,
    ModalBody,
    ModalHeader,
    Row
} from "reactstrap";
import { AvatarIcon } from "../AvatarIcon";
import useInfiniteScroll from "@/components/Hooks/useInfiniteScrollHook";

const ViewAllNotificationModal = ({ show, onCloseClick }) => {
    const [toggleExpand, setToggleExpand] = useState(false);
    const { pageDetails, searchTerm, setSearchTerm, handleKeyDown, fetchNext } = useInfiniteScroll();
    const { data, isFetching } = useListAllNotificationsQuery(pageDetails, { skip: !show, refetchOnMountOrArgChange: true });

    const items = data?.items ?? [];
    const totalRecords = data?.totalRecords ?? 0;
    const hasMore = items.length < totalRecords;

    const NotificationItem = ({ logData }) => (
        <div className="acitivity-item py-3 d-flex">
            <AvatarIcon
                name={logData.createdByName}
                avatarImg={logData?.createdByAvatar}
                color={logData.badgeColor}
            />
            <div className="flex-grow-1 ms-3">
                <h6 className="mb-1">{logData.createdByName}</h6>
                <small className="text-muted mb-2">{logData.title}</small>
                <p
                    className="mb-2"
                    dangerouslySetInnerHTML={{ __html: logData.message }}
                />
                <small className="mb-0">
                    {formatDate(logData.createdDate)},
                    <small className="text-muted"> {formatTime(logData.createdDate)}</small>
                </small>
            </div>
        </div>
    );

    return (
        <Modal
            fullscreen={toggleExpand}
            modalClassName="flip"
            id="saveRole"
            size="xl"
            isOpen={show}
            toggle={onCloseClick}
            centered
        >
            <ModalHeader
                className="p-3 bg-success-subtle d-flex align-items-center justify-content-between position-relative"
                close={
                    <div className="d-flex align-items-center gap-2">
                        <button
                            type="button"
                            className="btn btn-sm"
                            onClick={() => setToggleExpand(!toggleExpand)}
                            title="Expand"
                        >
                            <i
                                className={`ri-fullscreen${toggleExpand ? "-exit" : ""}-line text-bold`}
                                style={{ fontSize: "14px" }}
                            />
                        </button>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onCloseClick}
                            aria-label="Close"
                        />
                    </div>
                }
            >
                <div className="text-center w-100 pe-5">All Notifications</div>
            </ModalHeader>
            <ModalBody>
                <div className="d-flex justify-content-end">
                    <div className="search-box me-2 mb-2 d-inline-block w-50">
                        <Input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="form-control bg-light border-light"
                            placeholder="Search here... (Press Enter to search)"
                        />
                        <i className="bx bx-search-alt search-icon" />
                    </div>
                </div>
                <Row style={{ marginTop: "30px" }}>
                    <InfiniteScroll
                        dataLength={items.length}
                        next={() => fetchNext(hasMore, isFetching)}
                        hasMore={hasMore && !isFetching}
                        scrollableTarget="scrollableDiv"
                        height={toggleExpand ? "75vh" : 500}
                    >
                        <div id="scrollableDiv" className="acitivity-timeline">
                            {items.length ? (
                                items.map((logData, index) => (
                                    <NotificationItem key={`${logData.notificationId}-${index}`} logData={logData} />
                                ))
                            ) : (
                                <center>
                                    <span className="text-muted">
                                        {isFetching ? "Loading..." : "No record found"}
                                    </span>
                                </center>
                            )}
                        </div>
                    </InfiniteScroll>
                </Row>
            </ModalBody>
        </Modal>
    );
};

export default ViewAllNotificationModal;
