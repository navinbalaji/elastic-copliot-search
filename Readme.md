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

## 📷 Demo Screenshot (Optional)

![Semantic Search UI](screenshots/demo-ui.png)

---

## 📄 License

MIT License – see [`LICENSE`](LICENSE)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a PR if you'd like to improve this project.

---
