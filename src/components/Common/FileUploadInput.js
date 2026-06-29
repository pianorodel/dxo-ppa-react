import React from "react";
import { Controller } from "react-hook-form";

// sample usage:
// <FileUploadInput
//     name="coverPhotoFile"
//     control={control}
//     id="cover-image-input"
//     onFileSelect={(file) => setCoverPreview(URL.createObjectURL(file))}
// />

const FileUploadInput = ({
    name,
    control,
    accept = "image/png, image/gif, image/jpeg",
    className = "form-control d-none",
    onFileSelect,
    label,
}) => {
    return (
        <>
            {label && <label htmlFor={name}>{label}</label>}
            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, ref } }) => (
                    <input
                        id={name}
                        type="file"
                        className={className}
                        accept={accept}
                        ref={ref}
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                onFileSelect?.(file);
                            }
                            onChange(file);
                        }}
                    />
                )}
            />
        </>
    );
};

export default FileUploadInput;
