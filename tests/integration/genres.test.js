const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const { default: mongoose } = require("mongoose");

describe("/api/genres", () => {
  let server;
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.deleteMany({});
    await server.close();
  });

  describe("GET/", () => {
    it("should return all genres", async () => {
      await Genre.create([
        { name: "genre1", year: 2012 },
        { name: "genre2", year: 2014 },
      ]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET/:id", () => {
    it("should return a genre if valid id is passed", async () => {
      const genre = await Genre.create({ name: "genre1", year: 2012 });

      const res = await request(server).get("/api/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", genre.name);
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });

    it("should return 404 if genre by given id does not exist", async () => {
      const id = new mongoose.Types.ObjectId();
      const res = await request(server).get("/api/genres/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST/", () => {
    let token;
    let name; //genre's name

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name, year: 2012 });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save genre if it is valid", async () => {
      await exec();

      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });

    it("should return genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT/:id", () => {
    let name; //genre's name
    let id;
    let year;

    const exec = async () => {
      return await request(server)
        .put("/api/genres/" + id)
        .send({ name, year });
    };

    const createGenre = async () => {
      const genre = new Genre({ name, year });
      await genre.save();
      return genre._id.toHexString();
    };

    beforeEach(() => {
      name = "genre1";
      year = 2012;
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      await createGenre();

      name = "1234"; //invalid name
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      await createGenre();

      name = new Array(52).join("a"); //invalid name
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should find by id and update if id is valid", async () => {
      id = await createGenre();

      name = "newGenre";
      year = 2013;

      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ _id: id, name, year });
    });

    it("should return 404 if genre by given id does not exist", async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE/:id", () => {
    let token;
    let id;
    let genre;

    const exec = async () => {
      return await request(server)
        .delete("/api/genres/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      // Before each test we need to create a genre and
      // put it in the database.
      genre = new Genre({ name: "genre1", year: 2012 });
      await genre.save();
      id = genre._id;

      token = new User({ isAdmin: true }).generateAuthToken();
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 403 is user is NOT an admin", async () => {
      token = new User({ isAdmin: false }).generateAuthToken();

      const res = await exec();
      expect(res.status).toBe(403);
    });

    it("should return 404 if id is invalid", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if genre by given id does not exist", async () => {
      id = new mongoose.Types.ObjectId();
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should remove the genre if id is valid", async () => {
      await exec();

      const genreInDb = await Genre.findById(id);
      expect(genreInDb).toBeNull();
    });

    it("should return the removed genre", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id", genre._id.toHexString());
      expect(res.body).toHaveProperty("name", genre.name);
    });
  });
});
