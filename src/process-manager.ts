import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import path from 'path';

export class ProcessManager {
  private process: Record<string, ChildProcessWithoutNullStreams> = {};

  start(id: string, entry: string, env: Record<string, any>): void {
    this.stop(id);
    this.process[id] = spawn('deno', ['run', '--allow-env', '--allow-net', path.resolve(entry)], {
      env,
    });

    this.process[id].stdout.on('data', (data) => {
      console.log('data', data.toString());
    });

    this.process[id].stderr.on('data', (data) => {
      console.log('error', data.toString());
    });

    this.process[id].on('error', () => {
      this.stop(id);
    });
  }

  stop(id: string): void {
    if (this.process[id]?.kill('SIGTERM')) {
      delete this.process[id];
    }
  }
}