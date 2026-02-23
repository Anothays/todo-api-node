const { toArray, formatTodo, formatTodos } = require("../helpers/utils");

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

  test("formatTodos helper function", () => {
    const todos = [
      {
        id: 1,
        title: "Test Todo 1",
        description: "This is the first test todo",
        status: "pending",
      },
      {
        id: 2,
        title: "Test Todo 2",
        description: "This is the second test todo",
        status: "completed",
      },
    ];
    const result = formatTodos(todos);
    expect(result).toEqual([
      {
        id: 1,
        title: "Test Todo 1",
        description: "This is the first test todo",
        status: "pending",
      },
      {
        id: 2,
        title: "Test Todo 2",
        description: "This is the second test todo",
        status: "completed",
      },
    ]);
  });
});
