import express from "express";
import http from "http";
import { Server } from "socket.io";
import { syncModels } from "./models/user.js";
import userRouter from "./routes/userRoute.js";
import applicantRouter from "./routes/applicant_Route.js";
import activityLogs from "./routes/activityLogs_Route.js";
import rateLimit from "express-rate-limit";
import { requestMethod } from "./controllers/chatController.js";
import { Chat } from "./models/chat.js";
//import { cronSchedule } from "./controllers/applicant_Controller.js";

//import { seedingDatabase } from './seeder/seed_File.js';
import cors from "cors";
import apiDetails from "./controllers/api_Logs_Controller.js";
import { cronSchedule } from "./controllers/applicant_Controller.js";

await syncModels();
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: "Too many request(s) from this IP",
});

//seedingDatabase()
const app = express();
app.use(express.json());
app.use(cors());
app.use(limiter);
app.use(apiDetails);
app.use("/api/auth", userRouter);
app.use("/api/applicant", applicantRouter);
app.use("/api", activityLogs);
//socket.io section//
const server = http.createServer(app);
const io = new Server(server);
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for chat messages from clients and get stored in msg variable.
  socket.on("chat message", async (msg) => {
    console.log("Message received from client: " + msg);
    try {
      const gptResponse = await requestMethod(msg);

      // Emit the GPT response back to the specific client
      io.emit("chat message", gptResponse);

      // Save the chat message to the database
      await Chat.create({
        question: msg,
        gptResponse,
      });
    } catch (error) {
      console.error("Error processing chat message:", error);
      io.emit("chat message", "Error processing your message");
    }
  });
});

//socket.io section End//

//const deletedRecords=cronSchedule();
//console.log(deletedRecords);
server.listen(3000, () => {
  console.log(
    `Server is running at http://localhost:3000`
  );
});

