import React, { useEffect, useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import Flatpickr from "react-flatpickr";

const pad = (n) => String(n).padStart(2, "0");

const formatLocalDateTime = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

const isToday = (date) => {
  const t = new Date();
  return date.getDate() === t.getDate() && date.getMonth() === t.getMonth() && date.getFullYear() === t.getFullYear();
};

const toDate = (v) => (typeof v === "string" ? new Date(v) : v);

export const DatePickerField = ({
  control,
  name,
  label = "Date",
  placeholder = "Select Date",
  rules = {},
  className = "",
  disabled = false,
  options,
  disabledMarginBottom,
  // When true, picking today's date stamps the current time onto it.
  // Off by default so the picker doesn't silently overwrite the chosen time.
  stampCurrentTime = true,
  // When true, maxDate is extended to "today's clock + 10 min" (legacy behavior).
  extendMaxDateToNow = false,
  ...props
}) => {
  const isRequired = !!rules?.required;

  // Theme-reactive CSS vars (mirrors AsyncSelect pattern).
  const [themeVars, setThemeVars] = useState({});
  useEffect(() => {
    const read = () => {
      const root = document.documentElement;
      setThemeVars({
        inputBg: getComputedStyle(root).getPropertyValue("--vz-tertiary-bg").trim(),
        inputColor: getComputedStyle(root).getPropertyValue("--vz-body-color").trim(),
        inputBorder: getComputedStyle(root).getPropertyValue("--vz-input-border-custom").trim(),
      });
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme", "class"] });
    return () => observer.disconnect();
  }, []);

  const disabledStyle = useMemo(
    () => ({
      backgroundColor: themeVars.inputBg || "#eff2f7",
      color: themeVars.inputColor || "#6c757d",
      border: `1px solid ${themeVars.inputBorder || "#ced4da"}`,
      opacity: 1,
    }),
    [themeVars],
  );

  const adjustedOptions = useMemo(() => {
    let opts = options;
    if (extendMaxDateToNow && opts?.maxDate) {
      const maxDate = new Date(opts.maxDate);
      const now = new Date();
      opts = {
        ...opts,
        maxDate: new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), now.getHours(), now.getMinutes() + 10, now.getSeconds(), now.getMilliseconds()),
      };
    }
    if (opts?.maxDate) {
      const max = new Date(opts.maxDate);
      const today = new Date();
      if (max.getFullYear() === today.getFullYear() && max.getMonth() === today.getMonth() && max.getDate() === today.getDate()) {
        opts = { ...opts, maxDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999) };
      }
    }
    return opts;
  }, [options, extendMaxDateToNow]);

  const applyStamp = (date) => {
    if (stampCurrentTime && isToday(date)) {
      const now = new Date();
      date.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    }
    return date;
  };

  const iconStyle = { top: "17px", position: "absolute" };

  return (
    <div className={disabledMarginBottom ? "mb-0" : "mb-3"}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {isRequired && <span style={{ color: "var(--vz-danger, red)", marginLeft: 4 }}>*</span>}
        </label>
      )}

      <div className="form-icon">
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field, fieldState }) => {
            const fieldValue = Array.isArray(field.value)
              ? field.value.map(toDate)
              : field.value
                ? toDate(field.value)
                : null;

            return (
              <>
                <Flatpickr
                  id={name}
                  value={fieldValue}
                  disabled={disabled}
                  style={disabled ? disabledStyle : undefined}
                  className={`form-control form-control-icon custom-input ${fieldState.error ? "is-invalid" : ""} ${className}`}
                  options={{
                    dateFormat: "d M, Y",
                    allowInput: true,
                    disableMobile: true,
                    ...adjustedOptions,
                  }}
                  placeholder={placeholder}
                  onChange={(selectedDates) => {
                    if (!selectedDates?.length) {
                      field.onChange(null);
                      return;
                    }
                    if (selectedDates.length === 1) {
                      const formatted = formatLocalDateTime(applyStamp(new Date(selectedDates[0])));
                      field.onChange(adjustedOptions?.mode === "range" ? [formatted] : formatted);
                    } else {
                      const [start, end] = selectedDates;
                      field.onChange([
                        formatLocalDateTime(applyStamp(new Date(start))),
                        formatLocalDateTime(applyStamp(new Date(end))),
                      ]);
                    }
                  }}
                  onBlur={field.onBlur}
                  {...props}
                />

                <div style={iconStyle}>
                  <i className="ri-calendar-event-line text-muted" />
                </div>

                {fieldState.error && <div className="invalid-feedback d-block">{fieldState.error.message}</div>}
              </>
            );
          }}
        />
      </div>
    </div>
  );
};

export default DatePickerField;