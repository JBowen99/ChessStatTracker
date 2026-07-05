import adapterNetlify from '@sveltejs/adapter-netlify';
import adapterNode from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte'],
	preprocess: [vitePreprocess()],

	kit: {
		// Netlify sets NETLIFY=true during builds; Docker/Coolify use adapter-node.
		adapter: process.env.NETLIFY ? adapterNetlify() : adapterNode()
	}
};
export default config;
