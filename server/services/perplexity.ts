/**
 * Perplexity API service
 * 
 * This service provides functions to interact with Perplexity's AI models for search
 * and question answering capabilities.
 */

import { 
  PerplexityResponse, 
  PerplexitySearchResult, 
  PerplexityModel
} from '../../shared/perplexity-types';

/**
 * Perform an online search using Perplexity's AI to get structured, informative results
 * 
 * @param query The search query
 * @returns Structured search results
 */
export async function searchWithPerplexity(query: string): Promise<PerplexitySearchResult> {
  try {
    // Check if Perplexity API key is available
    if (!process.env.PERPLEXITY_API_KEY) {
      throw new Error("Perplexity API key is not configured");
    }

    // Create the system prompt to guide the search
    const systemPrompt = `You are a medical search assistant focused on providing accurate medical information.
For the following query, provide a structured search result with:
1. A brief summary of the topic (2-3 sentences)
2. A list of the most relevant sources with their URL and a brief snippet
3. If available, key facts about the medical topic
Please be concise, accurate, and provide only evidence-based information.
Format your response as detailed JSON with: { "summary": "...", "results": [{"title": "...", "url": "...", "displayUrl": "...", "snippet": "..."}] }`;

    // Create the user prompt with the search query
    const userPrompt = `I need authoritative medical information about: ${query}`;

    // Make the API request to Perplexity
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: PerplexityModel.SMALL, // Default to the most efficient model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2, // Keep temperature low for factual responses
        max_tokens: 1024,
        search_domain_filter: [], // No domain restriction
        search_recency_filter: "month", // Relatively recent information
        return_related_questions: false, // No need for related questions
        frequency_penalty: 1 // Avoid repetitive text
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Perplexity API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json() as PerplexityResponse;
    
    // Parse the AI response to extract structured data
    // The model should return JSON, but as a fallback we'll handle text too
    let parsedResult: PerplexitySearchResult;
    
    try {
      // Try to parse the content as JSON
      const content = data.choices[0].message.content.trim();
      parsedResult = JSON.parse(content);
    } catch (error) {
      // If parsing fails, format the text response into our structure
      const content = data.choices[0].message.content;
      parsedResult = {
        title: query,
        summary: content.substring(0, 200) + "...", // First 200 chars as summary
        results: [
          {
            title: "Medical Information",
            url: `https://medlineplus.gov/search?query=${encodeURIComponent(query)}`,
            displayUrl: "medlineplus.gov",
            snippet: content.substring(0, 150) + "..."
          }
        ]
      };
    }

    // Add citations if available
    if (data.citations && data.citations.length > 0) {
      parsedResult.citations = data.citations;
    }

    return parsedResult;
  } catch (error) {
    console.error("Error using Perplexity API:", error);
    
    // Return a fallback result
    return {
      title: query,
      summary: "Unable to retrieve search results at this time.",
      results: [
        {
          title: "Medical Information",
          url: `https://medlineplus.gov/search?query=${encodeURIComponent(query)}`,
          displayUrl: "medlineplus.gov",
          snippet: "Please try your search again later or check MedlinePlus for authoritative health information."
        }
      ]
    };
  }
}

/**
 * Check if Perplexity API is available for use
 * 
 * @returns Boolean indicating if the API is available
 */
export function isPerplexityAvailable(): boolean {
  return !!process.env.PERPLEXITY_API_KEY;
}