import { defineConfig } from "vite";
import path from 'path';
import glsl from 'vite-plugin-glsl';

export default defineConfig({
  plugins: [glsl()],
  resolve: {
		alias: {
			'@js': path.resolve(__dirname, './src/js'),
			'@scss': path.resolve(__dirname, './src/scss'),
			'@shaders': path.resolve(__dirname, './src/shaders'),
			'@utils': path.resolve(__dirname, './src/utils')
		}
	}
});
