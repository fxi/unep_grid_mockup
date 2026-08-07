import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/unep_grid_mockup/",
  plugins: [react()],
});
