export const MobileNoColumn = ({ value = '', onClick }) => {

    return (
        <>
            {value ?
                <div onClick={onClick} style={{ cursor: "pointer" }}>
                    <i className="ri-phone-line text-muted" /> {" "}
                    <span> {value}</span >
                </div> : ""
            }
        </>
    )
}
