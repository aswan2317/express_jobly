const { sqlForPartialUpdate } = require('./sql');
const { BadRequestError } = require('../expressError');

describe("sqlForPartialUpdate", () => {
  test("works: single field", () => {
    const result = sqlForPartialUpdate(
      { firstName: "Aliya" },
      { firstName: "first_name" }
    );
    expect(result).toEqual({
      setCols: '"first_name"=$1',
      values: ["Aliya"]
    });
  });

  test("works: multiple fields", () => {
    const result = sqlForPartialUpdate(
      { firstName: "Aliya", age: 32 },
      { firstName: "first_name", age: "age" }
    );
    expect(result).toEqual({
      setCols: '"first_name"=$1, "age"=$2',
      values: ["Aliya", 32]
    });
  });

  test("works: jsToSql mapping not provided", () => {
    const result = sqlForPartialUpdate(
      { firstName: "Aliya", age: 32 },
      {}
    );
    expect(result).toEqual({
      setCols: '"firstName"=$1, "age"=$2',
      values: ["Aliya", 32]
    });
  });

  test("throws error if no data", () => {
    expect(() => {
      sqlForPartialUpdate({}, {});
    }).toThrow(BadRequestError);
  });
});
