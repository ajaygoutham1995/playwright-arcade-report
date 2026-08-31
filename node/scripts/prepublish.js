const { spawnSync } = require('child_process');

function hasTypescript() {
  try {
    require.resolve('typescript');
    return true;
  } catch (e) {
    return false;
  }
}

if (hasTypescript()) {
  console.log('typescript found — running clean, build and tests');
  const steps = [ ['run','clean'], ['run','build'], ['test'] ];
  for (const args of steps) {
    const res = spawnSync('npm', args, { stdio: 'inherit' });
    if (res.status !== 0) {
      process.exit(res.status);
    }
  }
  process.exit(0);
} else {
  console.warn('Skipping build & tests: devDependencies (typescript) are not installed.\nIf you want prepublish checks to run, install devDependencies (`npm install`) or run the build locally before publishing.');
  process.exit(0);
}
