export type ChatResponse = {
    summary: string;
    confidence: number;
}

export type IMessage = {
  sender: string;
  text: string;
  confidence?: number;
}