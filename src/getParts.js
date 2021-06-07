const mysql = require("serverless-mysql")({
  library: require("mysql2"),
  config: {
    host: "localhost",
    port: 3336,
    user: "root",
    database: "test_db",
    // host: "mytestdatabase.c1t0iaypjlcw.ap-northeast-2.rds.amazonaws.com",
    // port: 3306,
    // user: "admin",
    // database: "practice0427",
    password: "12345678",
  },
});

module.exports.handler = async (event) => {
  if (!event.queryStringParameters.course_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "there is no matching queryString",
      }),
    };
  }

  return mysql
    .query(
      `SELECT id, number, title FROM chapter WHERE course_id = ? ORDER BY id`,
      [event.queryStringParameters.course_id]
    )
    .finally(mysql.end());
};
