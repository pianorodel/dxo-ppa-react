import classnames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { Col, Form, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap";

import ModernModal from "@/components/Common/Modals/ModernModal";
import useCustomHook from "@/components/Hooks/useCustomHook";
import { useNotificationModal } from "@/context/notificationContext";

import AccountEntries from "./AccountEntries";
import JevPDF2 from "./JevPDF2";
import Particulars from "./Particulars";
import SupportingDocuments from "./SupportingDocuments";

import {
  useFindJournalEntryVouchersQuery,
  useSaveJournalEntryVouchersMutation,
  useSubmitJournalEntryVouchersMutation,
} from "@/api/Endpoints/FMS/Transactions/JournalEntryVoucher/JournalEntryVouchers";

const SaveModal = ({ data, show, onCloseClick }) => {
  const { state, customFunction } = useCustomHook({ accountEntries: [], supportingDocuments: [] });
  const [activeTab, setActiveTab] = useState("1");
  const { notification, hideModal } = useNotificationModal();
  const [save, { isLoading: isSaving }] = useSaveJournalEntryVouchersMutation();
  const [submit, { isLoading: isSubmitting }] = useSubmitJournalEntryVouchersMutation();
  const { data: transactionData, refetch } = useFindJournalEntryVouchersQuery(
    { journalEntryVoucherId: data?.journalEntryVoucherId },
    { skip: !data?.journalEntryVoucherId, refetchOnMountOrArgChange: show },
  );
  const findData = transactionData?.returnData;

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const actionType = useRef("save");

  const defaultValues = {
    journalEntryVoucherId: data?.journalEntryVoucherId || 0,
    fundingSourceId: data?.fundingSourceId || 0,
    fundingSourceName: data?.fundingSourceName || "",
    transactionDate: data?.transactionDate || null,
    particulars: data?.particulars || "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    reset({
      ...defaultValues,
      ...findData,
    });
  }, [show, data, reset, findData, refetch]);

  const onSubmit = async (formData) => {
    // if (!rowData || rowData.length === 0) {
    //   notification({
    //     type: "error",
    //     title: MODULE_NAME,
    //     message: "You must add at least one item before submitting.",
    //   });
    //   return;
    // }
    // const payload = {};
    // try {
    //   const response = actionType.current === "save" ? await save(payload).unwrap() : await submit(payload).unwrap();
    //   assertApiSuccess(response);
    //   notification({
    //     type: "success",
    //     title: response.returnData.referenceNo,
    //     header: `${actionType.current === "save" ? "Save" : "Submit"} ${MODULE_NAME}`,
    //     message: `${MODULE_NAME} was successfully ${actionType.current === "save" ? "saved" : "submitted"}.`,
    //   });
    //   setTimeout(() => {
    //     hideModal();
    //     onCloseClick();
    //   }, 2000);
    // } catch (error) {
    //   notification({
    //     type: "error",
    //     title: MODULE_NAME,
    //     message: `${error?.message || "Unknown error"}`,
    //   });
    // }
  };

  return (
    <React.Fragment>
      <ModernModal
        isProcess={true}
        fullscreen={true}
        title={"New Journal Entry Voucher"}
        isOpen={show}
        // modifiedDate={data?.modifiedDate}
        isSaving={false}
        canSave={true}
        onSave={() => {
          actionType.current = "save";
          handleSubmit(onSubmit)();
        }}
        isSubmitting={false}
        canSubmit={true}
        onSubmit={() => {
          actionType.current = "submit";
          handleSubmit(onSubmit)();
        }}
        onClose={onCloseClick}>
        <Form onSubmit={handleSubmit(onSubmit)} className="h-100">
          <Row className="h-100">
            <Col lg={state.toggle.toggleHidePreview ? "12" : state.toggleExpand ? "7" : "6"} md="6" xs="6">
              <Particulars state={state} customFunction={customFunction} control={control} />
              <Row className={"mt-10"} style={{ marginBottom: "20px" }}>
                <Nav className="nav-tabs nav-tabs-custom nav-success cursor-pointer" role="tablist">
                  {/* <NavItem>
                    <NavLink onClick={() => toggleTab("1")} className={classnames({ active: activeTab === "1" }, "fw-medium")}>
                      Particulars
                    </NavLink>
                  </NavItem> */}
                  <NavItem>
                    <NavLink onClick={() => toggleTab("1")} className={classnames({ active: activeTab === "1" }, "fw-medium")}>
                      Accounting Entries
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink onClick={() => toggleTab("2")} className={classnames({ active: activeTab === "2" }, "fw-medium")}>
                      Supporting Documents
                    </NavLink>
                  </NavItem>
                </Nav>
              </Row>
              <TabContent activeTab={activeTab}>
                {/* <TabPane tabId="1">
                  <Particulars state={state} customFunction={customFunction} control={control} />
                </TabPane> */}
                <TabPane tabId="1">
                  <AccountEntries state={state} customFunction={customFunction} control={control} />
                </TabPane>
                <TabPane tabId="2">
                  <SupportingDocuments state={state} customFunction={customFunction} />
                </TabPane>
              </TabContent>
            </Col>
            <Col lg={state.toggleExpand ? "5" : "6"} md="6" xs="6">
              <div className="h-100" style={{ marginBottom: "10px" }}>
                <JevPDF2
                  pdfTitle={"test"}
                  headerData={state.data}
                  accountEntries={state.accountEntries}
                  supportingDocuments={state.supportingDocuments}
                />
              </div>
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
