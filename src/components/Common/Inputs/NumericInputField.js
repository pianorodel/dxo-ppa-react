import "@/assets/scss/dxo-eas.scss";
import { Controller } from "react-hook-form";
import { Input, Label } from "reactstrap";

export const NumericInputField = ({
  name,
  control,
  label,
  rows,
  rules = {},
  placeholder = "",
  customValidation = false,
  disabledMarginBottom,
  maxLength = 20,
  ...props
}) => {
  const isRequired = !!rules?.required; // Check if field is required

  return (
    <div className={disabledMarginBottom ? "mb-0" : "mb-3"}>
      <style>
        {`
          #${name}::-ms-reveal,
          #${name}::-ms-clear,
          #${name}::-webkit-credentials-auto-fill-button,
          #${name}::-webkit-textfield-decoration-container {
            display: initial !important;
            visibility: visible !important;
          }

          .custom-input:disabled:hover {
            outline: none !important;
            box-shadow: none !important;
            border-color: var(--vz-border-color) !important;
          }

          .required-asterisk {
            color: red;
            margin-left: 4px;
          }

          .input-wrapper {
            position: relative;
          }

          .char-counter-inside {
            position: absolute;
            bottom: 8px;
            right: 12px;
            font-size: 0.75rem;
            color: #6c757d;
            background-color: rgba(255, 255, 255, 0.9);
            padding: 2px 6px;
            border-radius: 4px;
            pointer-events: none;
            user-select: none;
            transition: background-color 0.2s, color 0.2s;
          }

          /* Dark mode styles */
          [data-layout-mode="dark"] .char-counter-inside,
          [data-bs-theme="dark"] .char-counter-inside,
          .dark-mode .char-counter-inside {
            color: #adb5bd;
            background-color: rgba(33, 37, 41, 0.9);
          }

          .char-counter-inside.near-limit {
            color: #ff9800;
          }

          [data-layout-mode="dark"] .char-counter-inside.near-limit,
          [data-bs-theme="dark"] .char-counter-inside.near-limit,
          .dark-mode .char-counter-inside.near-limit {
            color: #ffb74d;
          }

          .char-counter-inside.at-limit {
            color: #dc3545;
          }

          [data-layout-mode="dark"] .char-counter-inside.at-limit,
          [data-bs-theme="dark"] .char-counter-inside.at-limit,
          .dark-mode .char-counter-inside.at-limit {
            color: #f44336;
          }

          .custom-input.with-counter {
            padding-right: 65px;
          }

          .custom-input.with-counter[type="textarea"] {
            padding-bottom: 30px;
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
        render={({ field, fieldState: { error } }) => {
          const currentLength = field.value?.length || 0;
          const isNearLimit = maxLength && currentLength >= maxLength * 0.9;
          const isAtLimit = maxLength && currentLength >= maxLength;

          return (
            <>
              <div className="input-wrapper">
                <Input
                  className={`custom-input`}
                  id={name}
                  type={"number"}
                  placeholder={placeholder}
                  invalid={!!error || customValidation}
                  maxLength={maxLength}
                  step="1"
                  onKeyPress={(e) => {
                    if (e.key === '.' || e.key === ',') {
                      e.preventDefault();
                    }
                  }}
                  onFocus={(e) => {
                    if (e.target.value === '0' || e.target.value === 0) {
                      e.target.select();
                    }
                  }}
                  onInput={(e) => {
                    if (e.target.value.length > maxLength) {
                      e.target.value = e.target.value.slice(0, maxLength);
                    }
                  }}
                  {...field}
                  {...props}
                />
              </div>
              {(error || customValidation) && (
                <div className="invalid-feedback d-block">
                  {error?.message || rules?.required}
                </div>
              )}
            </>
          );
        }}
      />
    </div>
  );
};