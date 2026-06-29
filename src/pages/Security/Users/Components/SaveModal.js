import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Form, Row } from "reactstrap";

import userdummyimg from "@/assets/images/dummy-user.jpg";
import FileUploadInput from "@/components/Common/FileUploadInput";
import { AsyncSelect, DatePickerField, EmailInputField, InputField, MobileInputField, NameInputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import SwitchButton from "@/components/Common/SwitchButton";
import useUploadFileCover from "@/components/Hooks/useUploadFileCover";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useLookUpRolesMutation } from "@/api/Endpoints/Core/Security/Roles";
import { useSaveWithRolesUsersMutation } from "@/api/Endpoints/Core/Security/Users";

const MODULE_NAME = "User";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {
  const [saveUsers, { isLoading: isSaving }] = useSaveWithRolesUsersMutation();
  const { notification } = useNotificationModal();
  const [lookUpRoles] = useLookUpRolesMutation();
  const isReadOnly = !hasWriteAccess(accessRights);
  const isUpdate = !!data?.userId;
  const modalName = `${isUpdate ? "Update" : "New"} ${MODULE_NAME}`;
  const {
    renderPreview: renderAvatarPreview,
    setImageValue: setAvatar,
    handleImageError: handleAvatarError,
  } = useUploadFileCover(data?.avatar, userdummyimg);

  const defaultValues = {
    avatarFile: data?.avatarFile || null,
    userId: data?.userId || 0,
    userName: data?.userName || "",
    firstName: data?.firstName || "",
    middleName: data?.middleName || "",
    lastName: data?.lastName || "",
    suffix: data?.suffix || "",
    birthDate: data?.birthDate || "",
    emailAddress: data?.emailAddress || "",
    mobileNo: data?.mobileNo || "",
    roles: data?.roles || [],
    isActive: data?.isActive !== undefined ? data.isActive : true,
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (!show) return;
    reset(defaultValues);
  }, [show]);

  const onSubmit = async (data) => {
    const roleIds = (data.roles || []).map((r) => ({ roleId: r.value || r.roleId, roleName: r.label || r.roleName }));
    const payload = {
      ...defaultValues,
      avatarFile: data?.avatarFile || null,
      userName: data?.userName || "",
      firstName: data?.firstName || "",
      middleName: data?.middleName || "",
      lastName: data?.lastName || "",
      suffix: data?.suffix || "",
      birthDate: data?.birthDate || "",
      emailAddress: data?.emailAddress || "",
      mobileNo: data?.mobileNo || "",
      roles: roleIds,
      isActive: data?.isActive !== undefined ? data.isActive : true,
    };

    try {
      const response = await saveUsers(payload).unwrap();

      assertApiSuccess(response);

      notification({ type: "success", title: MODULE_NAME, message: `${MODULE_NAME} was successfully ${isUpdate ? "updated" : "added"}.` });

      onCloseClick();
    } catch (error) {
      notification({ type: "error", title: MODULE_NAME, message: `${error.message || "Unknown error"}` });
    }
  };
 
  return (
    <React.Fragment>
      <ModernModal title={modalName}
        isOpen={show}
        onClose={onCloseClick}
        width="860px"
        isSaving={isSaving}
        imgIcon={renderAvatarPreview}
        modifiedDate={ data?.modifiedDate}
        canSave={hasWriteAccess(accessRights)}
        onSave={handleSubmit(onSubmit)}>
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
            <Col lg={6}>
              <InputField
                name="userName"
                control={control}
                label="User Name"
                type="text"
                rules={{
                  required: "User name is required.",
                }}
                placeholder="Enter user name..."
                maxLength={20}
                disabled={isReadOnly}
              />
            </Col>
            <Col lg={6}>
              <NameInputField
                name="firstName"
                control={control}
                label="First Name"
                type="text"
                rules={{
                  required: "First Name is required.",
                }}
                placeholder="Enter first name..."
                disabled={isReadOnly}
                maxLength={50}
                uppercase
              />
            </Col>
            <Col lg={6}>
              <NameInputField
                name="middleName"
                control={control}
                label="Middle Name"
                type="text"
                placeholder="Enter middle name..."
                disabled={isReadOnly}
                maxLength={50}
                uppercase
              />
            </Col>
            <Col lg={6}>
              <NameInputField
                name="lastName"
                control={control}
                label="Last Name"
                type="text"
                rules={{
                  required: "Last name is required.",
                }}
                placeholder="Enter last name..."
                disabled={isReadOnly}
                maxLength={50}
                uppercase
              />
            </Col>
            <Col lg={6}>
              <NameInputField
                name="suffix"
                control={control}
                label="Suffix"
                type="text"
                placeholder="Enter suffix..."
                disabled={isReadOnly}
                maxLength={4}
                uppercase
              />
            </Col>
            <Col lg={4}>
              <DatePickerField
                control={control}
                name="birthDate"
                label="Date of Birth"
                disabled={isReadOnly}
                options={{
                  maxDate: new Date(),
                }}
                placeholder="Select birth date..."
              />
            </Col>
            <Col lg={6}>
              <EmailInputField
                name="emailAddress"
                control={control}
                label="Email Address"
                type="email"
                rules={{
                  required: "Email address is required.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
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
                  pattern: {
                    value: /^[0-9]+$/i,
                    message: "Invalid mobile no.",
                  },
                }}
                placeholder="Enter mobile no..."
                disabled={isReadOnly}
              />
            </Col>
            <Col lg={12}>
              <AsyncSelect
                name="roles"
                control={control}
                label="Roles"
                loadOptions={formatLoadOptions(lookUpRoles)}
                isMulti
                defaultValue={[]}
                placeholder="Select roles..."
                getOptionValue={(opt) => opt.roleId || opt.value}
                getOptionLabel={(opt) => opt.roleName || opt.label}
                isDisabled={isReadOnly}
              />
            </Col>
            <Col lg={6}>
              <SwitchButton name="isActive" control={control} label="Active" disabled={isReadOnly} />
            </Col>
          </Row>
        </Form>
      </ModernModal>
    </React.Fragment>
  );
};

export default SaveModal;
