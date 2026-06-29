import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Col,
    Form,
    Row
} from "reactstrap";

import { CloseButton, SaveButton } from "@/components/Common/Buttons";
import { AsyncSelect, InputField } from "@/components/Common/Inputs";
import ModernModal from "@/components/Common/Modals/ModernModal";
import { useNotificationModal } from "@/context/notificationContext";
import { assertApiSuccess } from "@/helpers/api_helper";
import { buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { hasWriteAccess } from "@/helpers/session_helper";

import { useLookUpAuthorizationCodesMutation } from "@/api/Endpoints/FMS/StaticData/AuthorizationCodes";
import { useLookUpFinancingSourcesMutation } from "@/api/Endpoints/FMS/StaticData/FinancingSources";
import { useLookUpFundCategoriesMutation } from "@/api/Endpoints/FMS/StaticData/FundCategories";
import { useLookUpFundClustersMutation } from "@/api/Endpoints/FMS/StaticData/FundClusters";
import { useSaveFundSubCategoriesMutation } from "@/api/Endpoints/FMS/StaticData/FundSubCategories";

const MODULE_NAME = "Fund Sub Category";

const SaveModal = ({ data = null, show, onCloseClick, accessRights }) => {

    const [saveFundSubCategory, { isLoading: isSaving }] = useSaveFundSubCategoriesMutation();
    const { notification } = useNotificationModal();
    const isReadOnly = !hasWriteAccess(accessRights);
    const isUpdate = !!data?.fundSubCategoryId
    const modalName = `${isUpdate ? (isReadOnly ? "View" : "Update") : "New"} ${MODULE_NAME}`
    const [lookupFundCluster] = useLookUpFundClustersMutation();
    const [lookupFinancingSource] = useLookUpFinancingSourcesMutation();
    const [lookupAuthorization] = useLookUpAuthorizationCodesMutation();
    const [lookupFundCategory] = useLookUpFundCategoriesMutation();

    const defaultValues = {
        "fundSubCategoryId": data?.fundSubCategoryId || 0,
        "fundSubCategoryName": data?.fundSubCategoryName || '',
        "fundClusterId": data?.fundClusterId || 0,
        "fundClusterName": data?.fundClusterName || "",
        "financingSourceId": data?.financingSourceId || 0,
        "financingSourceName": data?.financingSourceName || "",
        "authorizationCodeId": data?.authorizationCodeId || 0,
        "authorizationCodeName": data?.authorizationCodeName || "",
        "fundCategoryId": data?.fundCategoryId || 0,
        "fundCategoryName": data?.fundCategoryName || "",
        "uacs": data?.uacs || ""
    }

    const {
        handleSubmit,
        reset,
        control,
    } = useForm({ defaultValues });

    useEffect(() => {
        if (!show) return;
        reset({
            ...defaultValues,
            ...buildSelectPairs(["fundClusterId", "financingSourceId", "authorizationCodeId", "fundCategoryId"], data),
        });
    }, [show]);

    const onSubmit = async (formData) => {
        const payload = {
            ...defaultValues,
            fundSubCategoryName: formData?.fundSubCategoryName || '',
            uacs: formData?.uacs || "",
            ...flattenSelectPairs(["fundClusterId", "financingSourceId", "authorizationCodeId", "fundCategoryId"], formData),
        }

        try {
            const response = await saveFundSubCategory(payload).unwrap();

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
                            <AsyncSelect
                                disabled={isReadOnly}
                                name="fundClusterId"
                                control={control}
                                label="Fund Cluster"
                                loadOptions={formatLoadOptions(lookupFundCluster)}
                                rules={{ required: "Fund Cluster is required" }}
                                placeholder="Select a fund cluster"
                                getOptionValue={(opt) => opt.fundClusterId || opt.value}
                                getOptionLabel={(opt) => opt.fundClusterName || opt.label}
                            />
                        </Col>
                        <Col lg={12}>
                            <AsyncSelect
                                disabled={isReadOnly}
                                name="financingSourceId"
                                control={control}
                                label="Financing Source"
                                loadOptions={formatLoadOptions(lookupFinancingSource)}
                                rules={{ required: "Financing source is required" }}
                                placeholder="Select a financing source"
                                getOptionValue={(opt) => opt.financingSourceId || opt.value}
                                getOptionLabel={(opt) => opt.financingSourceName || opt.label}
                            />
                        </Col>

                        <Col lg={12}>
                            <AsyncSelect
                                disabled={isReadOnly}
                                name="authorizationCodeId"
                                control={control}
                                label="Authorization"
                                loadOptions={formatLoadOptions(lookupAuthorization)}
                                rules={{ required: "Authorization is required" }}
                                placeholder="Select a authorization"
                                getOptionValue={(opt) => opt.authorizationCodeId || opt.value}
                                getOptionLabel={(opt) => opt.authorizationCodeName || opt.label}
                            />
                        </Col>

                        <Col lg={12}>
                            <AsyncSelect
                                disabled={isReadOnly}
                                name="fundCategoryId"
                                control={control}
                                label="Fund Category"
                                loadOptions={formatLoadOptions(lookupFundCategory)}
                                rules={{ required: "Fund category is required" }}
                                placeholder="Select a fund category"
                                getOptionValue={(opt) => opt.fundCategoryId || opt.value}
                                getOptionLabel={(opt) => opt.fundCategoryName || opt.label}
                            />
                        </Col>
                        <Col lg={12}>
                            <InputField
                                name="fundSubCategoryName"
                                control={control}
                                label="Fund Sub Category"
                                type="text"
                                placeholder="Enter fund sub category name..."
                                disabled={isReadOnly}
                                rules={{ required: "Fund sub category is required." }}
                            />
                        </Col>
                        <Col lg={12}>
                            <InputField
                                name="uacs"
                                control={control}
                                label="UACS"
                                type="text"
                                placeholder="Enter uacs..."
                                disabled={isReadOnly}
                                rules={{ required: "uacs is required." }}
                            />
                        </Col>
                    </Row>
                </Form>
            </ModernModal>
        </React.Fragment>
    );
};

export default SaveModal;
