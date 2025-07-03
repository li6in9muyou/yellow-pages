import baseConfig from "./vite.config";
import { defineConfig } from "vite";

export default defineConfig({
  ...baseConfig,
  base: "/",
  build: {
    ...baseConfig.build, // 继承基础配置的 build 选项
    outDir: "./dist-local", // 仅覆盖输出目录
  },
});
