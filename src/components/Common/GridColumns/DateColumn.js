import { formatDate } from "@/helpers/date_helper";
import { isMobile } from "react-device-detect";

export const DateColumn = ({ value, onClick }) => {
  return (
    value && (
      <div onClick={onClick} className="d-flex align-items-center gap-2 cursor-pointer">
        <div>{formatDate(value)}</div>
      </div>
    )
  );
};
