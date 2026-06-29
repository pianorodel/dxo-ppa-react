import "quill/dist/quill.snow.css";

/**
 * QuillViewer — Read-only renderer for Quill-generated HTML
 *
 * Props:
 *   value     {string}  — raw HTML string from Quill (saved in DB)
 *   height    {string}  — optional max-height with overflow-y (e.g. "300px"), default is auto
 *   minHeight {string}  — optional min-height (e.g. "100px"), default is 0
 */

const QuillViewer = ({ value, height, minHeight }) => {
    if (!value) return null;

    return (
        <div
            className="ql-container ql-snow border-0"
            ref={el => {
                if (el) {
                    el.style.setProperty("height", "auto", "important");
                }
            }}
            style={{ fontSize: "inherit" }}
        >
            <div
                className="ql-editor"
                ref={el => {
                    if (el) {
                        el.style.setProperty("min-height", minHeight ?? "0px", "important");
                        el.style.setProperty("padding", "0", "important");
                    }
                }}
                style={{
                    height: "auto",
                    maxHeight: height || "none",
                    overflowY: height ? "auto" : "visible",
                    cursor: "default",
                    userSelect: "text",
                }}
                dangerouslySetInnerHTML={{ __html: value }}
            />
        </div>
    );
};

export default QuillViewer;