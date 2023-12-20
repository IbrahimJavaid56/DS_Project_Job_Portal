import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import axios from 'axios';
import { Chat } from '../models/chat.js'; 

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for chat messages from clients
  socket.on('chat message', async (msg) => {
    console.log('Message received from client: ' + msg);

    try {
      // Send user's message to OpenAI GPT-3.5 Turbo
      const gptResponse = await chatbot(msg);

      // Emit the GPT response back to the specific client
      io.emit('chat message', gptResponse);

      // Save the chat message to the database
      await Chat.create({
        question: msg,
        gptResponse,
      });
    } catch (error) {
      console.error('Error processing chat message:', error);
      // Handle the error (e.g., emit an error message to the client)
      io.emit('chat message', 'Error processing your message');
    }
  });
});

// Your chatbot function
const chatbot = async (question) => {
  try {
    const openaiEndpoint = 'https://api.openai.com/v1/chat/completions';
    const openaiApiKey = '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';

    const response = await axios.post(
      openaiEndpoint,
      {
        messages: [{ role: 'user', content: question }],
        model: 'gpt-3.5-turbo',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error:', error.message);
    throw error.message;
  }
};

// Express route for handling HTTP requests
app.post('/chatGpt', (req, res) => {
  const { question } = req.body;

  // Use the chatbot function to get a response
  chatbot(question)
    .then((data) => {
      res.status(200).json({ data });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
