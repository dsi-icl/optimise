import { defineConfig } from 'vitest/config'
import babel from 'vite-plugin-babel';
import react from '@vitejs/plugin-react-swc'
// import tailwindcss from '@tailwindcss/vite';

/* @type {import('vite').UserConfig} */
export default defineConfig({
    base: '/',
    plugins: [
        react(),
        babel({
            babelConfig: {
                compact: true,
                babelrc: false,
                configFile: false,
                presets: [
                    [
                        '@babel/preset-env',
                        { /* loose: true,*/ modules: false, targets: { browsers: "last 2 versions" } }
                    ],
                    '@babel/preset-typescript',
                    '@babel/preset-react',
                ],
                plugins: [
                    [
                        "@babel/plugin-proposal-decorators",
                        { /* loose: true, version: "2023-11", decoratorsBeforeExport: true */legacy: true },
                    ],
                    [
                        "@babel/plugin-proposal-class-properties",
                        { "loose": false }
                    ],
                    "@babel/plugin-syntax-dynamic-import"
                ],
            },
        }),
        // tailwindcss(),
        {
            name: "markdown-loader",
            transform(code, id) {
                if (id.slice(-3) === ".md") {
                    // For .md files, get the raw content
                    return `export default ${JSON.stringify(code)};`;
                }
            }
        }
    ],
    build: {
        outDir: 'build'
    },
    define: {
        global: {},
        process
    },
    server: {
        proxy: {
            '/api': { target: 'http://localhost:3030', changeOrigin: true }
        }
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        css: true,
        reporters: ['verbose'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            include: ['src/**/*'],
            exclude: [],
        }
    },
})