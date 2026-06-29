import moment from "moment";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { Card, CardBody, Col, Input, Row } from "reactstrap";

import { AvatarIcon } from "@/components/Common/AvatarIcon";
import useInfiniteScroll from "@/components/Hooks/useInfiniteScrollHook";

import { useListAllNotificationsQuery } from "@/api/Endpoints/Core/Socials/Notifications";

const NotificationDataListAll = ({ onClickNotification }) => {
    const { pageDetails, searchTerm, setSearchTerm, handleKeyDown, fetchNext } = useInfiniteScroll();
    const { data, isFetching } = useListAllNotificationsQuery({ ...pageDetails }, { refetchOnMountOrArgChange: true });

    const items = data?.items ?? [];
    const totalRecords = data?.totalRecords ?? 0;
    const hasMore = items.length < totalRecords;

    return (
        <>
            <Card>
                <CardBody className="border border-dashed border-end-0 border-start-0">
                    <Row className={"mt-10"}>
                        <Col sm={6}>
                            <div
                                className={"search-box me-2 mb-2 d-inline-block w-100"}
                            >
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
                                height={'570px'}
                                style={{ overflowX: 'clip' }}
                            >
                                {Array.isArray(items) &&
                                    items.length > 0 ? (
                                    items.map((item, index) => (
                                        <React.Fragment key={index}>
                                            <div className="text-reset notification-item d-block dropdown-item position-relative" onClick={() => onClickNotification(item)}>
                                                <div className="d-flex">
                                                    <AvatarIcon name={item.createdByName} avatarImg={item?.createdByAvatar} />
                                                    <div className="flex-grow-1">
                                                        <Link to="#" className="stretched-link">
                                                            <h6 className="mt-0 mb-1 fs-13 fw-semibold">{item.createdByName}</h6>
                                                        </Link>
                                                        <div className="fs-13 text-muted">
                                                            <div className="mb-1" dangerouslySetInnerHTML={{ __html: item.message }} />
                                                        </div>
                                                        <p className="mb-0 fs-11 fw-medium text-uppercase text-muted">
                                                            <span><i className="mdi mdi-clock-outline"></i> {moment(item.createdDate).fromNow(true)} ago</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <p className="text-muted">No notification available.</p>
                                )}
                            </InfiniteScroll>
                        </div>
                    </Row>
                </CardBody> </Card>
        </>
    );
};

export default NotificationDataListAll;

