import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep @xenova/transformers as a server-only package so Next.js doesn't try
  // to bundle its Node-only deps (fs, sharp, onnxruntime-node) for the client.
  serverExternalPackages: ["@xenova/transformers"],
};

export default nextConfig;
