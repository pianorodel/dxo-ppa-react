import { formatDate, formatTime } from "@/helpers/date_helper";

export const DateActionColumn = ({ actionDate = null, actionBy = '', onClick }) => {

    return (

        <div className={`d-flex align-items-center`}
            onClick={onClick}
            style={{ cursor: onClick ? "pointer" : "default" }}>
            <div className="flex-grow-1">
                <span>{formatDate(actionDate)}</span>
                <small className="text-muted">
                    {" "}
                    {formatTime(actionDate)}
                </small>
                <p className="mb-0">
                    <span>{actionBy}</span>
                </p>
            </div>
        </div>
    )
}
