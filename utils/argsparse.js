const minimist = require('minimist');

const args = process.argv.slice(2);
const argsparse = minimist(args, {
    default: {
        port: 8080,
        mode: 'fork',
        persistenceType : 'mongoDb'
    },
    alias: {
        p: 'port',
        m: 'mode',
        t: 'persistenceType'
    }
});

module.exports = argsparse;