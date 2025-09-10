"use client";
// pages/top.js
import { useEffect, useState } from "react";
import axios from "axios";
import { Restaurant } from "@/config/restaurant";

export default function TopRestaurants() {
    const [top, setTop] = useState([]);

    useEffect(() => {
        fetchTop();
    }, []);

    const fetchTop = async () => {
        const res = await axios.get("http://localhost:8000/api.php", {
            params: { endpoint: "top" },
        });
        setTop(res.data);
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
