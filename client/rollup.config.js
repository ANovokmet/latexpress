import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import webWorkerLoader from 'rollup-plugin-web-worker-loader';
import fs from 'fs';
import path from 'path';

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

function copyLocal(filePath) {
	const targetFile = path.basename(filePath)
	fs.copyFileSync(
		path.resolve(filePath),
		path.resolve('./public/build/', targetFile)
	);
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file - better for performance
			css: css => {
				css.write('bundle.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		{
			name: 'copy-worker',
			load() {
				// this.addWatchFile(path.resolve('./src/worker.js'));
			},
			generateBundle() {
				copyLocal('./node_modules/pdfjs-dist/build/pdf.worker.js');
				copyLocal('./node_modules/pdfjs-dist/build/pdf.worker.js.map');
				copyLocal('./node_modules/pdfjs-dist/web/pdf_viewer.css');
				copyLocal('./node_modules/spectre.css/dist/spectre-icons.css');
				copyLocal('./node_modules/spectre.css/dist/spectre.css');
			}
		},
        //webWorkerLoader(/* configuration */),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
