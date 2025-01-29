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

const MEMORY_FUNCTION = {
    type: "function",
    name: "set_memory",
    description: "Saves important data about the user into memory.",
    parameters: {
        type: "object",
        properties: {
            key: {
                type: "string",
                description: "Memory key. Use lowercase and underscores only.",
            },
            value: {
                type: "string",
                description: "Value to be stored as a string.",
            },
        },
        required: ["key", "value"],
    },
}

const LOAD_MEMORY_FUNCTION = {
    type: "function",
    name: "get_memory",
    description: "Retrieves stored memory. If no key is provided, returns all stored information.",
    parameters: {
        type: "object",
        properties: {
            key: {
                type: "string",
                description: "The memory key to retrieve. If not provided, all memory will be returned.",
            },
        },
    },
}



export const INIT_SESSION = {
    type: "session.update",
    session: {
        instructions: INSTRUCTIONS,
        tools: [
            ...(import.meta.env.OPENWEATHER_API_KEY ? [WEATHER_FUNCTION] : []),
            TAVILY_SEARCH_FUNCTION,
            MEMORY_FUNCTION,
            LOAD_MEMORY_FUNCTION
        ],
        tool_choice: "auto",
        input_audio_transcription: {
            model: "whisper-1",
        }
    }
}