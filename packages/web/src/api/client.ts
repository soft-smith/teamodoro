import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_URL;

export const createClient = () => {
  console.log('BASE_URL', BASE_URL);
  const client = axios.create({
    baseURL: BASE_URL,
  });

  return client;
};

export const client = createClient();

export default client;
