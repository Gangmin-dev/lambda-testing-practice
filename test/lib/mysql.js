const fs = require("fs");
const path = require("path");
const mysql = require("serverless-mysql")({
  library: require("mysql2"),
  config: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  },
});

async function createTables(tables) {
  const sqlPath = path.join(__dirname, "../../sql/src");
  let sql = "";

  for (let tableName of tables) {
    sql += fs.readFileSync(path.join(sqlPath, `/${tableName}.sql`)).toString();
  }

  mysql.config({ multipleStatements: true });
  await mysql.query(sql).catch(console.log);
  mysql.config({ multipleStatements: false });
  mysql.end();
}

async function insertGivenData(tables) {
  const sqlPath = path.join(__dirname, "../../sql/testdata");
  let sql = "";

  for (let tableName of tables) {
    sql += fs.readFileSync(path.join(sqlPath, `/${tableName}.sql`)).toString();
  }

  mysql.config({ multipleStatements: true });
  await mysql.query(sql).catch(console.log);
  mysql.config({ multipleStatements: false });
  mysql.end();
}

module.exports = {
  mysql,
  createTables,
  insertGivenData,
};
