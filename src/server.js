import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import ElasticClient from "./config/elastic.js";

dotenv.config();

const app = express();
app.use(express.json());

// === GET EMBEDDING FROM AZURE OPENAI ===
const getEmbedding = async (text) => {
  try {
    const response = await axios.post(
      process.env.AZURE_OPENAI_ENDPOINT,
      {
        input: text,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": process.env.AZURE_OPENAI_API_KEY,
        },
      }
    );

    return response.data.data[0].embedding;
  } catch (err) {
    console.error("🚨 Embedding generation failed:", err.message);
    throw new Error("Failed to generate embedding");
  }
};

// === INDEX A MOVIE INTO ELASTICSEARCH ===
app.post("/index-movie", async (req, res) => {
  try {
    const movie = req.body;

    // Combine title + overview for better semantic context
    const combinedText = `${movie.title} ${movie.overview}`;
    const embedding = await getEmbedding(combinedText);

    // Index into Elasticsearch
    await ElasticClient.index({
      index: process.env.ELASTIC_INDEX_NAME,
      id: movie.id.toString(),
      body: {
        ...movie,
        embedding,
      },
    });

    res.json({ success: true, message: `✅ Movie "${movie.title}" indexed successfully` });
  } catch (err) {
    console.error("❌ Failed to index movie:", err.message);
    res.status(500).json({ error: "Failed to index movie" });
  }
});

// === SEMANTIC SEARCH ENDPOINT ===
app.post("/search", async (req, res) => {
  try {
    const userQuery = req.body.query;

    if (!userQuery || userQuery.trim() === "") {
      return res.status(400).json({ error: "Query is required" });
    }

    const embedding = await getEmbedding(userQuery);

    const result = await ElasticClient.search({
      index: process.env.ELASTIC_INDEX_NAME,
      body: {
        knn: {
          field: "embedding",
          query_vector: embedding,
          k: 10,
          num_candidates: 100,
        },
      },
    });

    res.json(result.hits.hits.map((hit) => hit._source));
  } catch (err) {
    console.error("❌ Search failed:", err.message);
    res.status(500).json({ error: "Search failed" });
  }
});

// === SEMANTIC SEARCH ENDPOINT ===
app.get("/search", async (req, res) => {
  try {
    const userQuery = req.query.query;

    if (!userQuery || userQuery.trim() === "") {
      return res.status(400).json({ error: "Query is required" });
    }

    const embedding = await getEmbedding(userQuery);

    const result = await ElasticClient.search({
      index: process.env.ELASTIC_INDEX_NAME,
      body: {
        _source: ["title", "overview", "vote_average", "release_date"], // ← Only these fields
        knn: {
          field: "embedding",
          query_vector: embedding,
          k: 10,
          num_candidates: 100,
        },
      },
    });

    res.json(result.hits.hits.map((hit) => hit._source));
  } catch (err) {
    console.error("❌ Search failed:", err.message);
    res.status(500).json({ error: "Search failed" });
  }
});

// === HEALTH CHECK ===
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// === START SERVER ===
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
