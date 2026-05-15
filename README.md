# Structured Output

A full-stack application that leverages AI models to generate structured summaries with confidence scores. The application consists of a Node.js/Express backend powered by LangChain and Ollama, and an Angular frontend with a modern chat interface.

## Overview

This project demonstrates how to use LangChain with Ollama to generate structured output from AI models. Users can input queries through a web interface, and the AI returns a concise summary along with a confidence score indicating how confident the model is about its response.

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **AI/ML**: LangChain, Ollama
- **Validation**: Zod (TypeScript-first schema validation)
- **Environment**: dotenv for configuration
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Framework**: Angular 21
- **Styling**: Tailwind CSS 4
- **State Management**: Angular Signals
- **HTTP Client**: Angular HttpClient with RxJS
- **Testing**: Vitest, JSDOM

### Development Tools
- **Package Manager**: npm (monorepo with workspaces)
- **TypeScript Version**: 5.9.x
- **Build Tool**: Angular CLI (for client), tsx (for backend)

## Features

- **AI-Powered Summarization**: Generates concise summaries of user queries
- **Confidence Scoring**: Returns a confidence score (0-1) for each response
- **Structured Output**: Leverages LangChain's structured output capabilities with Zod schemas
- **Real-time Chat Interface**: Modern, responsive chat UI with loading states
- **Monorepo Structure**: Organized separation of concerns with apps and packages

## Project Structure

```
structured-output/
├── apps/
│   ├── backend/                    # Express API server
│   │   ├── src/
│   │   │   ├── index.ts           # Express app setup & routes
│   │   │   ├── ask-model.ts       # LangChain model integration
│   │   │   ├── schema.ts          # Zod schema for response validation
│   │   │   └── env.ts             # Environment variable loader
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── client/                     # Angular SPA
│       ├── src/
│       │   ├── app/
│       │   │   ├── app.ts         # Root component
│       │   │   ├── app.html       # Template
│       │   │   ├── app.service.ts # HTTP service
│       │   │   ├── app.models.ts  # TypeScript types
│       │   │   └── app.css        # Styles
│       │   ├── main.ts
│       │   └── index.html
│       ├── angular.json
│       ├── package.json
│       └── tsconfig.json
├── package.json                    # Root monorepo config
└── README.md
```

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 11.x or higher
- **Ollama**: Running with the configured model (default: `gemma4:e4b`)
  - [Download Ollama](https://ollama.ai)
  - Pull the model: `ollama pull gemma4:e4b`

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd structured-output
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

   This will install dependencies for both the backend and client via npm workspaces.

## Environment Setup

Create a `.env` file in the `apps/backend/` directory:

```env
# Ollama Configuration
MODEL_NAME=gemma4:e4b

# CORS Configuration
ALLOWED_ORIGIN=http://localhost:4200

# Server Port (optional, defaults to 3000)
PORT=3000
```

### Available Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MODEL_NAME` | `gemma4:e4b` | Name of the Ollama model to use |
| `ALLOWED_ORIGIN` | `http://localhost:4200` | CORS origin for frontend requests |
| `PORT` | `3000` | Backend server port |

## Running the Application

### Development Mode (Concurrent)

Run both backend and frontend simultaneously:

```bash
npm run dev
```

This command:
- Starts the Angular dev server on `http://localhost:4200`
- Starts the Express backend on `http://localhost:3000`

### Individual Development Servers

**Backend only:**
```bash
npm run dev:backend
```

**Frontend only:**
```bash
npm run dev:client
```

### Production Build

**Client:**
```bash
npm run build --workspace=structured-output-client
```

**Run:**
Access the application at `http://localhost:4200`

## API Documentation

### POST `/ask`

Sends a query to the AI model and returns a structured response with a summary and confidence score.

**Request:**
```json
{
  "query": "What is machine learning?"
}
```

**Response (200 OK):**
```json
{
  "summary": "Machine learning is a field of AI where systems learn and improve from experience without explicit programming, using algorithms to find patterns in data.",
  "confidence": 0.92
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Query is required"
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "error": "Failed to answer user query"
}
```

### Response Schema

The response follows the `AskResultSchema`:
- **summary** (string): 1-1000 characters, concise explanation suitable for beginners
- **confidence** (number): Score between 0 and 1 indicating model confidence in the response

## Architecture

### Data Flow

1. **User Input**: User types a query in the Angular chat interface
2. **HTTP Request**: Angular service sends POST request to `/ask` endpoint
3. **Model Processing**: 
   - Express backend receives the query
   - LangChain wraps the Ollama model with structured output validation
   - Query is processed with system and user prompts
   - Response is validated against Zod schema
4. **Response**: Structured response is returned to frontend
5. **Display**: Angular component displays summary and confidence score in chat bubble

### Key Components

#### Backend
- **AskStructured()**: Main function using LangChain's `withStructuredOutput()` for guaranteed schema compliance
- **AskStructuredAgent()**: Alternative agent-based approach (currently commented out)
- **Express Middleware**: CORS, JSON parsing, error handling

#### Frontend
- **App Component**: Main container managing chat state and message flow
- **AppService**: Handles HTTP communication with backend
- **Chat Interface**: Real-time message display with loading states
- **Angular Signals**: Reactive state management for messages and loading state

## Development

### File Descriptions

**Backend**
- `index.ts`: Express setup, CORS configuration, `/ask` endpoint
- `ask-model.ts`: LangChain model initialization and structured output functions
- `schema.ts`: Zod schema defining the expected response format
- `env.ts`: Environment variable loading with singleton pattern

**Frontend**
- `app.ts`: Root component with message management and scroll behavior
- `app.html`: Chat template using Angular control flow (`@for`, `@if`)
- `app.service.ts`: HTTP service for backend communication
- `app.models.ts`: TypeScript interfaces for type safety
- `app.config.ts`: Angular configuration
- `app.routes.ts`: Route definitions

### Key Dependencies

**Backend**
- `@langchain/ollama`: LangChain integration for Ollama
- `langchain`: Core LangChain library
- `express`: Web framework
- `zod`: Schema validation

**Frontend**
- `@angular/core`, `@angular/common`, `@angular/forms`: Angular framework
- `@angular/platform-browser`: DOM rendering
- `rxjs`: Reactive programming
- `tailwindcss`: Utility-first CSS framework

## Notes

- The backend temperature is set to 0.2 for more deterministic, focused responses
- System prompt instructs the model to be concise and return only JSON
- User prompt specifically requests summaries for beginners
- CORS is configured to accept requests only from the allowed origin
- The application uses Angular's new control flow syntax (`@for`, `@if`)

## Troubleshooting

### Ollama Connection Issues
- Ensure Ollama is running: `ollama serve`
- Verify the model is installed: `ollama pull gemma4:e4b`
- Check MODEL_NAME environment variable matches installed model

### CORS Errors
- Verify ALLOWED_ORIGIN in `.env` matches your frontend URL
- Ensure backend is running on the correct port

### Dependencies Installation
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Clear npm cache: `npm cache clean --force`

## License

ISC

## Author

Pranav Pande
