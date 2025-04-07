import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./services/openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat API endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, messageHistory } = req.body;
      
      if (!message) {
        return res.status(400).json({ 
          message: "No message provided" 
        });
      }
      
      // Process the message using OpenAI
      const response = await generateChatResponse(message, messageHistory);
      
      return res.json(response);
    } catch (error) {
      console.error("Error processing chat message:", error);
      return res.status(500).json({ 
        message: "An error occurred while processing your message" 
      });
    }
  });

  // Search service endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ 
          message: "No search query provided" 
        });
      }
      
      // In a real implementation, this would call an actual search API
      // For now, we'll return mock data
      const searchResults = {
        results: [
          {
            title: "Medical Information - " + query,
            url: "https://example.com/medical-info",
            displayUrl: "example.com/medical-info",
            snippet: "This page contains information about " + query
          },
          {
            title: "Health Guidelines - " + query,
            url: "https://example.com/guidelines",
            displayUrl: "example.com/guidelines",
            snippet: "Official health guidelines about " + query
          }
        ]
      };
      
      return res.json(searchResults);
    } catch (error) {
      console.error("Error processing search:", error);
      return res.status(500).json({ 
        message: "An error occurred while searching" 
      });
    }
  });

  // Video search service endpoint
  app.get("/api/videos", async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ 
          message: "No video search query provided" 
        });
      }
      
      // In a real implementation, this would call YouTube API
      // For now, we'll return mock data
      const videoResults = {
        videos: [
          {
            title: "Understanding " + query,
            videoId: "dQw4w9WgXcQ", // For demonstration purposes
            thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
            channel: "Medical Channel",
            duration: "5:42"
          }
        ]
      };
      
      return res.json(videoResults);
    } catch (error) {
      console.error("Error processing video search:", error);
      return res.status(500).json({ 
        message: "An error occurred while searching for videos" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
