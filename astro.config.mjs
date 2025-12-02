import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  adapter: vercel(),  // makes /api/submit work on Vercel
  output: "server",   // enables server routes
});
