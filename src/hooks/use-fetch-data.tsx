import { useCallback } from "react";
import isEmpty from "lodash/isEmpty";
import { SB_KEY } from "@/configs/constants";
import constructFinalUrl from "@/helpers/constructFinalUrl";

interface IFetchData {
  url?: string;
  initialPath?: string,
  pathExtension?: string,
  method?: "GET" | "POST" | "DELETE",
  headerParams?: Record<string, string | number>,
  bodyParams?: Record<string, string | number>,
  options?: Record<string, string | number>,
  hasAT?: boolean,
  injectErrorMessage?: boolean,
}

const processErrorResponse = (status?: number) => {
  switch (status) {
    case 400:
      return { error: "Bad Request!" };
    case 498:
    case 401:
      return { error: "Please authorize!" };
    case 403:
      return { error: "Forbidden!" };
    case 404:
      return { error: "Not found!" };
    case 429:
      return { error: "Too many requests! Please try again later." };
    case 500:
      return { error: "Server Error!" };
    default:
      return { error: "Something went wrong!" };
  }
};

export const fetchApi = async ({
  url = "",
  initialPath = "",
  pathExtension = "",
  method = "GET",
  headerParams = {},
  bodyParams = {},
  options = {},
  hasAT = true,
  injectErrorMessage = false,
}: IFetchData = {}) => {
  try {
    const endPoint = initialPath + pathExtension;

    if (!endPoint) return;

    const reqUrl = url ? url + pathExtension : constructFinalUrl(endPoint);

    const body = !isEmpty(bodyParams) ? JSON.stringify(bodyParams) : null;
    const headers = {
      "content-type": "application/json",
      ...(hasAT && SB_KEY && { authorization: `Bearer ${SB_KEY}` }),
      ...headerParams,
      ...options,
    };

    const response = await fetch(
      reqUrl,
      {
        credentials: "include",
        method,
        headers,
        body,
      }
    );

    if (!response.ok) {
      if (injectErrorMessage && response) {
        const res = await response.json();
        return { error: res.error, status: response.status, isInjected: true };
      }

      return { ...processErrorResponse(response.status), status: response.status, isInjected: false };
    }

    if (response.status === 201) {
      return {};
    }

    const res = await response.json();
    return { result: res };
  } catch (e) {
    console.error(e);
    return { ...processErrorResponse(), isInjected: false };
  }
};

const useFetchData = (initialPath = "") => {
  const fetchData = useCallback((props: IFetchData) =>
    fetchApi({
      ...props,
      initialPath
    }),
  [initialPath]);

  return {
    fetchData,
  };
};

export default useFetchData;