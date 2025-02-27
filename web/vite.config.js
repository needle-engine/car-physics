import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(async ({ command }) => {
    const { needlePlugins, useGzip, loadConfig } = await import("@needle-tools/engine/vite");
    const needleConfig = await loadConfig();
    return {
        plugins: [
            mkcert(),
            // useGzip(needleConfig) ? viteCompression({ deleteOriginFile: true }) : null,
            needlePlugins(command, needleConfig),
            sveltekit(),
        ],
        server: {
            port: 3000,
            proxy: {},
            fs: {
                strict: false,
            },
        },
        build: {
            emptyOutDir: true,
            keepNames: true,
        }
    }
});