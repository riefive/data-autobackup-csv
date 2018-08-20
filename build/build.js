'use strict';

const { exec, spawn } = require('child_process');
let cmd = null;

switch (process.platform) {
    case 'linux':
        {
            cmd = spawn('bash', ['npm-exec']);
            break;
        }

    case 'win32':
        {
            cmd = spawn('"npm-exec.bat"', [], { shell: true });
            break;
        }
}

if (cmd !== null) {
    cmd.stdout.on('data', data => {
        console.log(`stdout: \n${data}`);
    });

    cmd.stderr.on('data', data => {
        console.log(`stderr: \n${data}`);
    });

    cmd.on('close', code => {
        console.log(`child process exited with code ${code}`);
    });
}