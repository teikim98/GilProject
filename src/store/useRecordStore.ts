import { create } from "zustand";
import { MarkerData } from "@/types/types";

interface Position {
  lat: number;
  lng: number;
}

interface RecordState {
  isRecording: boolean;
  pathPositions: Position[];
  markers: MarkerData[];
  recordStartTime: number | null;
  //시작 시간은 로컬에서만 사용

  startRecording: () => void;
  stopRecording: () => void;
  addPathPosition: (position: Position) => void;
  addMarker: (marker: MarkerData) => void;
  loadSavedPath: () => void;
  resetRecord: () => void;
}

export const useRecordStore = create<RecordState>((set, get) => ({
  isRecording: false,
  pathPositions: [],
  markers: [],
  recordStartTime: null,

  startRecording: () =>
    set({
      isRecording: true,
      recordStartTime: Date.now(),
    }),

  stopRecording: () => {
    const { pathPositions, markers } = get();
    if (pathPositions.length > 0) {
      localStorage.setItem(
        "savedPath",
        JSON.stringify({ path: pathPositions, markers })
      );
    }
    set({ isRecording: false });
  },

  addPathPosition: (position: Position) =>
    set((state) => ({
      pathPositions: [...state.pathPositions, position],
    })),

  addMarker: (marker: MarkerData) =>
    set((state) => ({
      markers: [...state.markers, marker],
    })),

  loadSavedPath: () => {
    const savedData = localStorage.getItem("savedPath");
    if (savedData) {
      const { path, markers } = JSON.parse(savedData);
      set({
        pathPositions: path,
        markers: markers,
      });
    }
  },

  resetRecord: () =>
    set({
      pathPositions: [],
      markers: [],
    }),
}));
