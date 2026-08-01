const { execFileSync, spawn } = require('child_process');

function start(command, args) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
  });

  return child;
}

try {
  execFileSync('tsc', ['-p', 'tsconfig.json'], {
    stdio: 'inherit',
    shell: true,
  });
} catch (error) {
  process.exit(error.status || 1);
}

const typeScriptWatcher = start('tsc', [
  '-p',
  'tsconfig.json',
  '--watch',
  '--preserveWatchOutput',
]);

const serverWatcher = start('nodemon', [
  '--watch',
  'dist',
  '--ext',
  'js,json',
  '--exec',
  'node dist/index.js',
]);

function shutdown() {
  typeScriptWatcher.kill();
  serverWatcher.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
