import React from "react";
import { Controller } from "react-hook-form";
import { Input, Label } from "reactstrap";
import "@/assets/scss/dxo-eas.scss";

// sample usage:
//   <EmailInputField
//     name="email"
//     control={control}
//     label="Email Address"
//     type="email"
//     rules={{ required: "Email is required." }}
//     placeholder="Enter your email..."
//   />

export const EmailInputField = ({
  name,
  control,
  label,
  type = "email",
  rules = {},
  placeholder = "",
  customValidation = false,
  disabledMarginBottom,
  ...props
}) => {
  const isRequired = !!rules?.required; // ✅ Check if field is required

  const emailPattern = {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: "Please enter a valid email address"
  };

  const validationRules = {
    ...rules,
    pattern: rules.pattern || emailPattern, // Use custom pattern if provided, otherwise use default
  };

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
        rules={validationRules}
        render={({ field, fieldState: { error } }) => (
          <>
            <div className="form-icon">
              <Input
                className="custom-input form-control-icon"
                id={name}
                type={type}
                placeholder={placeholder}
                invalid={!!error || customValidation}
                maxLength={100}
                value={field.value || ''} // Add this to ensure it's never undefined
                {...field}
                {...props}
              />
              <i className="ri-mail-unread-line text-muted"></i>
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
