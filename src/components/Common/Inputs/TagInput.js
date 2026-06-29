import { useRef, useState } from "react";
import { Controller } from "react-hook-form";

const TagInput = ({
    name,
    control,
    label = "Tags",
    rules = {},
    disabled = false,
    placeholder = "Type and press Enter or comma...",
    disabledMarginBottom = false,
}) => {
    const [inputVal, setInputVal] = useState("");
    const inputRef = useRef(null);
    const isRequired = !!rules?.required;

    return (
        <div className={disabledMarginBottom ? "mb-0" : "mb-3"}>
            {label && (
                <label className="form-label d-flex align-items-center gap-1" style={{ letterSpacing: "0.5px", marginBottom: 5 }}>
                    {label}
                    {isRequired && <span className="text-danger">*</span>}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue={[]}
                render={({ field, fieldState: { error } }) => {
                    const tags = field.value || [];

                    const addTag = (raw) => {
                        const val = raw.trim();
                        if (!val || tags.includes(val)) return;
                        field.onChange([...tags, val]);
                    };

                    const removeTag = (tag) =>
                        field.onChange(tags.filter((t) => t !== tag));

                    const handleKeyDown = (e) => {
                        if (e.key === "Enter" || e.key === ",") {
                            e.preventDefault();
                            addTag(inputVal.replace(",", ""));
                            setInputVal("");
                        }
                        if (e.key === "Backspace" && inputVal === "" && tags.length) {
                            field.onChange(tags.slice(0, -1));
                        }
                    };

                    return (
                        <>
                            <div
                                className={`form-control d-flex flex-wrap gap-1 align-items-center h-auto py-1 px-2 ${error ? "is-invalid" : ""}`}
                                onClick={() => !disabled && inputRef.current?.focus()}
                                style={{ cursor: disabled ? "default" : "text", minHeight: 38 }}
                            >
                                {tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="badge bg-primary d-inline-flex align-items-center gap-1 rounded-pill"
                                        style={{ fontSize: 12, fontWeight: 500, padding: "4px 10px 4px 12px" }}
                                    >
                                        {tag}
                                        {!disabled && (
                                            <i
                                                className="ri-close-line"
                                                style={{ fontSize: 12, cursor: "pointer", opacity: 0.85 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeTag(tag);
                                                }}
                                            />
                                        )}
                                    </span>
                                ))}

                                {!disabled && (
                                    <input
                                        ref={inputRef}
                                        value={inputVal}
                                        onChange={(e) => setInputVal(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        onBlur={() => {
                                            if (inputVal.trim()) {
                                                addTag(inputVal);
                                                setInputVal("");
                                            }
                                            field.onBlur();
                                        }}
                                        placeholder={tags.length === 0 ? placeholder : ""}
                                        className="border-0 outline-0 bg-transparent fs-13 flex-grow-1 p-0"
                                        style={{ outline: "none", minWidth: 160 }}
                                    />
                                )}
                            </div>

                            {error && (
                                <div className="invalid-feedback d-block">
                                    {error.message || rules?.required}
                                </div>
                            )}

                            {!disabled && (
                                <div className="text-muted mt-1 fs-12">
                                    Press Enter or comma to add · Backspace to remove last
                                </div>
                            )}
                        </>
                    );
                }}
            />
        </div>
    );
};

export default TagInput;