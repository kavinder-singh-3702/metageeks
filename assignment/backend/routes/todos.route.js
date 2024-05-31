import express from "express";
import { Todo } from "../models/todo.model.js";
import auth from "../middleware/auth.middleware.js"; // Import middleware
const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (error) {
    res.status(400).json({ error: "Error fetching todos" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const todo = new Todo({
      user: req.user.id,
      title: req.body.title,
    });
    const savedTodo = await todo.save();
    res.json(savedTodo);
  } catch (error) {
    res.status(400).json({ error: "Error creating todo" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }
    todo.title = req.body.title;
    todo.completed = req.body.completed;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ error: "Error updating todo" });
  }
});
router.delete("/:id", auth, async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }
    res.json({ message: "Todo removed" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

export { router as todoRoutes };
