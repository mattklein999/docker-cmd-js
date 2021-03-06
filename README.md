
[npm-url]: https://www.npmjs.com/package/docker-cmd-js
[npm-image]: https://img.shields.io/npm/v/docker-cmd-js.svg

# docker-cmd-js [![NPM version][npm-image]][npm-url]
Apparently running a **docker** in the `cmd.exe` requires a bunch of environment variables set up. Just spawning a `spawnSync` from `child_process` won't do in most cases. Thus the birth of this lib.

Besides, command execution is wrapped in Promises, and there are some helper methods one can use. See API. 

## Why?
What if you have multiple commands that you always run to set up your environment or to deploy a project to AWS?
This is where this project comes in handy.

## Show me code!
Example to deply an app to AWS
```javascript
var gulp = require('gulp');
var dockerCmdJs = require('docker-cmd-js');
var cmd = new dockerCmdJs.Cmd();

gulp.task('deploy', (done) => {
    cmd.debug().run('aws ecr get-login --region us-east-1', true)
        .then((authCmd)=> cmd.run(authCmd))
        .then(()=> cmd.run('docker build -t myapp .'))
        .then(()=> cmd.run('docker tag myapp:latest someawsid.dkr.ecr.us-east-1.amazonaws.com/myapp:latest'))
        .then(()=> cmd.run('docker push someawsid.dkr.ecr.us-east-1.amazonaws.com/myapp:latest'))
        .catch((err) => { console.log(err); })
        .finally(() => { done() });
});
```

## API

##### `new dockerCmdJs.Cmd(machineName?: string)`
Instantiates object that'll run commands. Optionally you can set machine name against which commands will run.

---
##### `cmd.debug(): dockerCmdJs.Cmd`
Sets verbose output.

---
##### `cmd.run(command: string, noNewLines?: boolean): Q.Promise<string>`
Takes any command as string. Parameter `noNewLines` set to true removes cariage returns from the output.

Returns Promise.

---
##### `cmd.runSync(command: string): RunResult;`
Takes any command as string.

Returns the following object:
```javascript
interface RunResult {
    stdOut: string;
    stdErr: string;
}

```

---
##### `cmd.resToJSON(s: string): any[]`
Whenever a command run that returns a tabular data (ex: `docker images`), you can pass the result to this method, which will convert data into JSON.
Example:
```javascript
cmd.run('docker images').then(
    (res)=> {
        let json = cmd.resToJSON(res);
    },
    (err)=> { console.log(err); }
);
```

---
##### `cmd.machine.start(opts: IStartOpts): Q.Promise<{}>`
Starts machine. If it does not exist, it'll be created. Resolves even if machine is already started. 

---
##### `cmd.machine.ipAddress(): Q.Promise<string>`
Returns machine's IP address.

---
##### `cmd.machine.status(): Q.Promise<string>`
Returns machine's status.

---
##### `cmd.image.build(imageName: string, opts?: IBuildImageOpts): Q.Promise<{}>`
Builds desired image.
You can provide object with the following options:
```javascript
export interface IBuildImageOpts {
    /*
     * set path or url to Dockerfile. If not specified assumes current directory.
    */
    pathOrUrl?: string;

    /*
     * if not set to true and image already exists, it'll prompt you with options
     * letting you chose how you want to build the image
    */
    buildAndReplace?: boolean;  
}
```

---
##### `cmd.image.remove(imageName: any): Q.Promise<string>`
Removes desired image

---
##### `cmd.image.checkForDangling(): Q.Promise<{}>`
Checks for dangling images. If found, prompts with question whether to remove them or not.

---
##### `cmd.container.start(imageName: any, opts?: IStartDockerOpts, command?: string): Q.Promise<{}>`
Starts container from desired image.
You can provide object with the following options. See docker docs for options' description:
```javascript
export interface IStartDockerOpts {
    name?: string;
    publish?: string[];
    volume?: string;
    volumesFrom?: string[];
    link?: string[];
    env?: string[];
}
```

---
##### `cmd.container.status(containerName: string): Q.Promise<string>`
Returns container's status.

---
## Credits
Thanks to [Matt Klein](https://github.com/mattklein999), who started out coding this lib.
