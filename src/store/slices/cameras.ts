import { createSlice } from "@reduxjs/toolkit";

interface Point2d {
  x: number;
  z: number;
}

interface CameraPreset {
  position: Point2d;
  target: Point2d;
}

interface SliceState {
  currentPreset: number;
  presets: CameraPreset[];
}

const initialState = {
  currentPreset: -1,
  presets: [],
}

export const cameraPresetsSlice = createSlice({
  name: "cameraPresets",
  initialState,
  reducers: {
    setCurrentPreset: (state: SliceState, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.presets.length) {
        state.currentPreset = index;
      }
    },
    addPreset: (state: SliceState, action: PayloadAction<CameraPreset>) => {
      const newPreset = action.payload;
      state.presets = [...state.presets, newPreset];
    },
  },
  selectors: {
    getPresets: (state: SliceState) => state.presets,
    getCurrentPreset: (state: SliceState) => {
      if (state.currentPreset > -1) {
        return state.presets[state.currentPreset];
      }
      return null;
    },
  },
});
