import { useListUnreadNotificationsQuery } from "@/api/Endpoints/Core/Socials/Notifications";
import bell from "@/assets/images/svg/bell.svg";
import useCustomHook from "@/components/Hooks/useCustomHook";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { Spinner } from "reactstrap";
import { AvatarIcon } from './AvatarIcon';

const NotificationData = ({ onClickNotification }) => {
    const { state, customFunction } = useCustomHook();
    const { data, isLoading } = useListUnreadNotificationsQuery(state.pageDetails, { refetchOnMountOrArgChange: true });
    const rowData = data?.items || [];

    return (
        <>
            {isLoading ? <center className="my-5"><Spinner size="sm" className="me-1" /></center> :
                rowData.length > 0
                    ? rowData?.map((item, index) => (
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
                    :
                    <>
                        <div className="w-25 w-sm-50 pt-3 mx-auto">
                            <img src={bell} className="img-fluid" alt="user-pic" />
                        </div>
                        <div className="text-center pb-5 mt-2">
                            <h6 className="fs-18 fw-semibold lh-base">Hey! You have no new<br />messages.</h6>
                        </div>
                    </>
            }
        </>
    );
};

export default NotificationData;

