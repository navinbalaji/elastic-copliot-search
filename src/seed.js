
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import axios from "axios";
import ElasticClient from "./config/elastic.js";

dotenv.config();

// Load movie data from JSON file
const rawData = fs.readFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), "../data/movies.json"));
const movies = JSON.parse(rawData);


// Function to get embedding from Azure OpenAI
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
    console.error("Error generating embedding:", err.message);
    return null;
  }
};

// Main function to index all movies
const seedMovies = async () => {
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];

    const combinedText = `${movie.title} ${movie.overview}`;
    const embedding = await getEmbedding(combinedText);

    if (!embedding) {
      console.log(`Skipping movie "${movie.title}" due to embedding error`);
      continue;
    }

    try {
      await ElasticClient.index({
        index: process.env.ELASTIC_INDEX_NAME,
        id: movie.id.toString(),
        body: {
          ...movie,
          embedding,
        },
      });

      console.log(`Indexed movie: ${movie.title}`);
    } catch (err) {
      console.error(`Failed to index movie "${movie.title}":`, err.meta.body.error.type);
    }

    // Optional delay between requests to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log(" All movies indexed!");
};

// Run the seeding
seedMovies();
