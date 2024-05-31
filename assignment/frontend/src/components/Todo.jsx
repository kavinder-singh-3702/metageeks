import { useState } from "react";
import api from "../utils/api";
import { getToken } from "../utils/auth";

const Todo = ({ todo, onDelete }) => {
  const [title, setTitle] = useState(todo.title);
  const [completed, setCompleted] = useState(todo.completed);

  const updateTodo = async () => {
    try {
      const res = await api.put(
        `/todos/${todo._id}`,
        { title, completed },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      setTitle(res.data.title);
      setCompleted(res.data.completed);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async () => {
    try {
      await api.delete(`/todos/${todo._id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      onDelete(todo._id); // Notify the parent component about the deletion
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded-md px-2 py-1"
      />
      <input
        type="checkbox"
        checked={completed}
        onChange={(e) => setCompleted(e.target.checked)}
        className="rounded border-gray-300"
      />
      <button
        onClick={updateTodo}
        className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
      >
        Update
      </button>
      <button
        onClick={deleteTodo}
        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
};

export default Todo;
