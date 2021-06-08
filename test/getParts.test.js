const { expect, test, beforeAll, afterAll } = require("@jest/globals");
const lambdaEventMock = require("lambda-event-mock");
const path = require("path");
const { mysql, createTables, insertGivenData } = require("./lib/mysql");

const getParts = require("../src/getParts");

describe("getParts", () => {
  let environment;

  beforeAll(async () => {
    // Given
    let expectedTables = ["subject", "course", "chapter", "part"];
    await createTables(expectedTables);
    await insertGivenData(expectedTables);
  }, 30000);

  test("When course_id is not in the queryString", () => {
    const event = lambdaEventMock
      .apiGateway()
      .path("/parts")
      .method("GET")
      .queryStringParameters({ courseId: 3 })
      .build();

    return getParts.handler(event).then((result) => {
      // Then
      expect(result.statusCode).toBe(400);
      expect(result.body).toEqual(
        JSON.stringify({
          message: "there is no matching queryString",
        })
      );
    });
  });

  test("When there isn't any parts corresponding to course_id", () => {
    const event = lambdaEventMock
      .apiGateway()
      .path("/parts")
      .method("GET")
      .queryStringParameters({ course_id: 3 })
      .build();

    return getParts.handler(event).then((result) => {
      // Then
      expect(result.statusCode).toBe(404);
      expect(result.body).toEqual(
        JSON.stringify({
          message: "해당하는 과목 정보가 없습니다.",
        })
      );
    });
  });

  test("When there are some parts corresponding to course_id", () => {
    const event = lambdaEventMock
      .apiGateway()
      .path("/parts")
      .method("GET")
      .queryStringParameters({ course_id: 7 })
      .build();

    return getParts.handler(event).then((result) => {
      // Then
      expect(result.statusCode).toBe(200);
      expect(result.body).toEqual(JSON.stringify({}));
    });
  });

  afterAll(async () => {
    await mysql.end();
  }, 20000);
});
