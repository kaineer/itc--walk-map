import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface SliceState {
  buildingId: string;
}

const initialState = {
  buildingId: ""
}

export const selectedBuildingSlice = createSlice({
  name: "selectedBuilding",
  initialState,
  reducers: {
    selectBuilding: (state: SliceState, action: PayloadAction<string>) => {
      state.buildingId = action.payload;
    },
  },
  selectors: {
    getSelectedBuildingId: (state) => state.buildingId,
  }
});
