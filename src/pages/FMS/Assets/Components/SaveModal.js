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

import { useSaveAssetsMutation } from "@/api/Endpoints/FMS/Asset/Assets";

const MODULE_NAME = "Asset";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {

    const [saveAsset, { isLoading: isSaving }] = useSaveAssetsMutation();
    const { notification } = useNotificationModal();
    const isReadOnly = !hasWriteAccess(accessRights);
    const isUpdate = !!data?.assetId
    const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`

    const defaultValues = {
        "assetId": data?.assetId || 0,
        "assetName": data?.assetName || ''
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
            "assetName": data?.assetName || '',
        }

        try {
            const response = await saveAsset(payload).unwrap();

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
                                    name="assetName"
                                    control={control}
                                    label="Name"
                                    type="text"
                                    placeholder="Enter name..."
                                    disabled={isReadOnly}
                                    rules={{ required: "AssetName is required." }}
                                />
                            </Col>
                        </Row>
                    </Form>
            </ModernModal>
        </React.Fragment>
    );
};

export default SaveModal;
