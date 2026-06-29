import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import React, { useEffect, useRef, useState } from "react";
import { registerPlugin } from "react-filepond";
import { Controller, useForm } from "react-hook-form";
import { Label, Modal, ModalBody, ModalHeader } from "reactstrap";

import {
  ApproveButton,
  CancelButton,
  CloseButton,
  RejectButton, 
  ReturnButton
} from "@/components/Common/Buttons";
import FileUpload from "@/components/Common/FileUpload";
import { InputField } from "@/components/Common/Inputs";
import { useNotificationModal } from "@/context/notificationContext";

import { 
  useApproveJournalEntryVouchersMutation,
   useCancelJournalEntryVouchersMutation,
    useRejectJournalEntryVouchersMutation,
     useReturnJournalEntryVouchersMutation } from "@/api/Endpoints/FMS/Transactions/JournalEntryVoucher/JournalEntryVouchers";


registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const MODULE_NAME = 'Journal Entry Voucher'

const ActionModal = ({
  journalEntryVoucherId,
  data = null,
  show,
  onCloseClick,
  customFunction,
}) => {
  const actionType = useRef("save");
  const [files, setFiles] = useState([]);
  const { notification } = useNotificationModal();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      journalEntryVoucherId: journalEntryVoucherId || 0,
      remarks: "",
    },
  });

  useEffect(() => {
    if (journalEntryVoucherId !== 0) {
      reset({
        journalEntryVoucherId: journalEntryVoucherId || 0,
        remarks: "",
      });
    } else {
      reset({
        journalEntryVoucherId: 0,
        remarks: "",
      });
    }
  }, [journalEntryVoucherId, show]);

  // Calling Action API
  const [returnAction, { isLoading: isReturning }] = useReturnJournalEntryVouchersMutation();
  const [approveAction, { isLoading: isApproving }] = useApproveJournalEntryVouchersMutation();
  const [rejectAction, { isLoading: isRejecting }] = useRejectJournalEntryVouchersMutation();
  const [cancelAction, { isLoading: isCanceling }] = useCancelJournalEntryVouchersMutation();

  const renderMessage = (data) => {
    switch (data) {
      case "Approve": return "success";
      case "Return": return "info";
      case "Reject": return "danger";
      case "Cancel": return "danger";
      default: return "dark";
    }
  };

  const onSubmit = async (formData) => {
    const payload = {
      remarks: formData.remarks,
      journalEntryVoucherId: journalEntryVoucherId,
      files
    };

    try {
      if (actionType.current === "Approve") {
        const approved = await approveAction(payload);
        if (approved?.data?.success) {
          customFunction.updateState({ data: approved?.data?.returnData });
          notification({ type: 'success', header: `Approved ${MODULE_NAME}`, title: approved?.data?.returnData.referenceNo, message: 'Request was Approved' });
          onCloseClick(true, approved?.data?.returnData?.actions);
        } else {
          onCloseClick();
          notification({ type: 'error', title: MODULE_NAME, message: `${approved.data.returnMessage}` });
        }
      } else if (actionType.current === "Return") {
        const returned = await returnAction(payload);
        if (returned?.data?.success) {
          onCloseClick(true, returned?.data?.returnData?.actions);
          customFunction.updateState({ data: returned?.data?.returnData });
          notification({ type: 'reject', header: `Returned ${MODULE_NAME}`, title: returned?.data?.returnData.referenceNo, message: 'Request was Returned' });
        } else {
          onCloseClick();
          notification({ type: 'error', title: MODULE_NAME, message: `${returned.data.returnMessage}` });
        }
      } else if (actionType.current === "Reject") {
        const rejected = await rejectAction(payload);
        if (rejected?.data?.success) {
          onCloseClick(true, rejected?.data?.returnData?.actions);
          customFunction.updateState({ data: rejected?.data?.returnData });
          notification({ type: 'reject', header: `Rejected ${MODULE_NAME}`, title: rejected?.data?.returnData.referenceNo, message: 'Request was Rejected' });
        } else {
          onCloseClick();
          notification({ type: 'error', title: MODULE_NAME, message: `${rejected.data.returnMessage}` });
        }
      } else if (actionType.current === "Cancel") {
        const canceled = await cancelAction(payload);
        if (canceled?.data?.success) {
          onCloseClick(true, canceled?.data?.returnData?.actions);
          customFunction.updateState({ data: canceled?.data?.returnData });
          notification({ type: 'reject', header: `Canceled ${MODULE_NAME}`, title: canceled?.data?.returnData.referenceNo, message: 'Request was Canceled' });
        } else {
          onCloseClick();
          notification({ type: 'error', title: MODULE_NAME, message: `${canceled.data.returnMessage}` });
        }
      }
    } catch (error) {
      notification({ type: 'error', title: MODULE_NAME, message: 'Something went wrong' });
    }
  };

  return (
    <React.Fragment>
      <Modal modalClassName="flip" id="requestSave" size="lg" isOpen={show} toggle={() => onCloseClick(false)} centered>
        <ModalHeader toggle={() => onCloseClick(false)} className={`p-3 bg-${renderMessage(data?.actionName)}-subtle text-center w-100`}>
          <center>{`${data?.actionName} ${data?.referenceNo} `}</center>
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3 pb-2">
              <Label htmlFor="exampleFormControlTextarea" className="form-label">Remarks</Label>
              <Controller name="remarks" control={control} defaultValue="" render={({ field }) => (<InputField control={control} type="textarea" rows="4" maxLength={500} showCharCounter placeholder="Enter Remarks" {...field} /> )} />
              <br />
              <FileUpload onFilesChange={setFiles} />
            </div>
            <div className="hstack gap-2 justify-content-end">
              <CloseButton onClick={onCloseClick} />
              {data?.actionName === "Return" ? (
                <ReturnButton isProcessing={isReturning} onClick={() => (actionType.current = data?.actionName)} />
              ) : data?.actionName === "Approve" ? (
                <ApproveButton isProcessing={isApproving} onClick={() => (actionType.current = data?.actionName)} />
              ) : data?.actionName === "Reject" ? (
                <RejectButton isProcessing={isRejecting} onClick={() => (actionType.current = data?.actionName)} />
              ) : data?.actionName === "Cancel" ? (
                <CancelButton isProcessing={isCanceling} onClick={() => (actionType.current = data?.actionName)} />
              ) : ''}
            </div>
          </form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default ActionModal;
