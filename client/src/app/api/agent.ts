import axios, { AxiosResponse } from "axios";

axios.defaults.baseURL = "http://localhost:5000/api/";

// Helper fundtion for getting actual data from axios response
const responseBody = (response: AxiosResponse) => response.data;

// Reusable Object for diff type of requests
const requests = {
  get: async (url: string) => responseBody(await axios.get(url)),
  post: async (url: string, body: {}) => responseBody(await axios.post(url, body)),
  put: async (url: string, body: {}) => responseBody(await axios.put(url, body)),
  delete: async (url: string) => responseBody(await axios.delete(url)),
};

// store requests for catalog
const Catalog = {
  list: () => requests.get("products"),
  details: (id: number) => requests.get(`products/${id}`),
};

// For Test Error Response
const TestErrors = {
  get404Error: () => requests.get("buggy/not-found"),
  get400Error: () => requests.get("buggy/bad-request"),
  get401Error: () => requests.get("buggy/unauthorized"),
  getValidationError: () => requests.get("buggy/validation-error"),
  get500Error: () => requests.get("buggy/server-error"),
};

const agent = {
  Catalog,
  TestErrors,
};

export default agent;
