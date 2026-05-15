import { ChatOllama } from "@langchain/ollama";
import { AskResultSchema, type AskResult } from "./schema";
import { createAgent, HumanMessage, SystemMessage } from "langchain";

export async function AskStructured(query: string): Promise<AskResult> {
    const model = new ChatOllama({
        model: process.env.MODEL_NAME || 'gemma4:e4b',
        temperature: 0.2
    });

    const system = 'You are a concise assistant. Return only the requested JSON.';
    const user = `
        Summarize for a beginner:
        "${query}"
        Return Fields: summary (short paragraph), confidence (0..1)
    `;

    const structuredOutputModel = model.withStructuredOutput(AskResultSchema);

    return structuredOutputModel.invoke([
        new SystemMessage(system),
        new HumanMessage(user)
    ]);
}

export async function AskStructuredAgent(query: string): Promise<AskResult> {
    const model = new ChatOllama({
        model: process.env.MODEL_NAME || 'gemma4:e4b',
        temperature: 0.2
    });

    const agent = createAgent({
        model,
        responseFormat: AskResultSchema
    });

    return await agent.invoke({
        messages: [new HumanMessage(query)]
    }).then(result => result.structuredResponse);
}