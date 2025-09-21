import type { AxiosRequestConfig } from "axios";
import QueryClient from "./_query-client";

const baseURL = `${import.meta.env.VITE_BACKEND_URL}/api`

class APIClient<T> extends QueryClient<T> {
  constructor(endpoint: string, config: AxiosRequestConfig) {
    super(baseURL, endpoint, config);
  }
};

export default APIClient;
