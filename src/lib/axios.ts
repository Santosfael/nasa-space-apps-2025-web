import { env } from "@/env"
import axios from "axios"

export const apiMapBox = axios.create({
    baseURL: env.VITE_API_URL_MAPBOX,
})