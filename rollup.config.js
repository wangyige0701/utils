import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import typescript from 'rollup-plugin-typescript2';
import del from 'rollup-plugin-delete';
import terser from '@rollup/plugin-terser';

const enteries = ['src/index.ts'];

const plugins = [
	alias({
		entries: [{ find: '^node:(.+)$', replacement: '$1' }],
	}),
	resolve({
		preferBuiltins: true,
		rootDir: 'src',
	}),
	typescript(),
	commonjs(),
	esbuild({
		target: 'node14',
	}),
];

/** @type {import('rollup').RollupOptions[]} */
const configs = [
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
				},
			],
			external: [],
			plugins: [del({ targets: ['dist/*'] }), ...plugins],
		};
		return config;
	}),
	...enteries.map(input => {
		/** @type {import('rollup').RollupOptions} */
		const config = {
			input,
			output: [
				{
					file: input
						.replace('src/', 'dist/')
						.replace('.ts', '.d.mts'),
					format: 'esm',
				},
				{
					file: input
						.replace('src/', 'dist/')
						.replace('.ts', '.d.cts'),
					format: 'cjs',
				},
				{
					file: input
						.replace('src/', 'dist/')
						.replace('.ts', '.d.ts'),
					format: 'esm',
				},
			],
			external: [],
			plugins: [typescript(), dts({ respectExternal: true })],
		};
		return config;
	}),
];

export default arg => {
	const isBrowser = arg.context === 'browser';
	/** @type {import('rollup').RollupOptions[]} */
	const iife = [
		...enteries.map(input => {
			/** @type {import('rollup').RollupOptions} */
			const config = {
				input,
				output: {
					name: '$wyg',
					file: 'dist/wang-yige.utils.min.js',
					format: 'iife',
				},
				plugins: [
					...plugins,
					isBrowser
						? del({ targets: ['dist/*'] })
						: terser({
								module: false,
								compress: {
									ecma: 2015,
									pure_getters: true,
								},
								safari10: true,
							}),
				],
			};
			return config;
		}),
	];
	return isBrowser ? iife : [...configs, ...iife];
};
