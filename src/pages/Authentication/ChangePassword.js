import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import "react-toastify/dist/ReactToastify.css";
import { Col, Form, Modal, ModalBody, ModalHeader, Row, Spinner } from "reactstrap";

import { CloseButton } from "@/components/Common/Buttons";
import { InputField } from "@/components/Common/Inputs";
import { useNotificationModal } from "@/context/notificationContext";

import { useChangePasswordMutation } from "@/api/Endpoints/Core/Security/Users";

const MODULE_NAME = "Change Password";

const ChangePassword = ({ data = null, show, onCloseClick }) => {
  const { notification } = useNotificationModal();
  const [changePassword, { isLoading: isSaving }] = useChangePasswordMutation();

  const defaultValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const { handleSubmit, reset, control } = useForm({ defaultValues });

  useEffect(() => {
    if (data || show) {
      reset(defaultValues);
    }
  }, [data, show]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        currentPassword: data?.currentPassword || "",
        newPassword: data?.newPassword || "",
        confirmPassword: data?.confirmPassword || "",
      };
      await changePassword(payload).unwrap();

      notification({
        type: "success",
        title: MODULE_NAME,
        header: MODULE_NAME,
        message: `Password was successfully updated.`,
      });
      onCloseClick();
    } catch (error) {
      notification({
        type: "error",
        title: MODULE_NAME,
        header: MODULE_NAME,
        message: `Error saving  ${error.message || "Unknown error"}`,
      });
    }
  };

  return (
    <React.Fragment>
      <Modal modalClassName="flip" id="saveFuel" size="m" isOpen={show} toggle={onCloseClick} centered>
        <ModalHeader toggle={onCloseClick} className="p-3 bg-success-subtle">
          {MODULE_NAME}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="text-center mb-4">
              <div className="text-muted">Your new password must be different from your previously used password.</div>
            </div>
            <Row>
              <Col lg={12}>
                <InputField
                  key="currentPassword"
                  name="currentPassword"
                  control={control}
                  label="Current Password"
                  type="password"
                  rules={{
                    required: "current password is required.",
                  }}
                  placeholder="Enter current password... "
                />
              </Col>
              <Col lg={12}>
                <InputField
                  key="newPassword"
                  name="newPassword"
                  control={control}
                  label="New Password"
                  type="password"
                  rules={{
                    required: "new password is required.",
                    minLength: {
                      value: 8,
                      message: "password must be at least 8 characters",
                    },
                  }}
                  placeholder="Enter new password... "
                />
              </Col>
              <Col lg={12}>
                <InputField
                  key="confirmPassword"
                  name="confirmPassword"
                  control={control}
                  label="Confirm Password"
                  type="password"
                  rules={{
                    required: "confirm password is required.",
                    minLength: {
                      value: 8,
                      message: "password must be at least 8 characters",
                    },
                  }}
                  placeholder="Enter confirm password... "
                />
              </Col>
              <Col lg={12}>
                <div className="hstack gap-2 justify-content-end">
                  <CloseButton isSaving={isSaving} onClick={onCloseClick} />
                  <button type="submit" className="btn btn-primary" disabled={isSaving}>
                    {isSaving ? <Spinner size="sm" className="me-1" /> : <i className="ri-save-3-line align-bottom me-1"></i>}
                    {isSaving ? "Changing..." : "Change Password"}
                  </button>
                </div>
              </Col>
            </Row>
          </Form>
        </ModalBody>
      </Modal>
    </React.Fragment>
  );
};

export default ChangePassword;
