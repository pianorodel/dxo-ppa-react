export const StatusBadgeColumn = ({ statusName, onClick }) => {
    const upper = statusName?.toUpperCase();
    const cursorStyle = { cursor: onClick ? "pointer" : "default" };

    const getBadgeClass = () => {
        switch (upper) {
            case "ACTIVE":
            case "COMPETITION":
            case "IN":
            case "MERIT":
            case "LOW":
                return "bg-success";

            case "ONLINE":
                return "bg-info";

            case "MEDIUM":
            case "IDLE":
                return "bg-warning";

            case "INACTIVE":
            case "IN-ACTIVE":
            case "HOME LEAVE":
            case "OUT":
            case "DEMERIT":
            case "HIGH":
            case "OFFLINE":
            case "LOCKED":
                return "bg-danger";

            default:
                return "bg-secondary";
        }
    };

    return (
        <span
            onClick={onClick}
            style={cursorStyle}
            className={`badge text-uppercase ${getBadgeClass()} text-white`}
        >
            {statusName}
        </span>
    );
};