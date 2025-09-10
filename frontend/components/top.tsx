"use client";
// pages/top.js
import { useEffect, useState } from "react";
import axios from "axios";
import { Restaurant } from "@/config/restaurant";
import { fetchTopRestaurants } from "@/lib/api";
import { useTopStore } from "@/strore/useTop";

export default function TopRestaurants() {
    // const [top, setTop] = useState([]);
    const top = useTopStore((state) => state.top);
    const setTop = useTopStore((state) => state.setTop);

    useEffect(() => {
        fetchTop();
    }, []);

    const fetchTop = async () => {
        const res = await fetchTopRestaurants()
        setTop(res);
    };

    return (
        <div className="p-5 flex flex-col gap-5">
            <h1 className="text-3xl font-bold">Top 3 Restaurants by Revenue</h1>
            <ul>
                {top.map((r: Restaurant) => (
                    <li key={r.id}>
                        <span className="font-bold">{r.name}</span> - Revenue: {r.revenue} - Orders: {r.orders}
                    </li>
                ))}
            </ul>
        </div>
    );
}
