import { Controller } from "react-hook-form";
import SelectLib from "react-select";
import { Label } from "reactstrap";

export const NormalSelect = ({
  name,
  control,
  label,
  options = [],
  defaultValue = null,
  rules = {},
  placeholder = "",
  styles = {},
  getOptionValue = (option) => option.value,
  getOptionLabel = (option) => option.label,
  isMulti = false,
  disabledMarginBottom,
  ...restProps
}) => {
  const isRequired = !!rules?.required; // ✅ Check if field is required

  return (
    <div className={disabledMarginBottom ? "mb-0" : "mb-3"}>
      <style>
        {`
          .required-asterisk {
            color: red;
            margin-left: 4px;
          }
        `}
      </style>

      {label && (
        <Label htmlFor={name} className="form-label">
          {label}
          {isRequired && <span className="required-asterisk">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        rules={rules}
        render={({ field, fieldState: { error } }) => {
          const hasError = !!error;
          const isDisabled = restProps.isDisabled || restProps.disabled;

          const inputBg = getComputedStyle(document.documentElement)
            .getPropertyValue("--vz-input-bg-custom")
            .trim();
          const bodyColor = getComputedStyle(document.documentElement)
            .getPropertyValue("--vz-body-color")
            .trim();
          const borderColor = getComputedStyle(document.documentElement)
            .getPropertyValue("--vz-input-border-custom")
            .trim();
          const tertiaryBg = getComputedStyle(document.documentElement)
            .getPropertyValue("--vz-tertiary-bg")
            .trim();

          const customStyles = {
            control: (provided, state) => ({
              ...provided,
              borderWidth: "1px",
              borderStyle: "solid",
              borderColor: hasError
                ? "var(--vz-form-invalid-color)"
                : borderColor,
              boxShadow: state.isFocused
                ? hasError
                  ? "var(--vz-form-invalid-color)"
                  : "0 0 0 1px #2684FF"
                : "none",
              "&:hover": {
                borderColor: "#2684FF",
              },
              minHeight: "38px",
              backgroundColor: isDisabled ? tertiaryBg : inputBg,
              color: bodyColor,
              cursor: isDisabled ? "not-allowed" : "default",
              opacity: isDisabled ? 1 : undefined,
            }),
            input: (provided) => ({
              ...provided,
              color: bodyColor,
            }),
            singleValue: (provided) => ({
              ...provided,
              color: bodyColor,
            }),
            multiValue: (provided) => ({
              ...provided,
              backgroundColor: "var(--vz-primary)",
              color: "var(--vz-white)",
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              color: "var(--vz-white)",
            }),
            multiValueRemove: (provided) => ({
              ...provided,
              color: "var(--vz-white)",
              ":hover": {
                backgroundColor: "var(--vz-danger)",
                color: "white",
              },
            }),
            ...styles,
          };

          return (
            <>
              <SelectLib
                id={name}
                options={options}
                isMulti={isMulti}
                placeholder={placeholder}
                getOptionValue={getOptionValue}
                getOptionLabel={getOptionLabel}
                styles={customStyles}
                onChange={(selected) => field.onChange(selected)}
                value={field.value}
                {...field}
                {...restProps}
              />
              {hasError && (
                <div className="invalid-feedback d-block">{error.message}</div>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default NormalSelect;
