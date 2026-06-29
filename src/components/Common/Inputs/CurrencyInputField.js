import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { Input, Label } from "reactstrap";

export const CurrencyInputField = ({
  name,
  control,
  label,
  placeholder = "",
  rules = {},
  disabled = false,
  formatDelay = 500,
}) => {
  const isRequired = !!rules?.required;

  const formatNumber = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const num = Number(String(value).replace(/,/g, ""));
    if (isNaN(num)) return "";
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const parseNumber = (value) => value?.replace(/,/g, "") || "";

  const removeTrailingZeros = (value) => {
    if (!value) return "";
    const clean = String(value).replace(/,/g, "");
    return clean.replace(/(\.\d*?)(0+$)/, "$1").replace(/\.$/, "");
  };

  const sanitizeInput = (value) => {
    let clean = value.replace(/[^\d.]/g, "");
    const parts = clean.split(".");
    if (parts.length > 2) clean = parts[0] + "." + parts[1];
    if (clean.startsWith("00") && !clean.startsWith("0.")) clean = clean.replace(/^0+/, "0");
    return clean;
  };

  return (
    <div className="mb-3">
      {label && (
        <Label for={name} className="form-label">
          {label}
          {isRequired && <span style={{ color: "red", marginLeft: 4 }}>*</span>}
        </Label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => {
          const [displayValue, setDisplayValue] = useState(formatNumber(field.value));
          const [isFocused, setIsFocused] = useState(false);
          const delayTimer = useRef(null);

          /** 🔥 FIX: Sync display when field.value changes (reset, findData load) */
          useEffect(() => {
            if (!isFocused) {
              setDisplayValue(formatNumber(field.value));
            }
          }, [field.value, isFocused]);

          const handleFocus = (e) => {
            setIsFocused(true);
            const rawVal = parseNumber(displayValue);
            const noZeros = removeTrailingZeros(rawVal);
            setDisplayValue(noZeros);

            setTimeout(() => {
              const numValue = Number(rawVal);
              if (numValue === 0 || rawVal === "0" || rawVal === "0.00" || rawVal === "") {
                e.target.select();
              }
            }, 0);
          };

          const handleBlur = () => {
            setIsFocused(false);
            const formatted = formatNumber(field.value);
            setDisplayValue(formatted);
          };

          const handleChange = (e) => {
            let inputVal = sanitizeInput(e.target.value);
            const rawVal = parseNumber(inputVal);

            field.onChange(rawVal); // update RHF value
            setDisplayValue(inputVal);

            if (delayTimer.current) clearTimeout(delayTimer.current);
            delayTimer.current = setTimeout(() => {
              if (!isFocused) {
                setDisplayValue(formatNumber(rawVal));
              }
            }, formatDelay);
          };

          useEffect(() => {
            return () => clearTimeout(delayTimer.current);
          }, []);

          return (
            <>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#6c757d",
                  }}
                >
                  ₱
                </span>

                <Input
                  id={name}
                  type="text"
                  placeholder={placeholder}
                  value={displayValue ?? ""}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  invalid={!!error}
                  disabled={disabled}
                  style={{
                    paddingLeft: "25px",
                    transition: "all 0.2s ease-in-out",
                  }}
                />
              </div>

              {error && (
                <div className="invalid-feedback d-block">
                  {error?.message || "Invalid amount"}
                </div>
              )}
            </>
          );
        }}
      />
    </div>
  );
};
