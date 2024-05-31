import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { authRoutes } from "./routes/auth.route.js";
import { todoRoutes } from "./routes/todos.route.js";
import auth from "./middleware/auth.middleware.js"; // Import middleware

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000", // Update this to your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Use routes individually
app.use("/api/auth", authRoutes);
app.use("/api/todos", auth, todoRoutes); // Use auth middleware here

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
