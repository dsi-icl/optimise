import { defineConfig } from 'vitest/config'
import babel from 'vite-plugin-babel';
import mdx from '@mdx-js/rollup';
import rehypeRaw from 'rehype-raw';
import rehypeMdxImportMedia from 'rehype-mdx-import-media'
import react from '@vitejs/plugin-react-swc'
// import tailwindcss from '@tailwindcss/vite';

/* @type {import('vite').UserConfig} */
export default defineConfig({
    base: '/',
    plugins: [
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
                    "@babel/plugin-syntax-dynamic-import"
                ],
            },
        }),
        mdx({
            providerImportSource: '@mdx-js/react',
            remarkPlugins: [], rehypePlugins: [
                [rehypeRaw, { passThrough: ['mdxjsEsm', 'mdxFlowExpression', 'mdxJsxFlowElement', 'mdxJsxTextElement', 'mdxTextExpression'] }],
                rehypeMdxImportMedia
            ]
        }),
        // tailwindcss(),
        {
            name: "markdown-loader",
            transform(code, id) {
                if (id.slice(-3) === ".md") {
                    // console.log('markdown-loader', code, id);
                    // For .md files, get the raw content
                    return `export default ${JSON.stringify(code)};`;
                }
            }
        },
        react(),
        {
            name: 'asset-path-replacement',
            transformIndexHtml: {
                order: 'post',
                async handler(html) {
                    return html.replaceAll('/assets/', 'assets/')
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