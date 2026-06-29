import { Link } from "react-router-dom";

export const UpdateAndDeleteColumn = ({ handleUpdate, handleDelete, isShowDelete = true, isShowEdit = true }) => {
  return (
    <>
      <ul className="list-inline hstack gap-2 mb-0">
        {isShowEdit &&
          <li className="list-inline-item edit">
            <Link
              to="#"
              className="text-success d-inline-block edit-item-btn"
              onClick={handleUpdate}
              title="Edit"
            >
              <i className="ri-pencil-fill fs-16"></i>
            </Link>
          </li>}
        {isShowDelete &&
          <li className="list-inline-item">
            <Link
              to="#"
              className="text-danger d-inline-block remove-item-btn"
              onClick={handleDelete}
              title="Delete"
            >
              <i className="ri-delete-bin-5-fill fs-16"></i>
            </Link>
          </li>
        }

      </ul>
    </>
  );
};

export default UpdateAndDeleteColumn;
