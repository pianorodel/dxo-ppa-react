import { formatAmount } from "@/helpers/decimal_helper";

export const CurrencyColumn = ({ amount, onClick, className = '', style = {} }) => {

    return (
        <div className="d-flex" onClick={onClick}
            style={{ cursor: onClick ? "pointer" : "default", ...style }}
        >
            <span className={className}>₱ {formatAmount(amount)}</span>
        </div>
    )
}
