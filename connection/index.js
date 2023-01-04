const oracledb = require('oracledb')

async function connection() {
    await oracledb.getConnection({
        user: 'globus',
        password: 'globus',
        connectString: '200.95.188.251:1521/ORACLE'
    })
}

module.exports = connection()