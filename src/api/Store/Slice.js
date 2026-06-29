import { createSlice } from '@reduxjs/toolkit';
import errors from '@/constants/error';

export const initialParentState = {
	errorMsg: null,
	isDarkMode: false,
};

export const parentSlice = createSlice({
	name: 'parent',
	initialState: initialParentState,
	extraReducers: (builder) => {
		builder
			.addMatcher(
				(action) => action.type.endsWith('/rejected'),
				(state, { payload }) => {
					if (payload?.data === 'canceled') {
						return;
					}

					if (payload?.data === errors.NETWORK_ERROR) {
						state.errorMsg = 'NETWORK ERROR';
						return;
					}

					if ((payload !== undefined || payload?.status === 500) && payload?.status !== 400) {
						state.errorMsg = payload?.error?.message || errors.SOMETHING_WRONG;
					}
				}
			)
			.addMatcher(
				(action) => action.type.endsWith('/fulfilled'),
				(state, { payload, meta }) => {
					if (payload?.success === false) {
						const errorIsObject = typeof payload?.errors === 'object';
						const errorMsg = errorIsObject
							? JSON.stringify(payload.errors).split(':')[1].replace(/[}{"]/g, '')
							: payload?.returnMessage || payload?.errors;
						state.errorMsg = errorMsg || errors.SOMETHING_WRONG;
					}
				}
			);
	},
	reducers: {
		setError(state, { payload: { error } }) {
			state.errorMsg = error;
		},
		toggleDarkMode(state) {
			state.isDarkMode = !state.isDarkMode;
		},
		logout(state) {
			state.errorMsg = null;
			state.isDarkMode = false;
		},
	},
});

export const {
	reducer: parentReducer,
	actions: { setError, toggleDarkMode, logout },
} = parentSlice;
