import { formatDate, formatTime } from "@/helpers/date_helper";

export const DateTimeColumn = ({ value, onClick }) => {

    return (
        (value &&
            <div onClick={onClick} style={{ cursor: onClick ? "pointer" : "default", display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                <div>
                    {formatDate(value)},
                    <small className="text-muted">
                        {" "}
                        {formatTime(value)}
                    </small>
                </div>
            </div>
        )
    )
}
