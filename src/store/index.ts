import { configureStore, combineSlices, combineReducers } from "@reduxjs/toolkit";
import { cameraPresetsSlice } from "./slices/cameras";
import { selectedBuildingSlice } from "./slices/building";

const reducer = combineSlices(
  cameraPresetsSlice,
  selectedBuildingSlice,
);

export const setupStore = () => configureStore({
  reducer,
});
