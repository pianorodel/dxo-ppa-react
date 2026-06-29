import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from "reactstrap";
import SimpleBar from "simplebar-react";

import useCustomHook from "@/components/Hooks/useCustomHook";
import { useSignalRListener } from "@/components/Hooks/useSignalRListener";
import { SIGNALR_MESSAGE_TYPES } from "@/constants/signalrMessageTypes";
import { useUnreadNotificationCount } from "@/context/unreadNotificationCountContext";

import {
  AllotmentViewDetails, AppropriationViewDetails, CashDisbursementsViewDetails, CollectionsViewDetails, DepositsViewDetails,
  ObligationsViewDetails, OrderOfPayMentsViewDetails,
} from "@/pages/FMS/Transactions/TransactionsViewDetails";
import { AccessRequestViewDetails } from "@/pages/Security/TransactionsViewDetails";

import NotificationData from "./NotificationData";

import { useReadNotificationsMutation } from "@/api/Endpoints/Core/Socials/Notifications";

const NOTIFICATION_TYPES = {
  NOTIFICATION: "Notification",
  CORE_TRANSACTIONS_ACCESSREQUESTS: "CORE_TRANSACTIONS_ACCESSREQUESTS",

  FMS_TRANSACTIONS_ALLOTMENTS: "FMS_TRANSACTIONS_ALLOTMENTS",
  FMS_TRANSACTIONS_APPROPRIATIONS: "FMS_TRANSACTIONS_APPROPRIATIONS",
  FMS_TRANSACTIONS_CASHDISBURSEMENTS: "FMS_TRANSACTIONS_CASHDISBURSEMENTS",
  FMS_TRANSACTIONS_COLLECTIONS: "FMS_TRANSACTIONS_COLLECTIONS",
  FMS_TRANSACTIONS_DEPOSITS: "FMS_TRANSACTIONS_DEPOSITS",
  FMS_TRANSACTIONS_OBLIGATIONS: "FMS_TRANSACTIONS_OBLIGATIONS",
  FMS_TRANSACTIONS_ORDEROFPAYMENTS: "FMS_TRANSACTIONS_ORDEROFPAYMENTS",
};

const NotificationDropdown = () => {
  const { state, customFunction } = useCustomHook();
  const [isNotificationDropdown, setIsNotificationDropdown] = useState(false);
  const [notificationId, setNotificationId] = useState(null);
  const { count, decrementCount, incrementCount } = useUnreadNotificationCount();

  const [readNotification] = useReadNotificationsMutation();

  useEffect(() => {
    if (notificationId) {
      readNotification({ notificationId });
    }
  }, [notificationId, readNotification]);

  const navigate = useNavigate();

  useSignalRListener({
    type: SIGNALR_MESSAGE_TYPES.NOTIFICATION,
    handler: () => {
      incrementCount()
    },
  });

  const toggleNotificationDropdown = (data) => {
    setIsNotificationDropdown(!isNotificationDropdown);
  };

  const handleClickNotification = (data) => {

    const notificationType = data.notificationType;
    setNotificationId(data?.notificationId)
    decrementCount()

    const toggleMap = {
      [NOTIFICATION_TYPES.CORE_TRANSACTIONS_ACCESSREQUESTS]: "toggleViewAccessRequest",

      [NOTIFICATION_TYPES.FMS_TRANSACTIONS_ALLOTMENTS]: "toggleViewAllotments",
      [NOTIFICATION_TYPES.FMS_TRANSACTIONS_APPROPRIATIONS]: "toggleViewAppropriations",
      [NOTIFICATION_TYPES.FMS_TRANSACTIONS_CASHDISBURSEMENTS]: "toggleViewCashDisbursements",
      [NOTIFICATION_TYPES.FMS_TRANSACTIONS_COLLECTIONS]: "toggleViewCollections",
      [NOTIFICATION_TYPES.FMS_TRANSACTIONS_DEPOSITS]: "toggleViewDeposits",
      [NOTIFICATION_TYPES.FMS_TRANSACTIONS_OBLIGATIONS]: "toggleViewObligations",
      [NOTIFICATION_TYPES.FMS_TRANSACTIONS_ORDEROFPAYMENTS]: "toggleViewOrderOfPayments",
    };

    if (toggleMap[notificationType]) return customFunction.updateToggle(toggleMap[notificationType], data);

  };

  const handleViewAllNotification = async () => {
    setIsNotificationDropdown(false)
    navigate("/notifications");
  };

  return (
    <React.Fragment>

      {state.toggle.toggleViewAccessRequest && <AccessRequestViewDetails
        data={{ accessRequestId: state.trxValue?.referenceId }}
        show={state?.toggle?.toggleViewAccessRequest}
        onCloseClick={() => customFunction.updateToggle("toggleViewAccessRequest")}
        parentKey={1}
        onUpdateParentKey={() => { }}
      />}

      {state.toggle.toggleViewAllotments && <AllotmentViewDetails
        data={{ allotmentId: state.trxValue?.referenceId }}
        show={state?.toggle?.toggleViewAllotments}
        onCloseClick={() => customFunction.updateToggle("toggleViewAllotments")}
        parentKey={1}
        onUpdateParentKey={() => { }}
      />}

      {state.toggle.toggleViewAppropriations && <AppropriationViewDetails
        data={{ appropriationId: state.trxValue?.referenceId }}
        show={state?.toggle?.toggleViewAppropriations}
        onCloseClick={() => customFunction.updateToggle("toggleViewAppropriations")}
        parentKey={1}
        onUpdateParentKey={() => { }}
      />}

      {state.toggle.toggleViewCashDisbursements && <CashDisbursementsViewDetails
        data={{ cashDisbursementId: state.trxValue?.referenceId }}
        show={state?.toggle?.toggleViewCashDisbursements}
        onCloseClick={() => customFunction.updateToggle("toggleViewCashDisbursements")}
        parentKey={1}
        onUpdateParentKey={() => { }}
      />}

      {state.toggle.toggleViewCollections && <CollectionsViewDetails
        data={{ collectionId: state.trxValue?.referenceId }}
        show={state?.toggle?.toggleViewCollections}
        onCloseClick={() => customFunction.updateToggle("toggleViewCollections")}
        parentKey={1}
        onUpdateParentKey={() => { }}
      />}

      {state.toggle.toggleViewDeposits && <DepositsViewDetails
        data={{ depositId: state.trxValue?.referenceId }}
        show={state?.toggle?.toggleViewDeposits}
        onCloseClick={() => customFunction.updateToggle("toggleViewDeposits")}
        parentKey={1}
        onUpdateParentKey={() => { }}
      />}

      {state.toggle.toggleViewObligations && <ObligationsViewDetails
        data={{ obligationId: state.trxValue?.referenceId }}
        show={state?.toggle?.toggleViewObligations}
        onCloseClick={() => customFunction.updateToggle("toggleViewObligations")}
        parentKey={1}
        onUpdateParentKey={() => { }}
      />}

      {state.toggle.toggleViewOrderOfPayments && <OrderOfPayMentsViewDetails
        data={{ orderOfPaymentId: state.trxValue?.referenceId }}
        show={state?.toggle?.toggleViewOrderOfPayments}
        onCloseClick={() => customFunction.updateToggle("toggleViewOrderOfPayments")}
        parentKey={1}
        onUpdateParentKey={() => { }}
      />}

      <Dropdown isOpen={isNotificationDropdown} toggle={toggleNotificationDropdown} className="topbar-head-dropdown ms-1 header-item">
        <DropdownToggle type="button" tag="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
          <i className="bx bx-bell fs-22"></i>
          {count > 0 ? (
            <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-danger">
              {count}
              <span className="visually-hidden">unread messages</span>
            </span>
          ) : null}
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
          <div className="dropdown-head bg-primary bg-pattern rounded-top">
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h6 className="m-0 fs-16 fw-semibold text-white"> Notifications </h6>
                </Col>
                {count > 0 ? (
                  <div className="col-auto dropdown-tabs">
                    <span className="badge bg-danger text-white fs-13">{count}</span>
                  </div>
                ) : null}
              </Row>
            </div>
          </div>

          <SimpleBar style={{ maxHeight: "300px" }} className="pe-2">
            {isNotificationDropdown && <NotificationData onClickNotification={handleClickNotification} />}

            <div className="my-3 text-center">
              <button onClick={handleViewAllNotification} type="button" className="btn btn-soft-success waves-effect waves-light">
                View All Notifications <i className="ri-arrow-right-line align-middle"></i>
              </button>
            </div>
          </SimpleBar>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default NotificationDropdown;
