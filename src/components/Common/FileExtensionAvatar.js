import defaultCarImg from "@/assets/images/dummy-car.png";
import csvLogo from "@/assets/images/fileTypes/csv.webp";
import docLogo from "@/assets/images/fileTypes/doc.webp";
import pdfLogo from "@/assets/images/fileTypes/pdf.webp";
import pptLogo from "@/assets/images/fileTypes/ppt.webp";
import txtLogo from "@/assets/images/fileTypes/txt.webp";
import defaultLogo from "@/assets/images/fileTypes/word.webp";
import xlsLogo from "@/assets/images/fileTypes/xls.webp";
import { AvatarIcon } from "./AvatarIcon";

export const FileExtensionAvatar = ({ onClick, fileName = "", size = "" }) => {
  const fileIcons = {
    csv: csvLogo,
    doc: docLogo,
    docx: docLogo,
    pdf: pdfLogo,
    ppt: pptLogo,
    pptx: pptLogo,
    txt: txtLogo,
    xls: xlsLogo,
    xlsx: xlsLogo,
    defaultLogo: defaultLogo
  };

  const extension = fileName.split(".").pop()?.toLowerCase();
  const fileImage = fileIcons[extension] || defaultLogo;

  return (
    <div
      className="d-flex align-items-start"
      style={{ cursor: "pointer" }}
      onClick={onClick}
    >
      <div className="flex-shrink-0 me-3">
        <img
          src={fileImage}
          onError={(e) => {
            if (e.target.src !== defaultCarImg) {
              e.target.src = defaultCarImg; 
            }
          }}
          alt={extension || "file"}
          className="img-thumbnail avatar-sm rounded-circle"
          style={{
            width: "42px",
            height: "42px",
          }}
        />
      </div>
      <div className="flex-grow-1">
        {fileName}
        <p>
          <span className="text-muted fw-medium">Size : </span>
          <span className="fw-medium"> {size}</span>
        </p>
      </div>
    </div>
  );
};
