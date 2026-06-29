import React from "react";
import { ButtonGroup, Input, Label } from "reactstrap";
import { Controller } from "react-hook-form";

const RadioButtonGroup = ({
  name,
  label,
  control,
  options = [],
  getOptionValue = (option) => option.value,
  getOptionLabel = (option) => option.label,
  rules = {},
  disabled = false, // ✅ new prop
}) => {
  const isRequired = !!rules?.required;

  return (
    <div className="mb-3">
      <style>
        {`
          .required-asterisk {
            color: red;
            margin-left: 4px;
          }
        `}
      </style>

      {label && (
        <Label className="form-label">
          {label}
          {isRequired && <span className="required-asterisk">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const selectedValue =
            typeof value === "object" && value !== null
              ? getOptionValue(value)
              : value;

          return (
            <>
              <ButtonGroup style={{ zIndex: 0 }}>
                {options.map((opt, index) => {
                  const optionValue = getOptionValue(opt);
                  const optionLabel = getOptionLabel(opt);
                  const isSelected = selectedValue === optionValue;
                  const inputId = `${name}_${index}`;

                  return (
                    <React.Fragment key={optionValue}>
                      <Input
                        type="radio"
                        className="btn-check"
                        name={name}
                        id={inputId}
                        checked={isSelected}
                        onChange={() => onChange(opt)}
                        disabled={disabled} // ✅ apply disabled
                      />
                      <Label
                        className={`btn btn-outline-success mb-0 material-shadow-none ${
                          isSelected ? "active" : ""
                        }`}
                        htmlFor={inputId}
                        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
                      >
                        {optionLabel}
                      </Label>
                    </React.Fragment>
                  );
                })}
              </ButtonGroup>

              {error && (
                <div className="invalid-feedback d-block">
                  {error.message}
                </div>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export default RadioButtonGroup;
