import { useCallback } from "react";
import isEmpty from "lodash/isEmpty";
import { SB_KEY } from "@/configs/constants";
import { IFetchApiReturnType } from "@/types";
import constructFinalUrl from "@/helpers/constructFinalUrl";

interface IFetchData {
  url?: string;
  initialPath?: string,
  pathExtension?: string | number,
  method?: "GET" | "POST" | "DELETE" | "PATCH",
  headerParams?: Record<string, string | number>,
  bodyParams?: Record<string, any>,
  options?: Record<string, string | number>,
  hasAT?: boolean,
  injectErrorMessage?: boolean,
  isResponseOtherType?: boolean,
}

const processErrorResponse = (status?: number) => {
  switch (status) {
    case 400:
      return { error: "bad-request-default" };
    case 498:
    case 401:
      return { error: "authorize-default" };
    case 403:
      return { error: "forbidden-default" };
    case 404:
      return { error: "not-found-default" };
    case 429:
      return { error: "too-many-requests-default" };
    case 500:
      return { error: "server-error-default" };
    default:
      return { error: "something-went-wrong-default" };
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
  isResponseOtherType = false,
}: IFetchData = {}): Promise<IFetchApiReturnType> => {
  try {
    const endPoint = initialPath + String(pathExtension);

    const reqUrl = url ? url + String(pathExtension) : constructFinalUrl(endPoint);

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
        return { error: res.message, status: response.status, isInjected: true };
      }

      return { ...processErrorResponse(response.status), status: response.status, isInjected: false };
    }

    if (response.status === 201) {
      return { isInjected: false };
    }

    const res = isResponseOtherType ? response : await response.json();
    return { result: res, isInjected: true };
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