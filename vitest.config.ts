import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test/setup.ts"],
    include: ["lib/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["lib/**/*.{ts,tsx}"],
      exclude: ["lib/**/*.test.{ts,tsx}", "lib/**/*.d.ts"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./lib"),
    },
  },
});
