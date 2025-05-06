import { BFFConfig } from "@/config/bff";
import axios, { AxiosInstance } from "axios";

const client: AxiosInstance = axios.create({
    baseURL: BFFConfig.host,
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
    },
});

client.interceptors.request.use(config => {
    const token = localStorage.getItem("r_to");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export { client };
