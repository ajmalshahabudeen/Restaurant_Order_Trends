"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Restaurant } from "@/config/restaurant";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TopRestaurants from "@/components/top";

export default function Home() {
    const [restaurants, setRestaurants] = useState([]);
    const [q, setQ] = useState("");
    const [sort, setSort] = useState("name");

    useEffect(() => {
        fetchRestaurants();
    }, [q, sort]);

    const fetchRestaurants = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api.php", {
                params: { endpoint: "restaurants", q, sort },
            });
            setRestaurants(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-5">
            <h1 className="text-3xl">Restaurants</h1>
            <hr className="my-5" />
            <div className="flex gap-2 items-center">
                <Input
                    type="text"
                    placeholder="Search..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-fit"
                />
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="name">Name</option>
                    <option value="location">Location</option>
                    <option value="cuisine">Cuisine</option>
                </select>
            </div>

            <div className="flex flex-wrap gap-5 mt-5">
                {restaurants.map((r: Restaurant) => (
                    <Card key={r.id}>
                        <CardContent className="flex flex-col gap-2 min-w-sm h-full justify-between">
                            <CardHeader className="text-lg font-bold">
                                {r.name}
                            </CardHeader>
                            <div className="flex flex-col gap-2 items-center">
                                <p>
                                    {r.cuisine} - {r.location}
                                </p>
                                <Button className="w-full" asChild>
                                    <Link
                                        href={`/dashboard/restaurant/${r.id}`}>
                                        View Metrics
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="mt-8 border-t">
              <TopRestaurants />
            </div>
        </div>
    );
}
