const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const path = require('path');

module.exports = ( env ) => {
	return [
		{
			...defaultConfig,
			mode: env.mode,
			devtool: env.mode === 'development' ? 'source-map' : false,
			entry: {
				'cmds-block-editor': './src/commands/commands-block-editor.js',
				'cmds-admin': './src/commands/commands-admin.js',
				'cmds-frontend': './src/commands/commands-frontend.js',
				'cmds-network': './src/commands/commands-network.js',
			},
			output: {
				path: path.resolve(process.cwd(), 'build'),
				filename: '[name].js',
			},
		}
	]
};
