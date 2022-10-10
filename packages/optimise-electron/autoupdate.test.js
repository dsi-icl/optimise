// Only Windows binaries are currrently published on GitHub.
if (process.platform !== 'win32') {
    console.log('Bypassing auto-update tests for non Windows hosts.');
    process.exit(0);
}

try {
    const fs = require('fs-extra');
    const packageInfo = JSON.parse(fs.readFileSync('package.json'));

    packageInfo.version = '0.0.1';

    fs.writeFile('package.json', JSON.stringify(packageInfo, null, 4), (err) => {

        if (err) {
            console.error('\nFile package.json could not overwritten');
            process.exit(1);
        }

        const spawn = require('child_process').spawn;
        const bin = require('electron');
        const args = ['.', '--autoupdate-test'];
        const cspr = spawn(bin, args);

        let timeoutCounter = null;

        cspr.stdout.setEncoding('utf8');
        cspr.stdout.on('data', function (data) {
            const str = data.toString();
            const lines = str.split(/(\r?\n)/g);
            if (lines)
                for (let i = 0; i < lines.length; i++) {
                    process.stdout.write(lines[i]);
                    if (/\(100/.test(lines[i])) {
                        console.log('\nSetting up readiness timeout...');
                        timeoutCounter = setTimeout(() => {
                            console.error('\nUpdate has failed !');
                            cspr.kill('SIGTERM');
                            process.exit(1);
                        }, 30000);
                    }
                    if (/The update is ready/.test(lines[i])) {
                        console.log('\nSuccessfuly update !');
                        clearTimeout(timeoutCounter);
                        cspr.kill('SIGTERM');
                        process.exit(0);
                    }
                }
        });

        cspr.stderr.on('data', function (data) {
            const str = data.toString();
            process.stderr.write(str);
        });

        cspr.on('exit', function (code) {
            console.log(`child process exited with code ${code}`);
            process.exit(code);
        });

        cspr.on('error', function (error) {
            console.error(`child process had an error ${error}`);
            process.exit(1);
        });

    });
} catch (e) {
    console.error('Update test failed', e);
    process.exit(1);
}