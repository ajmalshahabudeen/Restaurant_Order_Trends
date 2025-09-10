"use client";
import { fetchMetrics } from "@/lib/api";
import { use, useEffect, useState } from "react";
import { useMetrics } from "@/strore/useMetrics";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { useRestaurant } from "@/strore/useRestaurant";
import { Restaurant } from "@/config/restaurant";

type Metric = {
    date: string;
    peak_hour: number;
};

export default function RestaurantMetrics({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const metrics = useMetrics((state) => state.metrics);
    const setMetrics = useMetrics((state) => state.setMetrics);
    const restaurant = useRestaurant((state) => state.resturants);
    const [from, setFrom] = useState("2025-06-24");
    const [to, setTo] = useState("2025-06-30");

    useEffect(() => {
        if (id) fetch_metrics();
    }, [id, from, to]);

    const fetch_metrics = async () => {
        try {
            const res = await fetchMetrics(id, from, to);
            setMetrics(res);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-3xl px-5">
                Metrics for Restaurant{" "}
                {
                    restaurant.find((r: Restaurant) => r.id === parseInt(id))
                        ?.name
                }
            </h1>
            <div className="px-5">
                <label>
                    From:{" "}
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />
                </label>
                <label style={{ marginLeft: "1rem" }}>
                    To:{" "}
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                </label>
            </div>
            <hr className="mt-5 border-black" />

            <div style={{ marginTop: "2rem", height: "400px" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="orders"
                            stroke="#8884d8"
                            name="Orders"
                        />
                        <Line
                            type="monotone"
                            dataKey="revenue"
                            stroke="#82ca9d"
                            name="Revenue"
                        />
                        <Line
                            type="monotone"
                            dataKey="average_order_value"
                            stroke="#ff7300"
                            name="Avg Order Value"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <h3 className="mt-5 font-bold text-2xl">Peak Order Hour Per Day</h3>
            <ul className="flex flex-col gap-2 list-disc list-inside pt-4">
                {metrics.map((m: Metric) => (
                    <li key={m.date}>
                        {m.date}: {m.peak_hour}:00
                    </li>
                ))}
            </ul>
        </div>
    );
}
