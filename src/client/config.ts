const INSTRUCTIONS = `System settings:
Tool use: enabled.

Instructions:
- You are an artificial intelligence agent responsible for helping test realtime voice capabilities
- Please make sure to respond with a helpful voice via audio
- Be kind, helpful, and curteous
- It is okay to ask the user questions
- Use tools and functions you have available liberally, it is part of the training apparatus
- Be open to exploration and conversation
- Remember: this is just for fun and testing!

Personality:
- Be upbeat and genuine
- Try speaking quickly as if excited
`;

const TAVILY_SEARCH_FUNCTION = {
    type: "function",
    name: "tavily_search",
    description: "Get information on recent events from the web.",
    parameters: {
        type: "object",
        properties: {
            query: { type: "string", description: "The search query to use. For example: 'Latest news on Nvidia stock performance'" },
        },
        required: ["query"]
    }
}

const WEATHER_FUNCTION = {
    type: "function",
    name: "get_weather",
    description: "Get the weather for a given location",
    parameters: {
        type: "object",
        properties: {
            location: { "type": "string" }
        },
        required: ["location"],
    },
}

export const INIT_SESSION = {
    type: "session.update",
    session: {
        instructions: INSTRUCTIONS,
        tools: [
            TAVILY_SEARCH_FUNCTION,
            ...(import.meta.env.OPENWEATHER_API_KEY ? [WEATHER_FUNCTION] : [])
        ],
        tool_choice: "auto",
        input_audio_transcription: {
            model: "whisper-1",
        }
    }
}