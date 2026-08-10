import path from "node:path";
import { loadEnvFile } from "node:process";
// @ts-ignore

import { defineConfig } from "prisma/config";
loadEnvFile(".env");
export default defineConfig({
  schema: path.join(import.meta.dirname, "prisma/"),
  datasource: {
    url: process.env.POSTGRES_URL,
  },
});
