import csvIcon from "@/assets/images/fileTypes/csv.webp";
import docIcon from "@/assets/images/fileTypes/doc.webp";
import mediaIcon from "@/assets/images/fileTypes/media.webp";
import pdfIcon from "@/assets/images/fileTypes/pdf.webp";
import pptIcon from "@/assets/images/fileTypes/ppt.webp";
import txtIcon from "@/assets/images/fileTypes/txt.webp";
import wordIcon from "@/assets/images/fileTypes/word.webp";
import xlsIcon from "@/assets/images/fileTypes/xls.webp";

export const FILE_TYPE_ICONS = {
    pdf: pdfIcon,
    csv: csvIcon,
    doc: docIcon,
    docx: wordIcon,
    ppt: pptIcon,
    pptx: pptIcon,
    txt: txtIcon,
    xls: xlsIcon,
    xlsx: xlsIcon,
    mp4: mediaIcon,
    mov: mediaIcon,
    avi: mediaIcon,
    mkv: mediaIcon,
    webm: mediaIcon,
};

export const OFFICE_EXTS = ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"];
export const IMAGE_EXTS = ["png", "jpg", "jpeg", "webp", "gif"];
export const VIDEO_EXTS = ["mp4", "mov", "avi", "mkv", "webm"];

const FILE_ICON_CLASSES = {
    zip: "ri-archive-line",
    rar: "ri-archive-line",
};

export const isVideoFile = (name) => VIDEO_EXTS.includes(getExtension(name));

export const getFileIconClass = (name) => FILE_ICON_CLASSES[getExtension(name)] || "ri-file-line";

export const getExtension = (name = "") => name.split(".").pop().toLowerCase();

export const isImageFile = (name) => IMAGE_EXTS.includes(getExtension(name));

export const getTypeIcon = (name) => FILE_TYPE_ICONS[getExtension(name)] || null;

export const formatSize = (bytes) => {
    if (!bytes || bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};