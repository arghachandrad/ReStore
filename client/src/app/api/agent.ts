import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";

// For Creating a Delay so that we can see loading
// const sleep = () => new Promise((resolve) => setTimeout(resolve, 1000));

axios.defaults.baseURL = "http://localhost:5000/api/";
axios.defaults.withCredentials = true;

// Helper fundtion for getting actual data from axios response
const responseBody = (response: AxiosResponse) => response.data;

// AXIOS INTERCEPTOR - intercepting the response coming back from API
// use(onFulfilled, onRejected) => onFulfilled we are returning the actual res, But onRejected(i.e. 400,500 range err) we are intercepting the res
axios.interceptors.response.use(
  async (res) => {
    // await sleep(); // creating a delay
    return res;
  },
  (error: AxiosError) => {
    // must return error response also
    // What interceptor is doing is intercepting the error and sending the actual Axios error response, now handle it in client side
    const { data, status } = error.response!; // ! => overriding typescript type safety
    switch (status) {
      // 404 we will handle inside component
      case 400:
        if (data.errors) {
          // means if validation errors
          const modelStateErrors: string[] = [];
          for (const key in data.errors) {
            modelStateErrors.push(data.errors[key]);
          }
          throw modelStateErrors.flat();
        }
        toast.error(data.title);
        break;
      case 401:
        toast.error(data.title);
        break;
      case 500:
        // also need to send the server error to ServerError Component
        history.push({
          pathname: "/server-error",
          state: { error: data },
        });
        // toast.error(data.title);
        break;
      default:
        break;
    }
    return Promise.reject(error.response);
  }
);

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

const Basket = {
  get: () => requests.get("basket"),
  addItem: (productId: number, quantity: number = 1) =>
    requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
  removeItem: (productId: number, quantity: number = 1) =>
    requests.delete(`basket?productId=${productId}&quantity=${quantity}`),
};

const agent = {
  Catalog,
  TestErrors,
  Basket,
};

export default agent;
