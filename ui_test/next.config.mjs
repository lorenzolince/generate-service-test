

/** @type {import('next').NextConfig} */


const nextConfig = {
  reactStrictMode: true,
  env: {
    DOMAIN_SERVICE: process.env.DOMAIN_SERVICE,
    PORT_API_REST: process.env.PORT_API_REST
  },
};
export default nextConfig;

