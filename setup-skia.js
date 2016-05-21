const spawn = require('child_process').spawn
const path = require('path')

const depotDir = path.join(__dirname, 'depot_tools')

const env = Object.assign({}, process.env, {
  PATH: process.env.PATH + ':' + depotDir
})

console.log('# prepare skia for building')
spawn('python', ['bin/sync-and-gyp'], {
  cwd: path.join(__dirname, 'skia'),
  env: env,
  stdio: 'inherit'
}).on('exit', function() {
  console.log('# building skia_lib')
  spawn('ninja', ['-C', 'out/Debug', 'skia_lib'], {
    cwd: path.join(__dirname, 'skia'),
    env: env,
    stdio: 'inherit'
  })
})
