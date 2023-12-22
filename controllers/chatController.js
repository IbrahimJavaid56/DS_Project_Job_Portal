import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


export async function requestMethod(msg){
    try {
      const openaiEndpoint = "https://api.openai.com/v1/chat/completions";
      //const openaiApiKey = "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"; // OpenAI API key
        const openaiApiKey = "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"
      const response = await axios.post(
        openaiEndpoint,
        {
          messages: [{ role: "user", content: msg }],
          model: "gpt-3.5-turbo",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
          },
        }
      );

      return (response.data.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error.message);
      return (error.message);
    }
}
export default {requestMethod};

