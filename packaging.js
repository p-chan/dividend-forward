const cpx = require('cpx')
const zip = require('cross-zip')

cpx.copySync('./dist/**/*.js', './package/dist')
cpx.copySync('./images/**/*', './package/images')
cpx.copySync('./manifest.json', './package')

zip.zipSync('./package', './package.zip')
