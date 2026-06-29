import { formatDate, formatTime } from "@/helpers/date_helper";

export const TextDateColumn = ({ text = '', date = null, onClick }) => {
    return (
        <div onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
            {text}
            {date &&
                <div>
                    {formatDate(date)},
                    <small className="text-muted">
                        {" "}
                        {formatTime(date)}
                    </small>
                </div>
            }
        </div>
    )
}
