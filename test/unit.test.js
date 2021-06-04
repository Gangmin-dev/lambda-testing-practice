const { expect, test } = require("@jest/globals");
const lambdaEventMock = require("lambda-event-mock");
const fs = require("fs");

const getParts = require("../src/getParts");

describe("abc", () => {
  test("aaa", async () => {
    expect(1).toEqual(1);
  });
  it("bbb", async () => {
    expect(1).toEqual(1);
  });
});

describe.each([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])(".add(%i, %i)", (a, b, expected) => {
  test(`returns ${expected}`, () => {
    expect(a + b).toBe(expected);
  });

  test(`returned value not be greater than ${expected}`, () => {
    expect(a + b).not.toBeGreaterThan(expected);
  });

  test(`returned value not be less than ${expected}`, () => {
    expect(a + b).not.toBeLessThan(expected);
  });
});

describe("getParts", () => {
  test("create tables", () => {
    const sql = fs.readFileSync("").toString();
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

  test("1", () => {
    const event = lambdaEventMock
      .apiGateway()
      .path("/parts")
      .method("GET")
      .queryStringParameters({ course_id: 3 })
      .build();

    return getParts.handler(event).then((result) => expect(result).toEqual([]));
  });
  test("2", () => {
    const event = lambdaEventMock
      .apiGateway()
      .path("/parts")
      .method("GET")
      .queryStringParameters({ course_id: 3 })
      .build();

    return getParts.handler(event).then((result) => expect(result).toEqual([]));
  });
});
