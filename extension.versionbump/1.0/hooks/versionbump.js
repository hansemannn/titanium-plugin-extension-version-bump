const fs = require('fs');
const path = require('path');
const plist = require('plist');

/**
 * Rewrite native iOS extension plist if app version changes.
 *
 * @param {*} _logger The logger instance.
 * @param {*} _config The config instance.
 * @param {*} cli The CLI instance.
 * @param {*} appc The Appc-CLI instance.
 */
exports.init = function (_logger, _config, cli, appc) {
	const extensionsDirectoryPath = path.resolve('./extensions');
	const extensionsDirectory = fs.readdirSync(extensionsDirectoryPath, 'utf-8');

	function writeVersionAtPath(plistPath) {
		const contents = fs.readFileSync(plistPath, 'utf-8');

		const version = cli.tiapp.version;
		const shortVersion = appc.version.format(cli.tiapp.version, 0, 3);
		const oldContents = plist.parse(contents);
		const newContents = plist.parse(contents);

		newContents['CFBundleShortVersionString'] = shortVersion;
		newContents['CFBundleVersion'] = version;

		if (JSON.stringify(oldContents) === JSON.stringify(newContents)) {
			return;
		}

		fs.writeFileSync(plistPath, plist.build(newContents));
	}

	// Handle extensions
	for (const extensionDirectory of extensionsDirectory) {
		if (/^\..*/.test(extensionDirectory)) {
			continue;
		}

		const plistPath = path.join(extensionsDirectoryPath, extensionDirectory, extensionDirectory, 'Info.plist');

		// Handle extension targets
		if (!fs.existsSync(plistPath)) {
			const irregularPaths = [ 'WatchApp', 'WatchApp Extension' ];

			for (const irregularPath of irregularPaths) {
				const subPlistPath = path.join(extensionsDirectoryPath, extensionDirectory, irregularPath, 'Info.plist');
				if (fs.existsSync(subPlistPath)) {
					writeVersionAtPath(subPlistPath);
				}
			}

			continue;
		}

		writeVersionAtPath(plistPath);
	}
};
