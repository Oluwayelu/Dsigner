import { AxiosError, AxiosResponse } from "axios";
import {
  UseMutationResult,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import useAxios from "./useAxios";

export interface ResponseData {
  message: string;
}

type QueryMethod = "get" | "post" | "put" | "delete" | "patch";

export const useReactQuery = (
  key: string,
  path: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  method: QueryMethod = "get"
) => {
  const instance = useAxios();

  return useQuery<AxiosResponse, AxiosError>({
    queryKey: [key],
    queryFn: () => instance[`${method}`](path),
  });
};

export const useReactMutation = (
  path: string,
  method: QueryMethod
): UseMutationResult<
  AxiosResponse,
  AxiosError<ResponseData>,
  unknown,
  () => void
> => {
  const instance = useAxios();
  //? use this to get logged in status
  // const [isLoggedIn] = useContext<boolean>(false);

  return useMutation({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (data: any) =>
      instance[`${method}`](path, data, {
        headers: {
          Authorization: "",
        },
      }),
  });
};
