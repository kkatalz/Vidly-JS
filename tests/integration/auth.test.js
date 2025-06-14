const { User } = require("../../models/user");
const { Genre } = require("../../models/genre");
const request = require("supertest");
let server;

describe("auth middleware", () => {
  beforeEach(async () => {
    server = require("../../index");
    token = new User().generateAuthToken();
  });
  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
  });

  let token;
  const exec = () => {
    return request(server)
      .post("/api/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1", year: " 2012" });
  };

  it("should return 401 if no token is provided", async () => {
    token = "";

    const res = await exec();
    expect(res.status).toBe(401);
  });

  it("should return 400 if invalid token is provided", async () => {
    token = "a";

    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 200 if valid token is provided", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
