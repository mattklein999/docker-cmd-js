import child_process = require('child_process');
import colors = require('colors');
import { info } from './base';

export function spawn(command: string, env, debug: boolean, cb: (result: RunResult)=> void) {
    let items = command.split(' ');
    //var items = command.match(/[\w-=:]+|"(?:\\"|[^"])+"/g); // in case we need to have quoted args
    //console.dir(items);

    let r = child_process.spawn(items[0], items.slice(1), { env: env });
    let result = { stdOut: '', stdErr: '' };
    
    r.stdout.on('data', (data) => {
        result.stdOut = result.stdOut + data.toString();
        if(debug)
            process.stdout.write(data.toString());
    });

    r.stderr.on('data', (data) => {
        result.stdErr = result.stdErr + data.toString();
        process.stdout.write(colors.red(`stderr: ${data.toString()}`));
    });

    r.on('error', (err) => {
        process.stdout.write(`Failed to start command: ${command}`);
    });

    r.on('close', (code) => {
        if(debug)
            console.log(`command exited with code ${code}`);
        cb(result);
    });
}

export function spawnSync(command: string, env, debug: boolean): RunResult {
        let items = command.split(' ');
        //var items = command.match(/[\w-=:]+|"(?:\\"|[^"])+"/g); // in case we need to have quoted args
        //console.dir(items);

        let r = child_process.spawnSync(items[0], items.slice(1), { env: env });
        if (debug) {
            if (r.stdout) {
                info('stdout:')
                process.stdout.write(r.stdout.toString())
            }
            if (r.stderr) {
                info('stderr:')
                process.stdout.write(colors.red(r.stderr.toString()));
            }    
        }
        return {
            stdOut: r.stdout.toString(),
            stdErr: r.stderr.toString()
        };
}

export interface RunResult {
    stdOut: string;
    stdErr: string;
}