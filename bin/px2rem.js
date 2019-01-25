#!/usr/bin/env node
const program = require('commander');
program.version('0.1.0').option('-I, --init', 'init').option('-R, --run', 'start to convert').parse(process.argv);

if (program.init) {
  require('../lib/init.js');
} else if (program.run) {
  require('../lib/convert.js');
} else {
  console.log('');
  console.log('Options:');
  console.log('    -I, --init                    init');
  console.log('    -R, --run                     start to convert');
}
