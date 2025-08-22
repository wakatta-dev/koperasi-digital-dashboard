/** @format */

import useSWR from "swr";
import { api } from "../services/api";

export function useUsers() {
  const { data, error, mutate } = useSWR("/api/users", async (url: string) => {
    return api.get(url);
  });

  return {
    users: data,
    isLoading: !data && !error,
    isError: error,
    mutate,
  };
}
