import { useEffect, useState } from "react";
import {
  Card, CardBody, CardHeader,
  Col, Container, Row
} from "reactstrap";

import BreadCrumb from "@/components/Common/BreadCrumb";
import useCustomHook from "@/components/Hooks/useCustomHook";
import { useUnreadNotificationCount } from "@/context/unreadNotificationCountContext";

import {
  CashDisbursementsViewDetails, CollectionsViewDetails, DepositsViewDetails,
  ObligationsViewDetails, OrderOfPayMentsViewDetails,
} from "@/pages/FMS/Transactions/TransactionsViewDetails";
import { AccessRequestViewDetails } from "@/pages/Security/TransactionsViewDetails";

import NotificationDataListAll from "./Components/NotificationDataListAll";

import { useReadAllNotificationsMutation, useReadNotificationsMutation } from "@/api/Endpoints/Core/Socials/Notifications";

const NOTIFICATION_TYPES = {
  CORE_TRANSACTIONS_ACCESSREQUESTS: "CORE_TRANSACTIONS_ACCESSREQUESTS",
  
  FMS_TRANSACTIONS_CASHDISBURSEMENTS: "FMS_TRANSACTIONS_CASHDISBURSEMENTS",
  FMS_TRANSACTIONS_COLLECTIONS: "FMS_TRANSACTIONS_COLLECTIONS",
  FMS_TRANSACTIONS_DEPOSITS: "FMS_TRANSACTIONS_DEPOSITS",
  FMS_TRANSACTIONS_OBLIGATIONS: "FMS_TRANSACTIONS_OBLIGATIONS",
  FMS_TRANSACTIONS_ORDEROFPAYMENTS: "FMS_TRANSACTIONS_ORDEROFPAYMENTS",
};

const NotificationDropdownViewAll = () => {
  const { state, customFunction } = useCustomHook()
  const [notificationId, setNotificationId] = useState(null);
  const [readNotification] = useReadNotificationsMutation();

  const [readAll] = useReadAllNotificationsMutation();

  const { clearCount } = useUnreadNotificationCount();

  useEffect(() => {
    if (notificationId) {
      readNotification({ notificationId });
    }
  }, [notificationId, readNotification]);

  const handleClickNotification = (data) => {
    const notificationType = data.notificationType;
    setNotificationId(data?.notificationId)
    const toggleMap = {
      [NOTIFICATION_TYPES.CORE_TRANSACTIONS_ACCESSREQUESTS]: "toggleViewAccessRequest",
      
      [NOTIFICATION_TYPES.FMS_TRANSACTIONS_CASHDISBURSEMENTS]: "toggleViewCashDisbursements",
      [NOTIFICATION_TYPES.FMS_TRANSACTIONS_COLLECTIONS]: "toggleViewCollections",
      [NOTIFICATION_TYPES.FMS_TRANSACTIONS_DEPOSITS]: "toggleViewDeposits",
      [NOTIFICATION_TYPES.FMS_TRANSACTIONS_OBLIGATIONS]: "toggleViewObligations",
      [NOTIFICATION_TYPES.FMS_TRANSACTIONS_ORDEROFPAYMENTS]: "toggleViewOrderOfPayments",
    };

    if (toggleMap[notificationType]) return customFunction.updateToggle(toggleMap[notificationType], data);
  };

  const handleReadAllNotification = async () => {
    readAll()
    clearCount()
  };

  return (
    <div className="page-content">

      {state.toggle.toggleViewAccessRequest && <AccessRequestViewDetails
        data={{ accessRequestId: state.trxValue?.referenceId }}
        show={state?.toggle?.toggleViewAccessRequest}
        onCloseClick={() => customFunction.updateToggle("toggleViewAccessRequest")}
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

      <Container fluid>
        <BreadCrumb
          title="All Notifications"
          crumbs={[
            { title: "Dashboard", url: "/" },
            { title: "Notifications", url: "/notifications" },
          ]}
        />
        <Row>
          <Col xxl={9} className="mx-auto">
            <Card>
              <CardHeader className="align-items-center d-flex border-bottom-dashed">
                <div className="flex-grow-1">
                  <h5 className="card-title mb-0">
                    <i className="bx bx-bell me-2 text-primary align-middle"></i>
                    Notifications
                  </h5>
                </div>
                <button onClick={handleReadAllNotification} type="button" className="btn btn-sm btn-soft-success waves-effect waves-light">
                  Read All
                </button>
              </CardHeader>
              <CardBody className="p-0">
                <NotificationDataListAll onClickNotification={handleClickNotification} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default NotificationDropdownViewAll;
