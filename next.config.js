/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	transpilePackages: ['deso-protocol', '@deso-core'],
};

module.exports = nextConfig;
