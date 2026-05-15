import express from 'express';
import cors from 'cors';
import { loadEnv } from './env';
import { AskStructured, AskStructuredAgent } from './ask-model';

// Load the environment variables
loadEnv();

const app = express();

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN,
    methods: ['POST', 'GET', 'OPTIONS', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
}));

app.use(express.json());

app.post('/ask', async (req, res) => {
    try {
        const { query } = req.body || {};
        if (!query || !String(query).trim()) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const result = await AskStructured(query);
        // const result = await AskStructuredAgent(query);
        return res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ error: 'Failed to answer user query' });
    }
});

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});