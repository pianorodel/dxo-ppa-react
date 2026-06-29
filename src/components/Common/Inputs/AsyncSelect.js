import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import AsyncSelectLib from "react-select/async";
import AsyncCreatableSelectLib from "react-select/async-creatable";
import { Label } from "reactstrap";

export const AsyncSelect = ({
  name,
  control,
  label,
  loadOptions,
  isMulti = false,
  defaultValue = [],
  rules = {},
  placeholder = "",
  styles = {},
  getOptionValue = (option) => option.value,
  getOptionLabel = (option) => option.label,
  cacheOptions = false,
  defaultOptions = false,
  isClearable = true,
  isLocal = true,
  disabledMarginBottom,
  prefetchOnMount = true,
  maxInitialOptions = 100,
  withCreate = false,
  onCreateOption,
  refreshKey,
  formatCreateLabel = (inputValue) => (
    <span className="badge bg-info-subtle text-info" style={{ fontSize: "13px" }}>
      <i className="ri-add-line align-bottom me-1" />
      Create "{inputValue}"
    </span>
  ),
  isValidNewOption,
  getNewOptionData,
  createOptionPosition = "last",
  ...restProps
}) => {
  const [focusLoaded, setFocusLoaded] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [themeVars, setThemeVars] = useState({});

  const loadingRef = useRef(false);
  const isRequired = !!rules?.required;

  const SelectComponent = withCreate ? AsyncCreatableSelectLib : AsyncSelectLib;

  useEffect(() => {
    const updateThemeVars = () => {
      const root = document.documentElement;
      setThemeVars({
        inputBg: getComputedStyle(root).getPropertyValue("--vz-input-bg-custom").trim(),
        bodyColor: getComputedStyle(root).getPropertyValue("--vz-body-color").trim(),
        borderColor: getComputedStyle(root).getPropertyValue("--vz-input-border-custom").trim(),
        tertiaryBg: getComputedStyle(root).getPropertyValue("--vz-tertiary-bg").trim(),
        invalidColor: getComputedStyle(root).getPropertyValue("--vz-form-invalid-color").trim(),
        primaryColor: getComputedStyle(root).getPropertyValue("--vz-primary").trim(),
        whiteColor: getComputedStyle(root).getPropertyValue("--vz-white").trim(),
        dangerColor: getComputedStyle(root).getPropertyValue("--vz-danger").trim(),
        infoColor: getComputedStyle(root).getPropertyValue("--vz-info").trim(),
      });
    };

    updateThemeVars();
    const observer = new MutationObserver(updateThemeVars);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-bs-theme", "class"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!prefetchOnMount || typeof loadOptions !== "function") return;
    if (loadingRef.current || focusLoaded) return;

    loadingRef.current = true;
    setLocalLoading(true);

    loadOptions("")
      .then((options) => {
        setDynamicOptions(options ?? []);
        setFocusLoaded(true);
      })
      .catch(console.warn)
      .finally(() => {
        setLocalLoading(false);
        loadingRef.current = false;
      });
  }, [prefetchOnMount]);

  const prevRefreshKeyRef = useRef(refreshKey);

  useEffect(() => {
    if (refreshKey === undefined || refreshKey === prevRefreshKeyRef.current) return;
    prevRefreshKeyRef.current = refreshKey;

    if (typeof loadOptions !== "function") return;

    setFocusLoaded(false);
    setDynamicOptions([]);

    if (!prefetchOnMount) return;

    loadingRef.current = true;
    setLocalLoading(true);

    loadOptions("")
      .then((options) => {
        setDynamicOptions(options ?? []);
        setFocusLoaded(true);
      })
      .catch(console.warn)
      .finally(() => {
        setLocalLoading(false);
        loadingRef.current = false;
      });
  }, [refreshKey, loadOptions, prefetchOnMount]);

  const handleFocus = useCallback(async () => {
    if (focusLoaded || loadingRef.current || typeof loadOptions !== "function") return;

    loadingRef.current = true;
    setLocalLoading(true);
    try {
      const options = await loadOptions("");
      setDynamicOptions(options ?? []);
      setFocusLoaded(true);
    } catch (err) {
      console.warn("AsyncSelect focus load error:", err);
    } finally {
      setLocalLoading(false);
      loadingRef.current = false;
    }
  }, [focusLoaded, loadOptions]);

  const wrappedLoadOptions = useCallback(
    async (inputValue) => {
      if (isLocal && dynamicOptions.length) {
        const lower = inputValue.toLowerCase();
        const filtered = dynamicOptions.filter((option) =>
          String(getOptionLabel(option) ?? "")
            .toLowerCase()
            .includes(lower),
        );
        return inputValue ? filtered : filtered.slice(0, maxInitialOptions);
      }

      try {
        const options = await loadOptions(inputValue);
        if (!focusLoaded) {
          setDynamicOptions(options ?? []);
          setFocusLoaded(true);
        }
        return inputValue ? (options ?? []) : (options ?? []).slice(0, maxInitialOptions);
      } catch (err) {
        console.warn("AsyncSelect loadOptions error:", err);
        return [];
      }
    },
    [isLocal, dynamicOptions, getOptionLabel, loadOptions, focusLoaded, maxInitialOptions],
  );

  const slicedDefaultOptions = useMemo(() => {
    if (dynamicOptions.length) return dynamicOptions.slice(0, maxInitialOptions);
    return defaultOptions;
  }, [dynamicOptions, defaultOptions, maxInitialOptions]);

  const buildStyles = useMemo(
    () => (hasError, isDisabled) => ({
      control: (provided, state) => ({
        ...provided,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: hasError ? themeVars.invalidColor : themeVars.borderColor,
        boxShadow: state.isFocused ? (hasError ? `0 0 0 1px ${themeVars.invalidColor}` : "0 0 0 1px #2684FF") : "none",
        "&:hover": {
          borderColor: hasError ? themeVars.invalidColor : "#2684FF",
          cursor: "pointer",
        },
        minHeight: "38px",
        backgroundColor: isDisabled ? themeVars.tertiaryBg : themeVars.inputBg,
        color: themeVars.bodyColor,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isDisabled ? 1 : undefined,
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: themeVars.inputBg,
        color: themeVars.bodyColor,
        zIndex: 9999,
      }),
      menuPortal: (provided) => ({
        ...provided,
        zIndex: 9999,
      }),
      option: (provided, state) => {
        const isNew = state.data?.__isNew__;
        if (isNew) {
          return {
            ...provided,
            backgroundColor: state.isFocused ? `${themeVars.infoColor}1a` : themeVars.inputBg,
            cursor: "pointer",
            padding: "6px 12px",
          };
        }
        return {
          ...provided,
          backgroundColor: state.isSelected ? themeVars.primaryColor : state.isFocused ? `${themeVars.primaryColor}22` : themeVars.inputBg,
          color: state.isSelected ? themeVars.whiteColor : themeVars.bodyColor,
          cursor: "pointer",
        };
      },
      input: (provided) => ({
        ...provided,
        color: themeVars.bodyColor,
      }),
      singleValue: (provided) => ({
        ...provided,
        color: themeVars.bodyColor,
      }),
      multiValue: (provided) => ({
        ...provided,
        backgroundColor: themeVars.primaryColor,
        color: themeVars.whiteColor,
      }),
      multiValueLabel: (provided) => ({
        ...provided,
        color: themeVars.whiteColor,
      }),
      multiValueRemove: (provided) => ({
        ...provided,
        color: themeVars.whiteColor,
        ":hover": {
          backgroundColor: themeVars.dangerColor,
          color: themeVars.whiteColor,
          cursor: "pointer",
        },
      }),
      loadingIndicator: (provided) => ({
        ...provided,
        color: themeVars.primaryColor,
      }),
      placeholder: (provided) => ({
        ...provided,
        color: `${themeVars.bodyColor}88`,
      }),
      ...styles,
    }),
    [themeVars, styles],
  );

  const creatableProps = withCreate
    ? {
        formatCreateLabel,
        createOptionPosition,
        ...(typeof onCreateOption === "function" ? { onCreateOption } : {}),
        ...(typeof isValidNewOption === "function" ? { isValidNewOption } : {}),
        ...(typeof getNewOptionData === "function" ? { getNewOptionData } : {}),
      }
    : {};

  return (
    <div className={disabledMarginBottom ? "mb-0" : "mb-3"}>
      <style>{`.required-asterisk { color: red; margin-left: 4px; }`}</style>

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

          const handleCreate = async (inputValue) => {
            if (typeof onCreateOption === "function") {
              setLocalLoading(true);
              try {
                const created = await onCreateOption(inputValue, field);
                if (created) {
                  setDynamicOptions((prev) => [...prev, created]);
                  field.onChange(isMulti ? [...(field.value || []), created] : created);
                }
              } catch (err) {
                console.warn("AsyncSelect onCreateOption error:", err);
              } finally {
                setLocalLoading(false);
              }
              return;
            }
            // Default behavior: build an option, append locally, and select it.
            const newOption =
              typeof getNewOptionData === "function"
                ? getNewOptionData(inputValue, formatCreateLabel(inputValue))
                : { label: inputValue, value: inputValue, __isNew__: true };

            setDynamicOptions((prev) => [...prev, newOption]);
            field.onChange(isMulti ? [...(field.value || []), newOption] : newOption);
          };

          return (
            <>
              <SelectComponent
                inputId={name}
                isClearable={isClearable}
                isMulti={isMulti}
                loadOptions={wrappedLoadOptions}
                placeholder={placeholder}
                getOptionValue={getOptionValue}
                getOptionLabel={getOptionLabel}
                styles={buildStyles(hasError, isDisabled)}
                cacheOptions={cacheOptions}
                defaultOptions={slicedDefaultOptions}
                onFocus={handleFocus}
                onChange={(selected) => field.onChange(selected)}
                onBlur={field.onBlur}
                value={field.value}
                name={field.name}
                ref={field.ref}
                isLoading={localLoading}
                isDisabled={isDisabled}
                menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                menuPosition="fixed"
                autoComplete="off"
                {...(withCreate ? { ...creatableProps, onCreateOption: handleCreate } : {})}
                loadingMessage={() => (
                  <div style={{ color: themeVars.bodyColor, padding: "5px 10px" }}>
                    <span className="spinner-border spinner-border-sm me-2" style={{ color: themeVars.primaryColor, verticalAlign: "middle" }} />
                    Loading...
                  </div>
                )}
                noOptionsMessage={() => <div style={{ color: themeVars.bodyColor, padding: "5px 10px" }}>No options found</div>}
                {...restProps}
              />
              {hasError && <div className="invalid-feedback d-block">{error.message}</div>}
            </>
          );
        }}
      />
    </div>
  );
};

export default AsyncSelect;
