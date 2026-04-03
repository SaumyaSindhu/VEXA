import { tavily } from '@tavily/core';

const tvly = tavily({ 
    apiKey: process.env.TAVILY_API_KEY 
});

export const searchInternet = async ({ query }) => {
    try {
        const result = await tvly.search(query, {
            maxResults: 5,
        })

        // the result is an array of search results, we can return it as a JSON string
        return JSON.stringify(result);
    } catch (err) {
        console.log("Internet search failed:", err);
        throw new Error("Failed to search the internet");
    }
}