import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
  tool,
  createAgent,
} from "langchain";
import { ToolMessage } from "@langchain/core/messages";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";
import { retrieveRelevantDocs } from "./rag.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: process.env.GEMINI_API_KEY,
  streaming: true, // for SSE(server sent event)
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "Use this tool to get the latest information from the internet.",
  schema: z.object({
    query: z.string().describe("The search query to look up on the internet."),
  }),
});

const getRagTool = (userId) => tool(
  async ({ query }) => {
    return await retrieveRelevantDocs(query, userId);
  },
  {
    name: "searchPDF",
    description: "Search user's uploaded PDFs for relevant information.",
    schema: z.object({
      query: z.string(),
    }),
  },
);

export async function generateResponse(messages, userId) {
  const agent = createAgent({
    model: geminiModel,
    tools: [searchInternetTool, getRagTool(userId)],
  });

  const response = await agent.invoke({
    messages: [
      new SystemMessage(`
          You are a helpful and precise assistant.

          You have access to:
          - searchInternet → for latest real-time info
          - searchPDF → for user-uploaded documents

          Rules:
          - Use searchPDF when question is about documents or uploaded content
          - Use searchInternet for latest info
          - If neither needed, answer normally
      `),
      ...messages.map((msg) => {
        if (msg.role == "user") {
          return new HumanMessage(msg.content);
        } else if (msg.role == "ai") {
          return new AIMessage(msg.content);
        }
      }),
    ],
  });

  return response.messages[response.messages.length - 1].text;
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`
      You are a helpful assistant that generates concise and descriptive titles for chat conversations.
            
      User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.`),

    new HumanMessage(`
      Generate a title for a chat conversation based on the following first message:
      "${message}"`),
  ]);

  return response.text;
}

export async function* generateStreamingResponse(messages, userId) {
  const modelWithTools = geminiModel.bindTools([searchInternetTool, getRagTool(userId)]);

  const history = [
    new SystemMessage(`
        You are a helpful and precise assistant.

        You have access to:
        - searchInternet → for latest real-time info
        - searchPDF → for user-uploaded documents

        Rules:
        - Use searchPDF when question is about documents or uploaded content
        - Use searchInternet for latest info
        - If neither needed, answer normally
    `),
    ...messages.map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else {
        return new AIMessage(msg.content);
      }
    }),
  ];

  while (true) {
    const stream = await modelWithTools.stream(history);
    let chunks = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
      if (typeof chunk.content === "string" && chunk.content.length > 0) {
        yield chunk; // Yield text token to stream
      } else if (Array.isArray(chunk.content)) {
        // Some providers yield arrays, we only want the text strings
        let textPart = chunk.content.find(
          (part) => part.type === "text" || "text" in part,
        );
        if (textPart && textPart.text) {
          yield { ...chunk, content: textPart.text };
        }
      }
    }

    // Combine chunks to check for tool calls
    let fullMessage = chunks[0];
    for (let i = 1; i < chunks.length; i++) {
      fullMessage = fullMessage.concat(chunks[i]);
    }

    if (fullMessage?.tool_calls?.length > 0) {
      history.push(fullMessage);

      for (const toolCall of fullMessage.tool_calls) {
        if (toolCall.name === "searchInternet") {

          let result;

          try {
            result = await searchInternet(toolCall.args);
          } catch (err) {
            result = "Failed to search the internet";
          }

          history.push(
            new ToolMessage({
              tool_call_id: toolCall.id,
              content: result,
            }),
          );
        }
        if (toolCall.name === "searchPDF") {
      
          let result;

          try {
            result = await retrieveRelevantDocs(toolCall.args.query, userId);
          } catch (err) {
            result = "Failed to retrieve PDF data";
          }

          history.push(new ToolMessage({
            tool_call_id: toolCall.id,
            content: result
          }));
        }
      }
      // Loop continues with the provided tool results
    } else {
      break;
    }
  }
}
