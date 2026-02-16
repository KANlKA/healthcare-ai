
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
  },
}

module.exports = nextConfig