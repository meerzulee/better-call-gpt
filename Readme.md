# Better Call GPT

## Project Description
Better Call GPT is a real-time OpenAI-powered chat application that supports **live conversations**, **function calling**, and **real-time audio transcription**. It integrates **Tavily Search** and **weather data retrieval**, allowing seamless AI-enhanced interactions with external APIs.
This project is based on [OpenAI-Realtime-Console](https://github.com/openai/openai-realtime-console).


## Features
- **Real-time OpenAI Chat (GPT-4o-mini-realtime-preview)**
- **Function Calling** for external API integration
- **Tavily Search Integration** for live web search queries
- **Live Audio Transcription** using `whisper-1`
- **Framer Motion Animations** for a smooth UI experience

---

## 🛠️ Setup & Installation

### **1. Clone the Repository**
```sh
 git clone https://github.com/meerzulee/better-call-gpt.git
 cd better-call-gpt
```

### **2. Install Dependencies**
```sh
yarn install
```

### **3. Configure Environment Variables**
Copy the `.env.example` file to `.env` and add your API keys:
```env
OPENAI_API_KEY=your_openai_api_key
TAVILY_API_KEY=your_tavily_api_key
OPENWEATHER_API_KEY=your_openweather_api_key //(optional)
```

If `OPENWEATHER_API_KEY` is not set, by default it will call `tavily_search` function.

### **4. Start the Development Server**
```sh
yarn dev
```

The app will be running on `http://localhost:3000`

## How to use

- Click to Start Call button to start a new session.
- Ask about news, weather, or anything else it will use `tavily_search` to get the information.
- If you ask to remember something, it will store the information in the memory.
- To load the memory, you can say "retrieve my memory".
- To see the event logs, you can click the "Event Logs" button.

---
## 🔌 API Endpoints

### **1. Session API (`/api/session`)**
- **GET** `/api/session`
- **Description:** Generates an ephemeral OpenAI API key for authentication.
- **Response:**
```json
{
  "client_secret": {
    "value": "ephemeral_key_here"
  }
}
```

### **2. Weather API (`/api/weather`)**
- **GET** `/api/weather?location={location}`
- **Description:** Fetches real-time weather data for a given location.


### **3. Tavily Search API (`/api/search`)**
- **POST** `/api/search`
- **Description:** Retrieves recent web search results.
- **Request Body:**
```json
{
  "query": "Latest AI news"
}
```
- **Response:**
```json
[
  {
    "title": "OpenAI Releases New Model",
    "url": "https://news.example.com/openai",
    "snippet": "OpenAI has announced a new real-time AI model..."
  }
]
```

## References
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Framer Motion](https://www.framer.com/motion/)
- [React](https://react.dev/)
- [React-dom](https://react.dev/)
- [OpenAI-Realtime-Console](https://github.com/openai/openai-realtime-console)

## 🤝 Contributing
Feel free to submit issues, feature requests, or pull requests to improve **Better Call GPT**!

---

## 📜 License
This project is licensed under the MIT License.