/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverRuntimeConfig: {
    // Will only be available on the server side
    apiUrl: process.env.NEXT_SERVER_API_URL || 'http://camba-auth:5001'
  },
  publicRuntimeConfig: {
    // Will be available on both server and client
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
  }
}

module.exports = nextConfig
