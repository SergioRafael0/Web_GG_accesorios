import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom", // <- importante para React
    globals: true,        // <- para usar describe/it/expect globalmente
    setupFiles: [],       // opcional, si quieres configurar mocks globales
  },
});
