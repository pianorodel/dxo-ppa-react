export const formatAmount = (value, decimals = 2) => {
  if (value === null || value === undefined) return "";
  return Number(value).toLocaleString("en-PH", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

 export const formatCurrency = (num) => {
    const parsed = parseFloat(num) || 0;
    return parsed.toLocaleString("en-PH", { style: "currency", currency: "PHP" });
  };