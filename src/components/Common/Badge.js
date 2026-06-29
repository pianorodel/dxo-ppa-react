export const Badge = ({ value = '', color = 'success', onClick }) => {

    if (value === null || value === '') return null;

    return (
        <span style={{ cursor: onClick ? 'pointer' : 'default' }} className={`badge text-uppercase bg-${color} text-white`} onClick={onClick}>
            {" "}{value}{" "}
        </span>
    )
}