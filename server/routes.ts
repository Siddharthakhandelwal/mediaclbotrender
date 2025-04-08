import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./services/openai";
import { searchWithPerplexity, isPerplexityAvailable } from "./services/perplexity";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for deployment platforms
  app.get("/api/health", (req, res) => {
    // Check for required API keys
    const groqKeyAvailable = !!process.env.GROQ_API_KEY;
    const elevenLabsKeyAvailable = !!process.env.ELEVEN_LABS_API_KEY;
    const perplexityKeyAvailable = !!process.env.PERPLEXITY_API_KEY;
    
    res.status(200).json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      env: {
        node_env: process.env.NODE_ENV || 'development',
        groq_api: groqKeyAvailable ? 'available' : 'missing',
        eleven_labs_api: elevenLabsKeyAvailable ? 'available' : 'missing',
        perplexity_api: perplexityKeyAvailable ? 'available' : 'missing (optional)'
      }
    });
  });

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
      
      // Check if Perplexity API is available for enhanced search
      if (isPerplexityAvailable() && typeof query === 'string') {
        // Use Perplexity for real-time search with authoritative information
        const searchResults = await searchWithPerplexity(query);
        return res.json(searchResults);
      } else {
        // Fallback to basic search results
        const searchResults = {
          title: String(query),
          summary: "Basic information about your query. For more comprehensive results, the Perplexity API can be enabled.",
          results: [
            {
              title: "Medical Information about " + query,
              url: `https://medlineplus.gov/search?query=${encodeURIComponent(String(query))}`,
              displayUrl: "medlineplus.gov",
              snippet: "Find reliable information about " + query + " from the National Library of Medicine."
            },
            {
              title: "Mayo Clinic - " + query,
              url: `https://www.mayoclinic.org/search/search-results?q=${encodeURIComponent(String(query))}`,
              displayUrl: "mayoclinic.org",
              snippet: "Information about " + query + " from Mayo Clinic's experts."
            }
          ]
        };
        
        return res.json(searchResults);
      }
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
