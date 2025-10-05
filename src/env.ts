import { z } from "zod"

const envSchema = z.object({
    VITE_API_URL_MAPBOX: z.url(),
    VITE_ACCESS_TOKEN_MAPBOX: z.string(),
    VITE_API_BASE_URL: z.url(),
})

export const env = envSchema.parse(import.meta.env)