import { formatAmount } from "@/helpers/decimal_helper";

export const AmountColumn = ({ amount, onClick }) => {

    return (
        <div className="d-flex" onClick={onClick} style={{ cursor: "pointer" }}>
            <span>{formatAmount(amount)}</span>
        </div>
    )
}
