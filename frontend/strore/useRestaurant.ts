import { Restaurant } from "@/config/restaurant";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RestaurantState {
    resturants: Restaurant[];
    setRestaurants: (resturants: Restaurant[]) => void;
}

export const useRestaurant = create(
    persist<RestaurantState>(
        (set) => ({
            resturants: [],
            setRestaurants: (resturants: Restaurant[]) => set({ resturants }),
        }),
        {
            name: "restaurant",
        }
    )
);
