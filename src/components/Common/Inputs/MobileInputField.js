import React from "react";
import { Controller } from "react-hook-form";
import { Input, Label } from "reactstrap";
import "@/assets/scss/dxo-eas.scss";

export const MobileInputField = ({
  name,
  control,
  label,
  type = "text",
  rules = {},
  placeholder = "",
  customValidation = false,
  disabledMarginBottom,
  ...props
}) => {
  const isRequired = !!rules?.required; // ✅ Check if required rule exists

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
        <Label for={name} className="form-label">
          {label}
          {isRequired && <span className="required-asterisk">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="form-icon">
              <Input
                className="custom-input form-control-icon"
                id={name}
                type={type}
                placeholder={placeholder}
                invalid={!!error || customValidation}
                value={field.value || ''} // Add this to ensure it's never undefined
                {...field}
                {...props}
                onChange={(e) => {
                  let value = e.target.value;
                  // Allow only digits and '+'
                  value = value.replace(/[^0-9+]/g, "");
                  // Keep only one '+', at the start
                  if (value.includes("+")) {
                    value = "+" + value.replace(/\+/g, "");
                  }
                  // Limit to 15 characters
                  value = value.slice(0, 15);

                  field.onChange(value);
                }}
              />
              <i className="ri-phone-line text-muted"></i>
            </div>

            {(error || customValidation) && (
              <div className="invalid-feedback d-block">
                {error?.message || rules?.required}
              </div>
            )}
          </>
        )}
      />
    </div>
  );
};
