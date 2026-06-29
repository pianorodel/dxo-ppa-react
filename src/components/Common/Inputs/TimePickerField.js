import React from "react";
import { Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";

export const TimePickerField = ({
  control,
  name,
  label = "Time",
  placeholder = "Select Time",
  rules = {},
  className = "",
  disabled = false,
  disabledMarginBottom,
  use24hr = false,
  ...props
}) => {
  const isRequired = !!rules?.required;
  const customIconStyle = { top: "17px", position: "absolute" };

  const inputBg = getComputedStyle(document.documentElement).getPropertyValue("--vz-tertiary-bg").trim();
  const inputColor = getComputedStyle(document.documentElement).getPropertyValue("--vz-body-color").trim();
  const inputBorder = getComputedStyle(document.documentElement).getPropertyValue("--vz-input-border-custom").trim();

  const disabledStyle = {
    backgroundColor: inputBg || "#eff2f7",
    color: inputColor || "#6c757d",
    border: `1px solid ${inputBorder || "#ced4da"}`,
    opacity: 1,
  };

  // Format: returns "HH:mm:ss" string only
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Parse "HH:mm:ss" back to Date for Flatpickr value
  const parseTimeValue = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;

    // "HH:mm:ss" format
    const [hours, minutes, seconds] = value.split(":").map(Number);
    const date = new Date();
    date.setHours(hours || 0, minutes || 0, seconds || 0, 0);
    return date;
  };

  return (
    <div className={disabledMarginBottom ? "mb-0" : "mb-3"}>
      <style>{`.required-asterisk { color: red; margin-left: 4px; }`}</style>

      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {isRequired && <span className="required-asterisk">*</span>}
        </label>
      )}

      <div className="form-icon">
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState }) => {
            const fieldValue = parseTimeValue(field.value);

            return (
              <>
                <Flatpickr
                  id={name}
                  value={fieldValue}
                  disabled={disabled}
                  style={disabled ? disabledStyle : {}}
                  className={`form-control form-control-icon custom-input ${fieldState.error ? "is-invalid" : ""} ${className}`}
                  options={{
                    enableTime: true,
                    noCalendar: true,
                    dateFormat: use24hr ? "H:i" : "h:i K",
                    time_24hr: use24hr,
                    allowInput: true,
                    disableMobile: true,
                  }}
                  placeholder={placeholder}
                  onChange={(selectedDates) => {
                    if (!selectedDates || selectedDates.length === 0) {
                      field.onChange(null);
                      return;
                    }
                    // Store as "HH:mm:ss" string
                    field.onChange(formatTime(selectedDates[0]));
                  }}
                  onReady={(selectedDates, dateStr, instance) => {
                    if (fieldValue) instance.setDate(fieldValue, false);
                  }}
                  {...props}
                />

                <div style={customIconStyle}>
                  <i className="ri-time-line text-muted"></i>
                </div>

                {fieldState.error && (
                  <div className="invalid-feedback">{fieldState.error.message}</div>
                )}
              </>
            );
          }}
        />
      </div>
    </div>
  );
};