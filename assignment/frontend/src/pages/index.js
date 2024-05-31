import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
import api from "../utils/api";
import { getToken, removeToken } from "../utils/auth";
import Todo from "../components/Todo";

const Index = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const router = useRouter();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.log("No token found, redirecting to login");
      router.push("/login");
      return;
    }

    const socketInstance = io("http://localhost:5000", {
      auth: { token: `Bearer ${token}` },
    });
    setSocket(socketInstance);

    const fetchTodos = async () => {
      try {
        console.log("Fetching todos with token:", token);
        const res = await api.get("/todos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Fetched todos:", res.data);
        setTodos(res.data);
      } catch (error) {
        console.error(
          "Error fetching todos:",
          error.response ? error.response.data : error.message
        );
      }
    };

    fetchTodos();

    socketInstance.on("todoUpdated", (updatedTodos) => {
      console.log("Received todoUpdated event with todos:", updatedTodos);
      setTodos(updatedTodos);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [router]);

  const addTodo = async () => {
    try {
      const res = await api.post(
        "/todos",
        { title },
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setTodos((prevTodos) => [...prevTodos, res.data]);
      setTitle("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
  };

  const logout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 border border-gray-300 rounded-md">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="New Todo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-grow border border-gray-300 rounded-md px-2 py-1 mr-2"
        />
        <button
          onClick={addTodo}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add
        </button>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded-md ml-2 hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      {todos.map((todo) => (
        <Todo key={todo._id} todo={todo} onDelete={deleteTodo} />
      ))}
    </div>
  );
};

export default Index;
