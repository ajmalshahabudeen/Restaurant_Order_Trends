"use server";
import axios from "axios";

export const fetchRestaurants = async (q = "", sort = "") => {
    const res = await axios.get("http://localhost:8000/api.php", {
        params: { endpoint: "restaurants", q, sort },
    });
    return res.data;
};

export const fetchMetrics = async (id: string, from: string, to: string) => {
    const res = await axios.get("http://localhost:8000/api.php", {
        params: {
            endpoint: "metrics",
            restaurant_id: id,
            from,
            to,
        },
    });
    return res.data;
};

export const fetchTopRestaurants = async () => {
    const res = await axios.get("http://localhost:8000/api.php", {
        params: { endpoint: "top" },
    });
    return res.data;
};
