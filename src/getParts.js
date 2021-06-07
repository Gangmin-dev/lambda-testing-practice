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
