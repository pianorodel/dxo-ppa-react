import { Link } from "react-router-dom";

export const LinkColumn = ({ onClick, name = '' }) => {
    return (
        <div className="d-flex align-items-center" onClick={onClick}>
            <div className="flex-grow-1">
                <h5 className="fs-13 mb-1">
                    <Link to="#">
                        {" "}
                        {name}
                    </Link>
                </h5>
            </div>
        </div>
    )
}
