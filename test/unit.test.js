const { expect, test } = require("@jest/globals");
const lambdaEventMock = require("lambda-event-mock");
const fs = require("fs");
const path = require("path");

const mysql = require("serverless-mysql")({
  library: require("mysql2"),
  config: {
    host: "localhost",
    port: 3336,
    user: "root",
    database: "test_db",
    password: "12345678",
  },
});

const getParts = require("../src/getParts");

describe("getParts", () => {
  test("create tables", async () => {
    await createTables(["subject", "course", "chapter", "part"]);

    expect().toEqual();
  });

  test("course_id is not in the queryString", () => {
    const event = lambdaEventMock
      .apiGateway()
      .path("/parts")
      .method("GET")
      .queryStringParameters({ courseId: 3 })
      .build();

    return getParts.handler(event).then((result) =>
      expect(result).toEqual({
        statusCode: 400,
        body: JSON.stringify({
          message: "there is no matching queryString",
        }),
      })
    );
  });

  test("course_id에 해당하는 part가 없을 때", () => {
    const event = lambdaEventMock
      .apiGateway()
      .path("/parts")
      .method("GET")
      .queryStringParameters({ course_id: 3 })
      .build();

    return getParts.handler(event).then((result) => expect(result).toEqual([]));
  });

  test("course_id에 해당하는 part가 있을 때", () => {
    const event = lambdaEventMock
      .apiGateway()
      .path("/parts")
      .method("GET")
      .queryStringParameters({ course_id: 7 })
      .build();

    return getParts.handler(event).then((result) => expect(result).toEqual([]));
  });
});

async function createTables(tables) {
  const sqlPath = path.join(__dirname, "../sql/src");
  let sql = "";

  for (let tableName of tables) {
    sql += fs.readFileSync(path.join(sqlPath, `/${tableName}.sql`)).toString();
  }

  mysql.config({ multipleStatements: true });
  await mysql.query(sql).then(console.log).catch(console.log);
  mysql.end();
}
