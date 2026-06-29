import { formatDate } from "@/helpers/date_helper";

export const DateLabel = ({ value = '' }) => {

    return (
        <>
            {formatDate(value)}
        </>
    )
}
