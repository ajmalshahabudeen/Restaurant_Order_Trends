import { create } from "zustand";
import { persist } from "zustand/middleware";

type Metric = {
    date: string;
    peak_hour: number;
};

interface TopState {
    top: [];
    setTop: (top: []) => void;
}

export const useTopStore = create(
    persist<TopState>(
        (set) => ({
            top: [],
            setTop: (top: []) => set({ top }),
        }),
        {
            name: "top",
        }
    )
);
