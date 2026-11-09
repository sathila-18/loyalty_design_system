// Runs a command with a time limit; on timeout kills the command and every descendant. Playwright's Chrome escapes a
// process-group kill, so descendants are found with pgrep -P and killed one by one. macOS has no `timeout` command.
// Usage: node scripts/visual/run-limited.mjs <minutes> <cmd> [args…]
//   e.g. node scripts/visual/run-limited.mjs 240 node scripts/visual.ts snapshot --static /tmp/sb-main --out /tmp/main-all
import { spawn, execFileSync } from 'node:child_process';

const [minutes, cmd, ...args] = process.argv.slice(2);
if (!minutes || !cmd) {
  console.error('Usage: node scripts/visual/run-limited.mjs <minutes> <cmd> [args…]');
  process.exit(1);
}
const child = spawn(cmd, args, { stdio: 'inherit' });

function descendants(pid) {
  let kids = [];
  try {
    kids = execFileSync('pgrep', ['-P', String(pid)], { encoding: 'utf8' }).split('\n').filter(Boolean).map(Number);
  } catch {
    // No children.
  }
  return kids.flatMap((k) => [k, ...descendants(k)]);
}

const timer = setTimeout(() => {
  console.error(`run-limited: time limit of ${minutes} min reached, killing the run`);
  for (const pid of [...descendants(child.pid), child.pid]) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch {
      // Already gone.
    }
  }
  process.exit(124);
}, Number(minutes) * 60_000);

child.on('exit', (code, signal) => {
  clearTimeout(timer);
  process.exit(code ?? (signal ? 1 : 0));
});
