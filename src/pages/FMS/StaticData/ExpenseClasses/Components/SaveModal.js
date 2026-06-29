import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Col,
    Form,
    Row
} from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/DxoModalComponent";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useSaveExpenseClassesMutation } from "@/api/Endpoints/FMS/StaticData/ExpenseClasses";

const MODULE_NAME = "Expense Class";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {

    const [saveExpenseClass, { isLoading: isSaving }] = useSaveExpenseClassesMutation();
    const { notification } = useNotificationModal();
    const isReadOnly = !hasWriteAccess(accessRights);
    const isUpdate = !!data?.expenseClassId
    const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`

    const defaultValues = {
        "expenseClassId": data?.expenseClassId || 0,
        "expenseClassName": data?.expenseClassName || ''
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
            "expenseClassName": data?.expenseClassName || '',
        }

        try {
            const response = await saveExpenseClass(payload).unwrap();

            assertApiSuccess(response);

            notification({ type: 'success', title: MODULE_NAME, message: `${MODULE_NAME} was successfully ${isUpdate ? "updated" : "added"}.` })

            onCloseClick();
        } catch (error) {
            notification({ type: 'error', title: MODULE_NAME, message: `${error.message || "Unknown error"}` })
        }
    };

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
                            <InputField
                                name="expenseClassName"
                                control={control}
                                label="Name"
                                type="text"
                                placeholder="Enter name..."
                                disabled={isReadOnly}
                                rules={{ required: "ExpenseClassName is required." }}
                            />
                        </Col>
                    </Row>
                </Form>
            </ModernModal>
        </React.Fragment>
    );
};

export default SaveModal;
