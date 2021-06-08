const path = require("path");
const { DockerComposeEnvironment } = require("testcontainers");

let environment;

beforeAll(async () => {
  environment = await new DockerComposeEnvironment(
    path.join(__dirname, "../"),
    "docker-compose.yml"
  ).up();
});

afterAll(async () => {
  await environment.down();
}, 20000);
