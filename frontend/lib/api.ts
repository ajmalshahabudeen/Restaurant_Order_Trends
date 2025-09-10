'use server'
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", // Laravel backend
});

export const getRestaurants = async (q = "", sort = "") => {
  const res = await API.get("/restaurants", { params: { q, sort } });
  console.log(res)
  return res.data;
};

export const getRestaurantMetrics = async (id: string, params = {}) => {
  const res = await API.get(`/restaurants/${id}/metrics`, { params });
  console.log(res)
  return res.data;
};

export const getTopRestaurants = async (params = {}) => {
  const res = await API.get("/analytics/top-restaurants", { params });
  console.log(res)
  return res.data;
};
