/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true,
    experimental: {
        optimizePackageImports: ['framer-motion', 'lucide-react', 'recharts', 'date-fns'],
    },

    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Access-Control-Allow-Origin',
                        value: '*',
                    },
                    {
                        key: 'Access-Control-Allow-Methods',
                        value: 'GET, POST, PUT, DELETE, OPTIONS',
                    },
                    {
                        key: 'Access-Control-Allow-Headers',
                        value: 'Content-Type, Authorization',
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
