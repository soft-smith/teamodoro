import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL as string;

export const createClient = () => {
  const client = axios.create({ baseURL: BASE_URL });
  return client;
};

export const client = createClient();

export default client;
