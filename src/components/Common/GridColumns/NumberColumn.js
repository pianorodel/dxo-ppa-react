import { formatAmount } from "@/helpers/decimal_helper";

export const NumberColumn = ({ amount, decimals = 2, onClick }) => {

    return (
        <div className="d-flex align-items-end justify-content-end" onClick={onClick} style={{ cursor: "pointer" }}>
            <span>{formatAmount(amount, decimals)}</span>
        </div>
    )
}
