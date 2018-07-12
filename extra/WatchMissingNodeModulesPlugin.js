// This Webpack plugin ensures `npm install <library>` forces a project rebuild.
// We’re not sure why this isn't Webpack's default behavior.
// See https://github.com/facebook/create-react-app/issues/186.

class WatchMissingNodeModulesPlugin {
    constructor(nodeModulesPath) {
        this.nodeModulesPath = nodeModulesPath;
    }

    apply(compiler) {
        compiler.hooks.emit.tap('WatchMissingNodeModulesPlugin', compilation => {
            let missingDeps = Array.from(compilation.missingDependencies);
            let nodeModulesPath = this.nodeModulesPath;

            // If any missing files are expected to appear in node_modules...
            if (missingDeps.some(file => file.includes(nodeModulesPath))) {
                // ...tell webpack to watch node_modules recursively until they appear.
                compilation.contextDependencies.add(nodeModulesPath);
            }
        });
    }
}

module.exports = WatchMissingNodeModulesPlugin;
