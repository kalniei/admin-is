import { AxiosError } from 'axios';

export default function getErrorMessage(error: AxiosError, defaultError: string): string {
  return error?.response?.data?.message || defaultError;
}
