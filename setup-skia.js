var spawn = require('child_process').spawn
var path = require('path')
var mkdirp = require('mkdirp')
var os = require('os').platform()
var depotDir = path.join(__dirname, 'depot_tools')
var binDir = path.join(__dirname, 'bin')
var envPathSep = os === 'win32' ? ';' : ':'
console.log(process.env)
var env = {
  PATH: process.env.PATH + envPathSep + depotDir + envPathSep + binDir,
  NUMBER_OF_PROCESSORS: process.env.NUMBER_OF_PROCESSORS,
  TMP: process.env.TMP
}

console.log('# pulling down skia, this may take a bit')
spawn('python', [path.join(depotDir, 'gclient.py'), 'sync'], {
  cwd: path.join(__dirname),
  env: env,
  stdio: 'inherit'
}).on('exit', function() {
  process.chdir( path.join(__dirname, 'skia'))
  console.log('# prepare skia for building')
  //spawn('python', ['gyp_skia', '--verbose'], {
  spawn('python', ['gyp_skia'], {
    cwd: path.join(__dirname, 'skia'),
    env: env,
    stdio: 'inherit'
  }).on('exit', function() {
    console.log('# building skia_lib')
    spawn('ninja', ['-C', 'out/Debug', 'skia_lib', '-v'], {
      cwd: path.join(__dirname, 'skia'),
      env: env,
      stdio: 'inherit'
    })
  })
})
