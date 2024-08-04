
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new Error("No data");

  // { firstName: 'Aliya', age: 32 } => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };

/**
 * Generates a SQL query for partially updating rows in a database table.
 * Constructs the `SET` clause of an `UPDATE` SQL statement and provides
 * the corresponding values for parameterized queries.
 *
 * @param {Object} dataToUpdate - An object containing the column names and values to be updated.
 *                                Example: { firstName: 'Aliya', age: 32 }
 * @param {Object} jsToSql - An object that maps JavaScript-style camelCase column names
 *                           to database-style snake_case column names.
 *                           Example: { firstName: 'first_name', age: 'age' }
 * @returns {Object} An object with two properties:
 *                   - setCols {String}: A string representing the `SET` clause of an `UPDATE` SQL statement.
 *                                      Example: '"first_name"=$1, "age"=$2'
 *                   - values {Array}: An array of the values to be updated, in the same order as the columns in `setCols`.
 *                                    Example: ['Aliya', 32]
 * @throws {BadRequestError} If `dataToUpdate` is empty, the function throws an error indicating that no data was provided for the update.
 */
// helpers/sql.js
