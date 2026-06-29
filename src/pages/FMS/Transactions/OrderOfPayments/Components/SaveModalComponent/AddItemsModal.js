import { useLookUpTransactionTypesMutation } from "@/api/Endpoints/FMS/StaticData/TransactionTypes";
import { CloseButton, SaveButton, } from "@/components/Common/Buttons";
import { AsyncSelect, InputField } from "@/components/Common/Inputs";
import { CurrencyInputField } from "@/components/Common/Inputs/CurrencyInputField";
import DxoModalComponent from "@/components/Common/Modals/DxoModalComponent";
import { buildPayload, buildSelectPairs, flattenSelectPairs, formatLoadOptions } from "@/helpers/data_helper";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Col, Modal, ModalBody, ModalHeader, Row } from "reactstrap";

const AddItemsModal = ({ data = null, show, onCloseClick }) => {
  const [lookupTypes] = useLookUpTransactionTypesMutation();

  const defaultValues = {
    "itemId": 0,
    "quantity": '',
    "transactionTypeId": 0,
    "transactionTypeName": "",
    "description": "",
    "amount": ''
  }

  const {
    control,
    handleSubmit,
    reset
  } = useForm({ defaultValues });

  // reset form values on modal open
  useEffect(() => {
    if (show) {
      reset({
        ...defaultValues,
        ...data,
        ...buildSelectPairs(['transactionTypeId'], data),
      });
    }
  }, [show, data, reset]);

  const onSubmit = (formData) => {
    const payload = {
      ...buildPayload(defaultValues, formData),
      itemId: data?.itemId || Date.now(),
      ...flattenSelectPairs(["transactionTypeId"], formData),
    };

    onCloseClick(true, payload);
  };


  return (
    <>
      <DxoModalComponent
        title={data?.itemId ? "Update Item" : "Add Item"}
        isOpen={show}
        onClose={onCloseClick}
        defaultExpanded={false}
        defaultSize="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col lg="12">
              <AsyncSelect
                name="transactionTypeId"
                control={control}
                label="Transaction Type"
                loadOptions={formatLoadOptions(lookupTypes)}
                rules={{ required: "Transaction type is required." }}
                getOptionValue={(opt) => opt.transactionTypeId || opt.value}
                getOptionLabel={(opt) => opt.transactionTypeName || opt.label}
                placeholder="Select transaction type..."
              />
            </Col>
            <Col lg="6">
              <InputField
                name="quantity"
                control={control}
                label="Quantity"
                type="number"
                rules={{
                  required: "Quantity is required.",
                  validate: (value) =>
                    parseFloat(value) > 0 || "Quantity should be greater than zero.",
                }}
                placeholder="Enter quantity..."
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Col>
            <Col lg="6">
              <CurrencyInputField
                name="amount"
                control={control}
                label="Amount"
                type="number"
                rules={{
                  required: "Amount is required.",
                  validate: (value) =>
                    parseFloat(value) > 0 || "Amount should be greater than zero.",
                }}
                placeholder="Enter amount..."
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Col>
            <Col lg="12">
              <InputField
                rows={5}
                name="description"
                control={control}
                label="Description"
                type="textarea"
                rules={{ required: "Description is required." }}
                placeholder="Enter description..."
              />
            </Col>
          </Row>

          <div className="hstack gap-2 justify-content-end">
            <CloseButton onClick={() => onCloseClick(false, undefined)} />
            <SaveButton btnColor={"btn-primary"} type="submit" />
          </div>
        </form>
      </DxoModalComponent>
    </>
  );
};

export default AddItemsModal;
