import { configureStore, combineSlices, combineReducers } from "@reduxjs/toolkit";
import { cameraPresetsSlice } from "./slices/cameras";

const reducer = combineSlices(
  cameraPresetsSlice,
);

export const setupStore = () => configureStore({
  reducer,
});
