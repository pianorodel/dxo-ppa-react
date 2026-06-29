import { baseApi } from "@/api";
import {
  combineReducers,
  configureStore,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
// import { createLogger } from "redux-logger";
import { parentReducer } from "./Slice";

// UI REDUCERS
import LoginReducer from "@/slices/auth/login/reducer";
import LayoutReducer from "@/slices/layouts/reducer";

// const logger = createLogger();

const reducer = combineReducers({
  // Front
  Layout: LayoutReducer,
  // Authentication
  Login: LoginReducer,
  // API
  parent: parentReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

const rootListener = createListenerMiddleware();

// const middlewares = [logger];

const isDevelopment = process.env.NODE_ENV === "development";

export const apiStore = configureStore({
  reducer: reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    })
      .prepend(rootListener.middleware)
      .concat(baseApi.middleware),
      // .concat(middlewares),
  devTools: isDevelopment,
});