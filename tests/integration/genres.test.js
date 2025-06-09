const request = require("supertest");
const { Genre } = require("../../models/genre");
let server;

describe("/api/genres", () => {
  beforeEach(async () => {
    server = require("../../index");
    await Genre.deleteMany({});
  });
  afterEach(() => {
    server.close();
  });

  describe("GET/", () => {
    it("should return all genres", async () => {
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET/:id", () => {
    it("should return a genre by given id if it exists", async () => {
      const genre = new Genre({ name: "genre1", year: 2012 });
      await genre.save();

      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if genre by given id does not exist", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });
  });
});
