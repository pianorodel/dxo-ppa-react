export const MobileLabel = ({ value = '' }) => {

    return (
        <>
            {value ?
                <>
                    <i className="ri-phone-line text-muted" /> {" "}
                    <span> {value}</span >
                </> : ""
            }
        </>
    )
}
