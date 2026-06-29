import { Controller } from "react-hook-form";
import { Input, Label } from "reactstrap";

export const NameInputField = ({
  name,
  control,
  label,
  rules = {},
  placeholder = "Enter full name",
  disabledMarginBottom,
  customValidation = false,
  uppercase = false,
  maxLength = 100,
  minLength = 0,
  ...props
}) => {
  const isRequired = !!rules?.required;

  const nameRules = {
    ...rules,
    pattern: {
      value: /^[a-zA-ZÀ-ÖØ-öø-ÿ\s\-\.]+$/,
      message: "Only letters, spaces, hyphens, and periods are allowed.",
    },
    minLength: minLength > 0 ? {
      value: minLength,
      message: `Name must be at least ${minLength} characters.`,
    } : undefined,
    validate: {
      noDoubleSpaces: (v) =>
        !v || !/\s{2,}/.test(v) || "Name must not contain consecutive spaces.",
      noLeadingTrailingSpaces: (v) =>
        !v || v.trim() === v || "Name must not start or end with spaces.",
      ...rules?.validate,
    },
  };

  const toTitleCase = (str) =>
    str.replace(/\b\w/g, (char) => char.toUpperCase());

  const formatValue = (value) => {
    if (uppercase) return value.toUpperCase();
    return toTitleCase(value);
  };

  return (
    <div className={disabledMarginBottom ? "mb-0" : "mb-3"}>
      <style>{`
        .required-asterisk { color: red; margin-left: 4px; }
        .custom-input:disabled:hover {
          outline: none !important;
          box-shadow: none !important;
          border-color: var(--vz-border-color) !important;
        }
      `}</style>

      {label && (
        <Label for={name} className="form-label">
          {label}
          {isRequired && <span className="required-asterisk">*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        rules={nameRules}
        render={({ field, fieldState: { error } }) => (
          <>
            <Input
              className="custom-input"
              id={name}
              type="text"
              placeholder={placeholder}
              invalid={!!error || customValidation}
              maxLength={maxLength}
              minLength={minLength}
              {...field}
              value={field.value || ""}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ\s\-\.]/g, "");
                const formatted = uppercase ? cleaned.toUpperCase() : cleaned;
                field.onChange(formatted);
              }}
              onBlur={(e) => {
                const trimmed = formatValue(e.target.value.trim());
                field.onChange(trimmed);
                field.onBlur();
              }}
              {...props}
            />
            {(error || customValidation) && (
              <div className="invalid-feedback d-block">
                {error?.message || (typeof rules?.required === "string" ? rules.required : undefined)}
              </div>
            )}
          </>
        )}
      />
    </div>
  );
};