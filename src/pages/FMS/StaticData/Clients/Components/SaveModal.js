import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import userdummyimg from "@/assets/images/user-dummy-img.jpg";
import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import FileUploadInput from "@/components/Common/FileUploadInput";
import { AsyncSelect, EmailInputField, InputField, MobileInputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import useUploadFileCover from "@/components/Hooks/useUploadFileCover";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useLookupClientypesMutation } from "@/api/Endpoints/FMS/Enums/ClientsTypesLookup";
import { useSaveClientsMutation } from "@/api/Endpoints/FMS/StaticData/Clients";

const MODULE_NAME = "Client";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveClients, { isLoading: isSaving }] = useSaveClientsMutation();
  const [lookupClientTypes] = useLookupClientypesMutation();
  const { notification } = useNotificationModal();
  const {
    renderPreview: renderAvatarPreview,
    setImageValue: setAvatar,
    handleImageError: handleAvatarError,
  } = useUploadFileCover(data?.avatar, userdummyimg);
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.clientId;
  const modalName = `${isUpdate ? "Update" : "New"} ${MODULE_NAME}`;

  const defaultValues = {
    clientId: data?.clientId || 0,
    avatarFile: data?.avatarFile || null,
    clientCode: data?.clientCode || "",
    clientName: data?.clientName || "",
    tin: data?.tin || "",
    contactPerson: data?.contactPerson || "",
    emailAddress: data?.emailAddress || "",
    mobileNo: data?.mobileNo || "",
    address: data?.address || "",
    remarks: data?.remarks || "",
    ...buildSelectPairs(["clientTypeId"], data),
  };

  const { handleSubmit, reset, control, watch, setValue, getValues } = useForm({ defaultValues });

  const values = getValues();

  useEffect(() => {
    if (!show) return;
    reset(defaultValues);
  }, [show]);

  const onSubmit = async (data) => {
    const payload = {
      ...defaultValues,
      avatarFile: data?.avatarFile || null,
      clientCode: data?.clientCode || "",
      clientName: data?.clientName || "",
      tin: data?.tin || "",
      contactPerson: data?.contactPerson || "",
      emailAddress: data?.emailAddress || "",
      mobileNo: data?.mobileNo || "",
      address: data?.address || "",
      remarks: data?.remarks || "",
      ...flattenSelectPairs(["clientTypeId"], data),
    };

    try {
      const response = await saveClients(payload).unwrap();

      assertApiSuccess(response);

      notification({ type: "success", title: MODULE_NAME, message: `${MODULE_NAME} was successfully ${isUpdate ? "updated" : "added"}.` });

      onCloseClick();
    } catch (error) {
      notification({ type: "error", title: MODULE_NAME, message: `${error.message || "Unknown error"}` });
    }
  };

  const tinValue = watch("tin");

  useEffect(() => {
    if (tinValue) {
      const sanitized = tinValue.replace(/[^0-9-]/g, "").slice(0, 20);
      if (sanitized !== tinValue) {
        setValue("tin", sanitized);
      }
    }
  }, [tinValue, setValue]);

  return (
    <React.Fragment>
      <ModernModal
        title={modalName}
        isOpen={show}
        width="680px"
        modifiedDate={data?.modifiedDate}
        isSaving={isSaving}
        canSave={hasWriteAccess(accessRights)}
        onSave={handleSubmit(onSubmit)}
        onClose={onCloseClick}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col lg={12}>
              <div className="text-center mb-4 pt-2">
                <div className="position-relative d-inline-block">
                  <div className="position-absolute bottom-0 end-0">
                    <label htmlFor="avatarFile" className="mb-0" data-bs-toggle="tooltip" data-bs-placement="right" title="Select Member Image">
                      <div className="avatar-xs">
                        <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                          <i className="ri-image-fill"></i>
                        </div>
                      </div>
                    </label>
                    <FileUploadInput name="avatarFile" control={control} onFileSelect={setAvatar} />
                  </div>
                  <div className="avatar-lg">
                    <div className="avatar-title bg-light rounded-circle">
                      <img
                        src={renderAvatarPreview}
                        onError={handleAvatarError}
                        alt=""
                        id="memb 0er-img"
                        className="avatar-md rounded-circle h-auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={12}>
              <InputField
                name="clientName"
                control={control}
                label="Client Name"
                type="text"
                rules={{
                  required: "client name  is required.",
                }}
                placeholder="Enter client name..."
                disabled={isReadOnly}
              />
            </Col>
            <Col lg={3}>
              <InputField
                name="clientCode"
                control={control}
                label="Client Code"
                type="text"
                rules={{
                  required: "client code  is required.",
                }}
                placeholder="Enter client code..."
                disabled={isReadOnly}
              />
            </Col>
            <Col lg={9}>
              <InputField
                name="contactPerson"
                control={control}
                label="Contact Person"
                type="text"
                rules={{
                  required: "contact person is required.",
                }}
                placeholder="Enter contact person..."
                disabled={isReadOnly}
              />
            </Col>
            <Col lg={6}>
              <AsyncSelect
                name="clientTypeId"
                control={control}
                label="Client Type"
                loadOptions={formatLoadOptions(lookupClientTypes)}
                rules={{ required: "client type is required." }}
                placeholder="Select a client type"
                getOptionValue={(opt) => opt.clientTypeId || opt.value}
                getOptionLabel={(opt) => opt.clientTypeName || opt.label}
                isDisabled={isReadOnly}
              />
            </Col>
            <Col lg={6}>
              <InputField
                name="tin"
                control={control}
                label="TIN"
                type="text"
                rules={{
                  required: "tin is required.",
                }}
                placeholder="Enter tin..."
                disabled={isReadOnly}
              />
            </Col>
            <Col lg={6}>
              <EmailInputField
                name="emailAddress"
                control={control}
                label="Email Address"
                type="email"
                rules={{
                  required: "email address is required.",
                }}
                placeholder="Enter email address..."
                disabled={isReadOnly}
              />
            </Col>
            <Col lg={6}>
              <MobileInputField
                name="mobileNo"
                control={control}
                label="Mobile No."
                type="text"
                rules={{
                  required: "mobile no is required.",
                }}
                placeholder="Enter mobile no..."
                disabled={isReadOnly}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="address"
                control={control}
                label="Address"
                type="textarea"
                placeholder="Enter address..."
                rows={3}
                disabled={isReadOnly}
              />
            </Col>
            <Col lg={12}>
              <InputField
                name="remarks"
                control={control}
                label="Remarks"
                type="textarea"
                placeholder="Enter remarks..."
                rows={3}
                disabled={isReadOnly}
              />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
