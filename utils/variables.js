const dotenv = {
  PORT_API: 3000,
  SECRET: 'byOmitmv@123',
  ORACLE_USER: 'TRANS',
  ORACLE_PASS: 'TRANS',
  ORACLE_CONNECT_STRING:
    '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=200.95.188.251)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=oracle)))'
}

module.exports = { dotenv }
