import { apiError, logoutUserSuccess, reset_login_flag } from './reducer';

export const logoutUser = () => async (dispatch) => {
  try {

    sessionStorage.removeItem("authUser");
    dispatch(logoutUserSuccess(true));

  } catch (error) {
    dispatch(apiError(error));
  }
};

export const resetLoginFlag = () => async (dispatch) => {
  try {
    const response = dispatch(reset_login_flag());
    return response;
  } catch (error) {
    dispatch(apiError(error));
  }
};