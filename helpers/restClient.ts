import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

export const request = (method: any, endpoint: string, payload?: any): Promise<AxiosResponse> => {
  const restClient: AxiosInstance = axios.create();

  return new Promise((resolve, reject) => {
    restClient({
      method: method.toUpperCase(),
      // url: process.env.NEXT_PUBLIC_API_URL_LOCAL + endpoint,
      url: process.env.NEXT_PUBLIC_API_URL + endpoint,
      data: payload ? payload : undefined
    })
      .then((response: AxiosResponse) => resolve(response?.data))
      .catch((error: AxiosError) => {
        reject(error);
      });
  });
};
