import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import index from "./pinecone.service.js";

const embeddings = new MistralAIEmbeddings({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-embed"
})

export async function loadAndSplitPDF(filePath) {
  const loader = new PDFLoader(filePath);
  const data = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const docs = await splitter.splitDocuments(data);

  return docs;
}

export async function storeDocuments(docs, userId) {
  const vectors = [];

  for (let i = 0; i < docs.length; i++) {
    const content = docs[i].pageContent.trim();
    if (!content) continue; // skip empty chunks

    const embedding = await embeddings.embedQuery(content);

    vectors.push({
      id: `doc-${Date.now()}-${i}`,
      values: embedding,
      metadata: {
        text: content,
        userId: userId
      }
    });
  }

  if (vectors.length === 0) {
    throw new Error("No readable text was found in this PDF. Please ensure the PDF is not an image scan.");
  }

  await index.upsert(vectors);
}

export async function retrieveRelevantDocs(query, userId) {
  const queryEmbedding = await embeddings.embedQuery(query);

  const results = await index.query({
    vector: queryEmbedding,
    topK: 4,
    includeMetadata: true,
    filter: {
      userId: { $eq: userId }
    }
  });

  return results.matches
    .map(match => match.metadata.text)
    .join("\n\n");
}