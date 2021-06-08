const { expect, test, beforeAll, afterAll } = require("@jest/globals");
const lambdaEventMock = require("lambda-event-mock");
const fs = require("fs");
const path = require("path");
const { DockerComposeEnvironment } = require("testcontainers");
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

const getParts = require("../src/getParts");

describe("getParts", () => {
  let environment;

  beforeAll(async () => {
    environment = await new DockerComposeEnvironment(
      path.join(__dirname, "../"),
      "docker-compose.yml"
    ).up();

    let expectedTables = ["subject", "course", "chapter", "part"];
    await createTables(expectedTables);
  }, 30000);

  test("When course_id is not in the queryString", () => {
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

  test("When there isn't any parts corresponding to course_id", () => {
    const event = lambdaEventMock
      .apiGateway()
      .path("/parts")
      .method("GET")
      .queryStringParameters({ course_id: 3 })
      .build();

    return getParts.handler(event).then((result) =>
      expect(result).toEqual({
        statusCode: 404,
        body: JSON.stringify({ message: "해당하는 과목 정보가 없습니다." }),
      })
    );
  });

  test("When there are some parts corresponding to course_id", () => {
    const event = lambdaEventMock
      .apiGateway()
      .path("/parts")
      .method("GET")
      .queryStringParameters({ course_id: 7 })
      .build();

    return getParts.handler(event).then((result) => expect(result).toEqual([]));
  });

  afterAll(async () => {
    await mysql.end();
    await environment.down();
  }, 20000);
});

async function createTables(tables) {
  const sqlPath = path.join(__dirname, "../sql/src");
  let sql = "";

  for (let tableName of tables) {
    sql += fs.readFileSync(path.join(sqlPath, `/${tableName}.sql`)).toString();
  }

  mysql.config({ multipleStatements: true });
  await mysql.query(sql).catch(console.log);
  mysql.end();
}
