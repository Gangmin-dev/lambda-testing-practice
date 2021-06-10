const path = require("path");
const { DockerComposeEnvironment } = require("testcontainers");

const getPartsTest = require("./getParts.test");

let environment;

beforeAll(async () => {
  environment = await new DockerComposeEnvironment(
    path.join(__dirname, "../"),
    "docker-compose.yml"
  ).up();
}, 60000);

afterAll(async () => {
  await environment.down();
}, 20000);

getPartsTest();
