import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// Vercel adapter options
			runtime: 'nodejs20.x',
			regions: ['iad1'], // Change to your preferred region
			split: false
		})
		// Remove base path for Vercel deployment
		// If you need a base path, uncomment and modify:
		// paths: {
		// 	base: process.env.BASE_PATH || '',
		// }
	}
};

export default config;
