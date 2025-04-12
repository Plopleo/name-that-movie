/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.ltrbxd.com',
                port: '',
                pathname: '/**'
            },
        ]
    },
};

export default nextConfig;
