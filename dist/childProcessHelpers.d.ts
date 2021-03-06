export declare function spawn(command: string, env: any, debug: boolean, cb: (result: RunResult) => void): void;
export declare function spawnSync(command: string, env: any, debug: boolean): RunResult;
export interface RunResult {
    stdOut: string;
    stdErr: string;
}
