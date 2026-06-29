import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    Card,
    CardBody,
    Col,
    Modal,
    ModalBody,
    Row
} from "reactstrap";

import { Badge } from "@/components/Common/Badge";
import {
    ApproveButton,
    CancelButton,
    RejectButton,
    ReturnButton,
} from "@/components/Common/Buttons";
import { DateTimeLabel } from "@/components/Common/DateTimeLabel";
import { DatePickerField, InputField } from "@/components/Common/Inputs";
import useCustomHook from "@/components/Hooks/useCustomHook";

import { useFindJournalEntryVouchersQuery } from "@/api/Endpoints/FMS/Transactions/JournalEntryVoucher/JournalEntryVouchers";
import defaultTrxImg from "@/assets/images/default_transaction.png";
import { PhotoViewer } from "@/components/Common/PhotoViewer";
import ActionModal from "./ActionModal";
import History from "./History";

const ViewDetails = ({ data, show = false, onCloseClick, parentKey, onUpdateParentKey }) => {
    const { state, customFunction } = useCustomHook();

    const { data: transactionData, refetch, isLoading } = useFindJournalEntryVouchersQuery({ journalEntryVoucherId: data?.journalEntryVoucherId }, { skip: !data?.journalEntryVoucherId, refetchOnMountOrArgChange: show });
    const findData = transactionData?.returnData;
    const isViewerOnly = true;
    const {
        reset,
        control,
    } = useForm({ defaultValues: {} });

    useEffect(() => {
        reset({
            ...findData,
        });
        customFunction.updateState({
            data: {
                ...state, data,
                ...findData
            }
        })
    }, [show, data, findData, refetch, reset,]);

    const handleActions = (bool, data) => {
        if (bool) {
            customFunction.updateState({
                refetchHistory: !state.refetchHistory, data: {
                    ...state.data,
                    ...data
                }
            });
            customFunction.updateToggle("toggleAction");
            onUpdateParentKey(parentKey + 1)
        } else {
            customFunction.updateToggle("toggleAction", { ...findData, actionName: data });
        }
    };

    return (
        <React.Fragment>
            <ActionModal
                state={state}
                customFunction={customFunction}
                journalEntryVoucherId={findData?.journalEntryVoucherId}
                data={state?.trxValue}
                show={state.toggle.toggleAction}
                onCloseClick={handleActions}
            />

            <Modal
                className="modal-fullscreen"
                modalClassName="flip"
                id="requestDetails"
                size="xl"
                isOpen={show}
                toggle={onCloseClick}
                centered
                backdrop="static"
            >
                <ModalBody>
                    <div>
                        <div className="profile-foreground position-relative mx-n4 mt-n4">
                            <div className="profile-wid-bg">
                            </div>
                        </div>
                        <div className="pt-4 mb-4 mb-lg-3 pb-lg-4">
                            <Row className="g-4">

                                <div className="col-md-auto">
                                    <PhotoViewer>
                                        <img src={defaultTrxImg} style={{ width: "100px", height: "80px", cursor: 'pointer' }} />
                                    </PhotoViewer>
                                </div>

                                <Col style={{ paddingLeft: "0px" }}>
                                    <div>
                                        <h3 className="text-white mb-1">Journal Entry Voucher Request Details</h3>
                                        <p className="text-white text-opacity-75">
                                            Date {state.data?.statusName}:{" "}
                                            <span className="fw-semibold">
                                                {(
                                                    <DateTimeLabel
                                                        value={state.data?.statusDate}
                                                    />
                                                ) || "Draft"}
                                            </span>{" "}
                                            <Badge
                                                value={state.data?.statusName}
                                                color={state.data?.statusColor}
                                            />
                                            <br />
                                            Reference No. : <span className="fs-16 fw-semibold" style={{ color: '#0ab39c' }}>{findData?.referenceNo}</span>
                                        </p>
                                    </div>
                                </Col>

                                <Col xs={12} className="col-lg-auto order-last order-lg-0">
                                    <Row className="text text-white-50 text-center">
                                        <Col lg={12} xs={12}>
                                            <div className="col-md-auto">
                                                <div className="hstack gap-1 flex-wrap mt-4 mt-md-0">
                                                    <button
                                                        type="button"
                                                        className="btn btn-icon btn-sm btn-ghost-danger fs-16"
                                                        onClick={onCloseClick}
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>

                        <Row>
                            <Col xxl={12}>
                                <Card>
                                    <CardBody>
                                        <Row>
                                            <Col lg={6}>
                                                <Card>
                                                    <CardBody>
                                                        <div className="d-flex align-items-center mb-4">
                                                            <h5 className="card-title flex-grow-1 mb-0">
                                                                Request Details
                                                            </h5>
                                                            <div className="flex-shrink-0">
                                                                <ReturnButton
                                                                    isShowButton={state.data?.actions?.return}
                                                                    onClick={() => {
                                                                        handleActions(false, "Return");
                                                                    }}
                                                                />{" "}
                                                                <ApproveButton
                                                                    isShowButton={state.data?.actions?.approve}
                                                                    onClick={() => {
                                                                        handleActions(false, "Approve");
                                                                    }}
                                                                />{" "}
                                                                <RejectButton
                                                                    isShowButton={state.data?.actions?.reject}
                                                                    onClick={(e) => {
                                                                        handleActions(false, "Reject");
                                                                    }}
                                                                />{" "}
                                                                <CancelButton
                                                                    isShowButton={state.data?.actions?.cancel}
                                                                    onClick={(e) => {
                                                                        handleActions(false, "Cancel");
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        <Row>
                                                            <Col lg={12}>
                                                                <InputField
                                                                    disabled={isViewerOnly}
                                                                    rows={4}
                                                                    name="remarks"
                                                                    control={control}
                                                                    label="Remarks"
                                                                    type="textarea"
                                                                    placeholder="Remarks here..."
                                                                />
                                                            </Col>

                                                            <div className="col-12">
                                                                <hr className="pb-2" />
                                                            </div>

                                                            <Col lg={6}>
                                                                <DatePickerField
                                                                    control={control}
                                                                    name="dateSubmitted"
                                                                    label="Date Submitted"
                                                                    disabled
                                                                />
                                                            </Col>
                                                            <Col lg={6}>
                                                                <InputField
                                                                    control={control}
                                                                    name="submittedByName"
                                                                    label="Submitted By"
                                                                    disabled
                                                                />
                                                            </Col>
                                                            {findData?.statusName !== "Submitted" ? (
                                                                <>
                                                                    <Col lg={6}>
                                                                        <DatePickerField
                                                                            control={control}
                                                                            name="statusDate"
                                                                            label={`Date ${findData?.statusName}`}
                                                                            disabled
                                                                        />
                                                                    </Col>
                                                                    <Col lg={6}>
                                                                        <InputField
                                                                            control={control}
                                                                            name="statusByName"
                                                                            label={`${findData?.statusName} By`}
                                                                            disabled
                                                                        />
                                                                    </Col>
                                                                </>
                                                            ) : null}
                                                        </Row>
                                                    </CardBody>
                                                </Card>
                                            </Col>

                                            <Col lg={6}>
                                                <History
                                                    key={state.refetchHistory}
                                                    parentId={data?.journalEntryVoucherId}
                                                />
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </ModalBody>
            </Modal>
        </React.Fragment>
    );
};

export default ViewDetails;
