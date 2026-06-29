
const PhotoUploader = ({
    type = "avatar",
    imageSrc,
    inputId,
    labelTooltip,
    tooltipPlacement = "top",
    onChange
}) => {
    const isCover = type === "cover";
    const imageClass = isCover
        ? "img-fluid"
        : "avatar-md rounded-circle h-auto";
    const wrapperClass = isCover
        ? "modal-team-cover position-relative mb-0 mt-n4 mx-n4 rounded-top overflow-hidden"
        : "avatar-lg";
    const containerClass = isCover
        ? "px-1 pt-1"
        : "text-center mb-4 mt-n5 pt-2";

    return (
        <div className={containerClass}>
            <div className={wrapperClass}>
                <img src={imageSrc} alt="" id={inputId + "-preview"} className={imageClass} />
                <div
                    className={`position-absolute ${isCover ? "start-0 end-0 top-0 p-3" : "bottom-0 end-0"
                        }`}
                >
                    <label
                        htmlFor={inputId}
                        className="mb-0"
                        data-bs-toggle="tooltip"
                        data-bs-placement={tooltipPlacement}
                        title={labelTooltip}
                    >
                        <div className="avatar-xs">
                            <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                                <i className="ri-image-fill"></i>
                            </div>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    );
};

export default PhotoUploader;
