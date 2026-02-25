/**
 * Converts the first row of an sql.js query result into a plain object (column name -> value).
 * @param {import("sql.js").QueryExecResult[]} rows - Query result from db.exec()
 * @returns {Record<string, unknown>} A single row as an object
 */
function toObj(rows) {
  const cols = rows[0].columns;
  const vals = rows[0].values[0];
  const obj = {};
  cols.forEach((c, i) => (obj[c] = vals[i]));
  return obj;
}

/**
 * Converts all rows of an sql.js query result into an array of plain objects.
 * @param {import("sql.js").QueryExecResult[]} rows - Query result from db.exec()
 * @returns {Record<string, unknown>[]} Array of rows as objects
 */
function toArray(rows) {
  if (!rows.length) return [];
  const cols = rows[0].columns;
  return rows[0].values.map((vals) => {
    const obj = {};
    cols.forEach((c, i) => (obj[c] = vals[i]));
    return obj;
  });
}

/**
 * Normalizes a todo into an object with only id, title, description, and status.
 * @param {{ id?: unknown; title?: unknown; description?: unknown; status?: unknown }} todo - Raw todo object
 * @returns {{ id: unknown; title: unknown; description: unknown; status: unknown }} Formatted todo
 */
function formatTodo(todo) {
  const tmp = {};
  tmp["id"] = todo.id;
  tmp["title"] = todo.title;
  tmp["description"] = todo.description;
  tmp["status"] = todo.status;
  return tmp;
}

export { formatTodo, toArray, toObj };
