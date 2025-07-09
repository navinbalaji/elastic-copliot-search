import dotenv from 'dotenv';
import { Client } from '@elastic/elasticsearch';

dotenv.config();

// Initialize Elasticsearch client
const client = new Client({
  cloud: {
	id: process.env.ELASTIC_CLOUD_ID,
  },
  auth: {
	username: process.env.ELASTIC_USERNAME,
	password: process.env.ELASTIC_PASSWORD
  }
});

export default client;