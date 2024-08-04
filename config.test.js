"use strict";

describe("config can come from env", function () {
  test("works", function () {
    // Set environment variables for the test
    process.env.SECRET_KEY = "abc";
    process.env.PORT = "5000";
    process.env.DATABASE_URL = "other";
    process.env.NODE_ENV = "other";

    // Require the config module after setting env variables to ensure it reads them
    const config = require("./config");

    // Check that the config reads the environment variables correctly
    expect(config.SECRET_KEY).toEqual("abc");
    expect(config.PORT).toEqual(5000);
    expect(config.getDatabaseUri()).toEqual("other");
    expect(config.BCRYPT_WORK_FACTOR).toEqual(12);

    // Clean up the environment variables
    delete process.env.SECRET_KEY;
    delete process.env.PORT;
    delete process.env.DATABASE_URL;
    delete process.env.BCRYPT_WORK_FACTOR;

    // Check that the config falls back to default values
    expect(config.getDatabaseUri()).toEqual("jobly");

    // Set NODE_ENV to "test" and check the database URI for the test environment
    process.env.NODE_ENV = "test";
    expect(config.getDatabaseUri()).toEqual("jobly_test");
  });
});
