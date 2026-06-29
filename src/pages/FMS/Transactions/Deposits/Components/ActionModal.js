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

import { useApproveDepositsMutation, useCancelDepositsMutation, useRejectDepositsMutation, useReturnDepositsMutation } from "@/api/Endpoints/FMS/Transactions/Deposit/Deposits";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

const MODULE_NAME = "Deposit"

const ActionModal = ({
  depositId,
  data = null,
  show,
  onCloseClick,
  customFunction
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
      depositId: depositId || 0,
      remarks: "",
    },
  });

  useEffect(() => {
    if (depositId !== 0) {
      reset({
        depositId: depositId || 0,
        remarks: "",
      });
    } else {
      reset({
        depositId: 0,
        remarks: "",
      });
    }
  }, [depositId, show]);

  // Calling Action API
  const [returnAction, { isLoading: isReturning }] = useReturnDepositsMutation();
  const [approveAction, { isLoading: isApproving }] = useApproveDepositsMutation();
  const [rejectAction, { isLoading: isRejecting }] = useRejectDepositsMutation();
  const [cancelAction, { isLoading: isCanceling }] = useCancelDepositsMutation();

  const renderMessage = (data) => {
    switch (data) {
      case "Approve": return "success";
      case "Return": return "primary";
      case "Reject": return "danger";
      case "Cancel": return "danger";
      default: return "dark";
    }
  };

  const onSubmit = async (formData) => {
    const payload = {
      remarks: formData.remarks,
      depositId: depositId,
      files
    };

    try {
      if (actionType.current === "Approve") {
        const approved = await approveAction(payload);
        if (approved?.data?.success) {
          customFunction.updateState({ data: approved?.data?.returnData });
          notification({ type: "success", header: `Approved ${MODULE_NAME}`, title: approved?.data?.returnData.referenceNo, message: "Request was Approved" });
          onCloseClick(true);
        } else {
          onCloseClick();
          notification({ type: 'error', title: MODULE_NAME, message: `${approved.data.returnMessage}` });
        }
      } else if (actionType.current === "Return") {
        const returned = await returnAction(payload);
        if (returned?.data?.success) {
          customFunction.updateState({ data: returned?.data?.returnData });
          notification({ type: 'reject', header: `Returned ${MODULE_NAME}`, title: returned?.data?.returnData.referenceNo, message: 'Request was Returned' });
          onCloseClick(true);
        } else {
          onCloseClick();
          notification({ type: 'error', title: MODULE_NAME, message: `${returned.data.returnMessage}` });
        }
      } else if (actionType.current === "Reject") {
        const rejected = await rejectAction(payload);
        if (rejected?.data?.success) {
          customFunction.updateState({ data: rejected?.data?.returnData });
          notification({ type: 'reject', header: `Rejected ${MODULE_NAME}`, title: rejected?.data?.returnData.referenceNo, message: 'Request was Rejected' });
          onCloseClick(true);
        } else {
          onCloseClick();
          notification({ type: 'error', title: MODULE_NAME, message: `${rejected.data.returnMessage}` });
        }
      } else if (actionType.current === "Cancel") {
        const canceled = await cancelAction(payload);
        if (canceled?.data?.success) {
          customFunction.updateState({ data: canceled?.data?.returnData });
          notification({ type: 'reject', header: `Canceled ${MODULE_NAME}`, title: canceled?.data?.returnData.referenceNo, message: 'Request was Canceled' });
          onCloseClick(true);
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
