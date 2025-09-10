import { create } from "zustand";
import { persist } from "zustand/middleware";

type Metric = {
    date: string;
    peak_hour: number;
};

interface MetricsState {
    metrics: Metric[];
    setMetrics: (metrics: Metric[]) => void;
}

export const useMetrics = create(
    persist<MetricsState>(
        (set) => ({
            metrics: [],
            setMetrics: (metrics: Metric[]) => set({ metrics }),
        }),
        {
            name: "metrics",
        }
    )
);
