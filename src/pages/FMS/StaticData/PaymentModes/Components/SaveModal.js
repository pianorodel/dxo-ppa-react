import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Col,
    Form,
    Row
} from "reactstrap";

import { InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useSavePaymentModesMutation } from "@/api/Endpoints/FMS/StaticData/PaymentModes";

const MODULE_NAME = "Payment Mode";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {

    const [savePaymentMode, { isLoading: isSaving }] = useSavePaymentModesMutation();
    const { notification } = useNotificationModal();
    const isReadOnly = !hasWriteAccess(accessRights);
    const isUpdate = !!data?.paymentModeId
    const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`

    const defaultValues = {
        "paymentModeId": data?.paymentModeId || 0,
        "paymentModeName": data?.paymentModeName || ''
    }

    const {
        handleSubmit,
        reset,
        control,
    } = useForm({ defaultValues });

    useEffect(() => {
        if (!show) return;
        reset(defaultValues);
    }, [show]);

    const onSubmit = async (data) => {
        const payload = {
            ...defaultValues,
            "paymentModeName": data?.paymentModeName || '',
        }

        try {
            const response = await savePaymentMode(payload).unwrap();

            assertApiSuccess(response);

            notification({ type: 'success', title: MODULE_NAME, message: `${MODULE_NAME} was successfully ${isUpdate ? "updated" : "added"}.` })

            onCloseClick();
        } catch (error) {
            notification({ type: 'error', title: MODULE_NAME, message: `${error.message || "Unknown error"}` })
        }
    };

    return (
        <React.Fragment>
             <ModernModal title={modalName} isOpen={show} onClose={onCloseClick} width="650px" isSaving={isSaving} modifiedDate={data?.modifiedDate} canSave={hasWriteAccess(accessRights)} onSave={handleSubmit(onSubmit)}>
                   <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col lg={12}>
                                <InputField
                                    name="paymentModeName"
                                    control={control}
                                    label="Name"
                                    type="text"
                                    placeholder="Enter name..."
                                    disabled={isReadOnly}
                                    rules={{ required: "PaymentModeName is required." }}
                                />
                            </Col>
                        </Row>
                    </Form>
            </ModernModal>
        </React.Fragment>
    );
};

export default SaveModal;
