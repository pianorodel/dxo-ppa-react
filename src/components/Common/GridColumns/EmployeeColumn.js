import { Link } from "react-router-dom";
import { AvatarIcon } from "../AvatarIcon";

export const EmployeeColumn = ({ onClick, employeeName = '', position = '' }) => {
    return (
        <div className="d-flex align-items-center" >
            {employeeName && <AvatarIcon name={employeeName} />}
            <div className="flex-grow-1">
                <h5 className="fs-13 mb-1">
                    <Link to="#"
                        onClick={onClick}>
                        {" "}{employeeName || '-'}
                    </Link>
                </h5>

                {position ? <p className="mb-0">
                    <span>
                        {" "}{position}
                    </span>
                </p> : null}
            </div>
        </div>
    )
}
