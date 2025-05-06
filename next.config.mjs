/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        // removeConsole: {
        //     exclude: ["error"]
        // },
    },
    async redirects() {
        return [
            {
                source: "/:lang/app/:id/preferences/my-organization",
                destination: "/:lang/app/:id/preferences/my-organization/overview",
                permanent: true,
            }
        ];
    },
};

export default nextConfig;
