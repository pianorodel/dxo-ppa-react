import { DatePickerField, InputField } from "@/components/Common/Inputs";
import NormalSelect from "@/components/Common/Inputs/NormalSelect";
import { formatDate } from "@/helpers/date_helper";

const Particulars = ({ state, customFunction, control }) => {
  const handleSelect = (value) => {
    customFunction.updateState({
      data: {
        ...state.data,
        fundingSourceId: value,
      },
    });
  };
  const handleDate = (value) => {
    customFunction.updateState({
      data: {
        ...state.data,
        transactionDate: formatDate(value[0]),
      },
    });
  };
  const handleParticulars = (e) => {
    customFunction.updateState({
      data: {
        ...state.data,
        particulars: e.target.value,
      },
    });
  };

  return (
    <div>
      <NormalSelect
        options={[
          { value: "All ", label: "All " },
          { value: "Regular Agency Fund", label: "Regular Agency Fund" },
          { value: "Special Agency Fund", label: "Special Agency Fund" },
          { value: "Trust Fund", label: "Trust Fund" },
        ]}
        control={control}
        name="fundingSourceId"
        label="Funding Source"
        placeholder="Select funding source..."
        value={state.data?.fundingSourceId}
        onChange={handleSelect}
      />
      <DatePickerField onChange={handleDate} value={state.data?.transactionDate} control={control} name="transactionDate" label="Transaction Date" />
      <InputField
        name="particulars"
        control={control}
        defaultValue={state.data?.particulars}
        label="Particulars"
        type="textarea"
        placeholder="Enter particulars..."
        rows={4}
        onBlur={handleParticulars}
      />
      {/* <div className="mt-2   d-flex align-content-center justify-content-end">
        <SaveButton /> &nbsp;
      </div> */}
    </div>
  );
};

export default Particulars;
