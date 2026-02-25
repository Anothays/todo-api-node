import { formatTodo, toArray } from "../helpers/utils.js";

describe("Todo Helpers", () => {
  test("toArray helper function", () => {
    const rows = [
      {
        columns: ["id", "title", "description", "status"],
        values: [[1, "Test Todo", "This is a test todo", "pending"]],
      },
    ];
    const result = toArray(rows);
    expect(result).toEqual([
      {
        id: 1,
        title: "Test Todo",
        description: "This is a test todo",
        status: "pending",
      },
    ]);
  });

  test("formatTodo helper function", () => {
    const todo = {
      id: 1,
      title: "Test Todo",
      description: "This is a test todo",
      status: "pending",
    };
    const result = formatTodo(todo);
    expect(result).toEqual({
      id: 1,
      title: "Test Todo",
      description: "This is a test todo",
      status: "pending",
    });
  });
});
