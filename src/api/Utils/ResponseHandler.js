const responseHandler = (response, meta, arg) => {
  // check if response has data and totalRecords
  if (!response?.success) {
    return {
      success: false,
      errors: response?.errors,
      returnMessage: response?.returnMessage,
    };
  }
  const isList =
    response?.hasOwnProperty("returnData") &&
    response?.returnData?.hasOwnProperty("data") &&
    response?.returnData?.hasOwnProperty("totalRecords");
  if (isList) {
    return {
      success: true,
      items: response?.returnData?.data,
      totalRecords: response?.returnData?.totalRecords,
      page: arg?.page,
    };
  }
  return response;
};

export default responseHandler;
