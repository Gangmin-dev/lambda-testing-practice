const { expect, test, beforeAll, afterAll } = require("@jest/globals");
const lambdaEventMock = require("lambda-event-mock");
const fs = require("fs");
const path = require("path");
const { DockerComposeEnvironment, Wait } = require("testcontainers");
const mysql = require("serverless-mysql")({
  library: require("mysql2"),
  config: {
    user: "root",
    database: "test_db",
    password: "12345678",
  },
});

const getParts = require("../src/getParts");

// TODO: MySql을 도커에 띄운 후에 connection이 가능할 때 까지 테스트를 진행하지 않도록 수정해야 함.

describe("getParts", () => {
  let environment;

  beforeAll(async () => {
    environment = await new DockerComposeEnvironment(
      path.join(__dirname, "../"),
      "docker-compose.yml"
    )
      // .withWaitStrategy(
      //   "test-db",
      //   Wait.forLogMessage("mysqld: ready for connections.")
      // )
      .up();
    console.log(environment);
    const mysqlContainer = environment.getContainer("test-db");
    console.log(mysqlContainer);

    process.env.DB_HOST = mysqlContainer.getHost();
    process.env.DB_PORT = mysqlContainer.getMappedPort(3306);

    mysql.config({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    });
  }, 30000);

  test("create tables", async () => {
    let tables = ["subject", "course", "chapter", "part"];
    await createTables(tables);

    return mysql.query(`SHOW TABLES`).then((result) => {
      expect(result.length).toBe(tables.length);
    });
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
  await mysql.query(sql).then(console.log).catch(console.log);
  mysql.end();
}
