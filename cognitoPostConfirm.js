"use strict";
const query = require("./lib/query_with_tracing");
const initTracer = require("./lib/tracing").initTracer;

const tracer = initTracer("cognito-post-onfirmation");
const lambdaEventMock = require("lambda-event-mock");

module.exports.handler = async (event) => {
  if (event.triggerSource === "PostConfirmation_ConfirmSignUp") {
    console.log("hi");
    const span = tracer.startSpan("confirm-signup");

    const userAttributes = event.request.userAttributes;
    query(
      `INSERT INTO student
      (id, name, student_phone, email, enrollment_flag, created_time)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userAttributes.sub,
        userAttributes.name,
        userAttributes.phone_number,
        userAttributes.email,
        1,
        "NOW()",
      ],
      span
    ).then((result) => {
      span.log({
        event: "input user data to the DB success",
        result: result,
      });
      span.finish();
      return;
    });
  }
};

console.log(
  lambdaEventMock
    .apiGateway()
    .path("/things")
    .method("POST")
    .header("day", "Friday")
    .body({ one: 1, two: 2 })
    .queryStringParameters({ course_id: 7 })
    .build()
);
