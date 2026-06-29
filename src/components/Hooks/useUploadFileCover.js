import { useState, useCallback, useEffect } from "react";

const isLocalUrl = (url) =>
    url?.startsWith("blob:") || url?.startsWith("data:");

const useUploadFileCover = (initialUrl, defaultImage) => {
    const [preview, setPreview] = useState(initialUrl);
    const s3 = process.env.REACT_APP_S3;

    useEffect(() => {
        setPreview(initialUrl)
    }, [initialUrl])

    const renderPreview = preview
        ? isLocalUrl(preview)
            ? preview
            : `${s3}${preview}`
        : defaultImage;

    const handleImageError = useCallback(
        (e) => {
            if (e.target.src !== defaultImage) {
                e.target.src = defaultImage;
            }
        },
        [defaultImage]
    );

    const setImageValue = (file) => {
        if (file instanceof File) {
            const url = URL.createObjectURL(file);
            setPreview(url);
        } else {
            console.warn("Invalid file passed to setImageValue:", file);
        }
    };

    return {
        renderPreview,
        setImageValue,
        handleImageError,
    };
};

export default useUploadFileCover;
