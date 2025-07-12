# 🎬 Semantic Movie Search with Azure OpenAI & Elasticsearch

> A full-stack application that enables **semantic search** over movies using **Azure OpenAI embeddings** and **Elasticsearch vector search**.

This project allows users to perform **natural language queries** like:
- "Movies about space exploration"
- "Thrillers similar to Inception"
- "Feel-good romantic comedies"

The system converts the query into a **vector embedding**, then performs a **kNN search** in **Elasticsearch (Elastic Cloud)** to return semantically relevant results.

---

## 🧠 Features

- 🔍 **Semantic Search**: Powered by Azure OpenAI embeddings
- 📦 **Vector Indexing**: Using Elasticsearch’s `dense_vector` field
- 🚀 **Fast kNN Search**: Based on AI-generated embeddings
- 🎥 **Movie Dataset**: Easily extendable to products, articles, or any text-based data
- 🌐 **REST API**: For indexing and searching
- 🖼️ **React Frontend**: (Optional) For demo UI

---

## 📁 Folder Structure

```
/copliot-search
│
├── .env                     # Environment variables
├── .gitignore               # Git ignore rules
├── README.md                # Project documentation
├── package.json             # Project metadata and scripts
├── pnpm-lock.yaml           # pnpm lockfile
│
├── data/                    # Data files (e.g., movies.json)
│
├── node_modules/            # Installed dependencies
│
├── public/                  # Static assets (for frontend)
│
├── src/                     # Source code
│   ├── config/              # Configuration folder
│   │   └── elastic.js       # Elasticsearch client configuration
│   ├── seed.js              # Script to seed movie data
│   ├── server.js            # Express server entry point
│
```

| Layer        | Technology                        |
|--------------|----------------------------------|
| Backend      | Node.js + Express                |
| Embeddings   | Azure OpenAI (`text-embedding-ada-002`) |
| Vector DB    | Elasticsearch (Elastic Cloud)     |
| Frontend     | React (optional)                 |
| Deployment   | Docker-ready                     |

---

## 📦 Requirements

Before running the project, make sure you have:

### 1. Azure OpenAI
- Access to [Azure OpenAI Studio](https://oai.azure.com)
- Deployed model: `text-embedding-ada-002`
- Save:
  - `AZURE_OPENAI_API_KEY`
  - `AZURE_OPENAI_ENDPOINT`

### 2. Elastic Cloud
- Cluster created at [https://cloud.elastic.co](https://cloud.elastic.co)
- Save:
  - `ELASTIC_CLOUD_ID`
  - `ELASTIC_USERNAME`
  - `ELASTIC_PASSWORD`

---

## 🚀 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/semantic-movie-search.git
cd semantic-movie-search
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file:

```env
# Azure OpenAI
AZURE_OPENAI_API_KEY=your_azure_openai_api_key
AZURE_OPENAI_ENDPOINT=https://<your-resource>.openai.azure.com/openai/deployments/embedding-model/embeddings?api-version=2023-05-15

# Elastic Cloud
ELASTIC_CLOUD_ID=your-cloud-id-from-elastic-cloud
ELASTIC_USERNAME=elastic
ELASTIC_PASSWORD=your-elastic-password
```

### 4. Create Elasticsearch index

Use Kibana Dev Tools:

```json
PUT /movies_with_embeddings
{
  "mappings": {
    "properties": {
      "id": { "type": "keyword" },
      "title": { "type": "text" },
      "overview": { "type": "text" },
      "release_date": { "type": "date" },
      "vote_average": { "type": "float" },
      "vote_count": { "type": "integer" },
      "embedding": {
        "type": "dense_vector",
        "dims": 1536
      }
    }
  }
}
```

### 5. Seed movie data

Make sure `data/movies.json` exists, then run:

```bash
node seed.js
```

### 6. Start the server

```bash
node server.js
```

---

## 🧪 Available Endpoints

| Method | Endpoint         | Description                         |
|--------|------------------|-------------------------------------|
| POST   | `/index-movie`   | Index one movie with embedding      |
| POST   | `/search`        | Perform semantic search             |
| GET    | `/health`        | Check if service is running         |

### Example Request Body for `/search`

```json
{
  "query": "space exploration"
}
```

Returns:

```json
[
  {
    "title": "Interstellar",
    "overview": "A team of explorers travel through a wormhole...",
    "vote_average": 8.6
  },
  ...
]
```

---

## 📊 Suggested Use Cases

- Movie recommendation engine
- E-commerce product search
- Article/document similarity search
- Chatbot-integrated search UI

---

## Prompt

```
Understand natural language movie queries and return a meaningful explanation of the movie that aligns with the user's request.

Use the provided query to infer the user's intent, preferences, or desired movie characteristics. Match their description to a movie and provide a concise explanation that includes relevant information such as the plot, genre, theme, notable cast, or why it matches the query.

# Steps

1. Parse the query and determine the key themes, preferences, or traits being described (e.g., genre, story elements, mood, actors, release era).
2. Identify a movie that best matches the parsed details.
3. Provide a concise explanation of the selected movie, including:
   - Title
   - A brief description of the plot or theme.
   - Noteworthy features that align with the request (e.g., genre, actors, mood, historical significance).
   - A clear connection to the user's query.

# Output Format

The output should be a **concise paragraph** structured as follows:
1. The movie title in **bold**.
2. A short description of the plot or core theme.
3. Reference the key elements that match the query, explaining *why* it suits the request.

# Examples

### Input 1:
*"A feel-good movie with a strong female lead overcoming challenges"*

### Output 1:
**The Pursuit of Happyness**  
This inspiring movie follows the life of Chris Gardner, a struggling salesman who faces numerous adversities while raising his young son. With its focus on resilience and the triumph of the human spirit, it is a perfect feel-good movie that showcases determination and hope.

---

### Input 2:
*"A sci-fi movie about space exploration and the meaning of life."*

### Output 2:
**Interstellar**  
This thought-provoking sci-fi epic explores humanity's survival as a team of astronauts travels beyond our galaxy to find a habitable planet. Directed by Christopher Nolan, the movie delves deeply into themes of space exploration, love, and sacrifice, making it an ideal choice for fans of existential sci-fi rooted in space discovery.

# Notes

- If multiple movies could be good matches, select the **most iconic or suitable choice**.
- Avoid spoilers in explanations unless they’re critical to understanding why the movie matches the query. 
- Remain concise but informative, sticking to describing just one movie per query.
```

## 📷 Demo Screenshot (Optional)

![Semantic Search UI](screenshots/demo-ui.png)

---

## 📄 License

MIT License – see [`LICENSE`](LICENSE)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR if you'd like to improve this project.

---
