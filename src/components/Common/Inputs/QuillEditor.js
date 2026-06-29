import { useEffect } from "react";
import { Controller } from "react-hook-form";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

/**
 * QuillEditor — Reusable rich text editor component
 *
 * Props:
 *   name                {string}   — field name for react-hook-form
 *   control             {object}   — control from useForm()
 *   label               {string}   — optional label
 *   rules               {object}   — validation rules
 *   placeholder         {string}   — editor placeholder
 *   height              {number}   — editor height in px (default: 200)
 *   disabled            {boolean}  — disables the editor
 *   icon                {string}   — optional remixicon class for label
 *   disabledMarginBottom{boolean}  — removes mb-3
 */

const QuillEditor = ({
    name,
    control,
    label,
    rules = {},
    placeholder = "",
    height = 200,
    disabled = false,
    icon,
    disabledMarginBottom = false,
}) => {
    const isRequired = !!rules?.required;

    return (
        <div className={disabledMarginBottom ? "mb-0" : "mb-3"}>
            {label && (
                <label
                    className="form-label d-flex align-items-center gap-1"
                    style={{ letterSpacing: "0.5px", marginBottom: 5 }}
                >
                    {icon && <i className={icon} style={{ color: "#405189", fontSize: 13 }} />}
                    {label}
                    {isRequired && <span className="text-danger">*</span>}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                    <QuillInner
                        field={field}
                        error={error}
                        rules={rules}
                        placeholder={placeholder}
                        height={height}
                        disabled={disabled}
                    />
                )}
            />
        </div>
    );
};

const QuillInner = ({ field, error, rules, placeholder, height, disabled }) => {
    const { quill, quillRef } = useQuill({
        placeholder,
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ indent: "-1" }, { indent: "+1" }],
                ["link"],
                ["clean"],
            ],
        },
    });

    // Sync quill -> field
    useEffect(() => {
        if (!quill) return;

        quill.on("text-change", () => {
            const html = quill.root.innerHTML;
            const isEmpty = quill.getText().trim().length === 0;
            field.onChange(isEmpty ? "" : html);
        });
    }, [quill]);

    // Sync field value -> quill (for default/reset values)
    useEffect(() => {
        if (!quill) return;
        const current = quill.root.innerHTML;
        if (field.value !== undefined && field.value !== current) {
            quill.clipboard.dangerouslyPasteHTML(field.value || "");
        }
    }, [quill, field.value]);

    // Handle disabled
    useEffect(() => {
        if (!quill) return;
        quill.enable(!disabled);
        quill.root.style.backgroundColor = disabled ? "var(--vz-light)" : "";
        quill.root.style.cursor = disabled ? "not-allowed" : "";
    }, [quill, disabled]);

    return (
        <>
            <div
                className={`quill-wrapper ${error ? "is-invalid" : ""}`}
                style={{
                    border: error ? "1px solid var(--vz-danger)" : "1px solid var(--vz-border-color)",
                    borderRadius: "var(--bs-border-radius)",
                    overflow: "hidden",
                }}
            >
                <div ref={quillRef} style={{ height }} />
            </div>

            {error && (
                <div className="invalid-feedback d-block">
                    {error.message || rules?.required}
                </div>
            )}
        </>
    );
};

export default QuillEditor;
