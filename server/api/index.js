import express from "express";
import cors from "cors";
import authRouter from "../Router/Auth.js";
import init from "../db/Conn.js";
import uR from "../Router/Users.js";
import { Server } from "socket.io";
import http from "http";

const app = express();

const server = http.createServer(app);

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

io.on("connection", (socket) => {
  // console.log(`User Connected: ${socket.id}}`);
  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User ${socket.id} Joined Room: ${data}`);
  });

  socket.on("send_message", (data) => {
    console.log(data)
    socket.to(data.room).emit("receive_message", data);
    // io.to(data.room).emit("receive_message", data);
    // socket.to(data.room).emit("receive_message", data);
    // console.log(`User ${socket.id} Sent Message: ${data}`);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected ", socket.id);
  });

});

app.get("/", (req, res) => {
  res.send("API v0.0.1");
});
app.use("/auth", authRouter);
app.use("/user", uR);

// 
// app.use("/", (req, res) => {
//   console.log(req.body);
  
// });
const routeLoggerMiddleware = (req, res, next) => {
  console.log(`Accessed route: ${req.method} ${req.originalUrl}`);
  next();
};



app.use(routeLoggerMiddleware);

// const PORT = 5000;
// app.listen(PORT, () => {
//   console.clear()
//   init()
//   console.log(`Server @ http://localhost:${PORT}`);
// });

// server.listen(5001, () => {
//   console.log("Socket Server @ http://localhost:5001");
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.clear()
  init()
  console.log(`Server is running on port ${PORT}`);
});

export default app;
