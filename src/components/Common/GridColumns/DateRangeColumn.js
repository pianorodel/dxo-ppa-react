import { formatDate } from "@/helpers/date_helper";
import moment from "moment";

export const DateRangeColumn = ({ startDate, endDate, onClick }) => {
  const start = moment(startDate);
  const end = moment(endDate);
  const sameYear = start.year() === end.year();
  const sameMonth = start.month() === end.month() && sameYear;

  return (
    (startDate || endDate) && (
      <div onClick={onClick} className="cursor-pointer">
        <div>
          {!endDate ? (
            <>
              {formatDate(startDate)}
              <span className="text-muted small mx-1">to</span>
              <span className="text-success fw-semibold">Present</span>
            </>
          ) : sameMonth ? (
            <>
              {formatDate(startDate, "MMM DD")}
              <span> - </span>
              {formatDate(endDate, "DD YYYY")}
            </>
          ) : sameYear ? (
            <>
              {formatDate(startDate, "DD MMM")}
              <span className="text-muted small mx-1">to</span>
              {formatDate(endDate)}
            </>
          ) : (
            <>
              {formatDate(startDate)}
              <span className="text-muted small mx-1">to</span>
              {formatDate(endDate)}
            </>
          )}
        </div>
      </div>
    )
  );
};