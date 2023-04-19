/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	// i18n not supported by turbopack yet.
	// i18n: {
	// 	locales: ['en'],
	// 	defaultLocale: 'en',
	// }
}

module.exports = nextConfig;
