import { formatDate, formatTime } from "@/helpers/date_helper";

export const DateTimeLabel = ({ value = '' }) => {

    return (
        <>
            {formatDate(value)},
            <small className="text-muted">
                {" "}
                {formatTime(value)}
            </small>
        </>
    )
}
