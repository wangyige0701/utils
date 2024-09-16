import esbuild from 'rollup-plugin-esbuild';
import dts from 'rollup-plugin-dts';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';

const enteries = ['src/decorators/index.ts'];

/** @type {import('rollup').Plugin} */
const path_reset = {
	name: 'path-reset',
	renderChunk(code) {
		return code
			.replace(/(import.+['"])(@\/(?!decorators).+)(['"];)/g, '$1..$3')
			.replace(
				/((?:var|let|const)\s*.+\s*=\s*require\(['"])(@\/(?!decorators).+)(['"]\);)/g,
				'$1..$3',
			);
	},
};

const plugins = [
	resolve({
		preferBuiltins: true,
		rootDir: 'src',
	}),
	typescript(),
	commonjs(),
	esbuild({
		target: 'node14',
	}),
	path_reset,
];

/** @type {import('rollup').RollupOptions[]} */
export default [
	// 装饰器文件
	...enteries.map(input => {
		/** @type {import('rollup').RollupOptions} */
		const config = {
			input,
			output: [
				{
					file: input
						.replace('src/decorators/', 'dist/decorators/')
						.replace('.ts', '.mjs'),
					format: 'esm',
				},
				{
					file: input
						.replace('src/decorators/', 'dist/decorators/')
						.replace('.ts', '.cjs'),
					format: 'cjs',
				},
			],
			external: [/^@\/(?!decorators).+/],
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
					file: input
						.replace('src/decorators/', 'dist/decorators/')
						.replace('.ts', '.d.mts'),
					format: 'esm',
				},
				{
					file: input
						.replace('src/decorators/', 'dist/decorators/')
						.replace('.ts', '.d.cts'),
					format: 'cjs',
				},
				{
					file: input
						.replace('src/decorators/', 'dist/decorators/')
						.replace('.ts', '.d.ts'),
					format: 'esm',
				},
			],
			external: [/^@\/(?!decorators).+/],
			plugins: [typescript(), dts({ respectExternal: true }), path_reset],
		};
		return config;
	}),
];
