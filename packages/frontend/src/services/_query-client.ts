import axios, { type AxiosRequestConfig } from "axios";

const createAxiosInstance = (baseURL: string) => {
  return axios.create({
    baseURL: baseURL,
  });
};

class QueryClient<T> {
  baseURL: string;
  endpoint: string;
  config: AxiosRequestConfig;

  constructor(baseURL: string, endpoint: string, config: AxiosRequestConfig) {
    this.baseURL = baseURL;
    this.endpoint = endpoint;
    this.config = config;
  }

  get = () => {
    return createAxiosInstance(this.baseURL)
      .get<T>(this.endpoint, this.config)
      .then((res) => res.data);
  };

  post = (data?: any) => {
    return createAxiosInstance(this.baseURL)
      .post<T>(this.endpoint, data, this.config)
      .then((res) => res.data);
  };
}

export default QueryClient;
