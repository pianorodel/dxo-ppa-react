
export const SubtleBadge = ({ value = '', color = 'success', onClick }) => {

    return (
        <span style={{ cursor: onClick ? 'pointer' : 'default' }} className={`badge text-uppercase bg-${color}-subtle text-info`} onClick={onClick}>
            {" "}{value}{" "}
        </span>
    )
}