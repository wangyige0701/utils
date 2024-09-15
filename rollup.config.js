import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import typescript from 'rollup-plugin-typescript2'

const enteries = [
    'src/index.ts',
];

const plugins = [
    alias({
        entries: [
            { find: '^node:(.+)$', replacement: '$1' },
        ],
    }),
    resolve({
        preferBuiltins: true,
        rootDir: 'src',
    }),
    typescript(),
    commonjs(),
    esbuild({
        target: 'node14',
    })
];

/** @type {import('rollup').RollupOptions[]} */
export default [
    ...enteries.map(input => {
        /** @type {import('rollup').RollupOptions} */
        const config = {
            input,
            output: [
                {
                    file: input.replace('src/', 'dist/').replace('.ts', '.mjs'),
                    format: 'esm',
                },
                {
                    file: input.replace('src/', 'dist/').replace('.ts', '.cjs'),
                    format: 'cjs',
                }
            ],
            external: [],
            plugins,
        };
        return config;
    }),
    ...enteries.map(input => {
        /** @type {import('rollup').RollupOptions} */
        const config = {
            input,
            output: [
                {
                    file: input.replace('src/', 'dist/').replace('.ts', '.d.mts'),
                    format: 'esm',
                },
                {
                    file: input.replace('src/', 'dist/').replace('.ts', '.d.cts'),
                    format: 'cjs',
                },
                {
                    file: input.replace('src/', 'dist/').replace('.ts', '.d.ts'),
                    format: 'esm',
                },
            ],
            external: [],
            plugins: [
                typescript(),
                dts({ respectExternal: true }),
            ],
        };
        return config;
    }),
]
