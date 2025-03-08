import { useQuery } from "@tanstack/react-query";
import { fetchCartItem } from "@/server-actions";
import { DATA_DEFAULT_CACHE_TIME, DATA_DEFAULT_STALE_TIME } from "@/configs/constants";
import useServerError from "@/hooks/useServerError";

const useCartItem = (itemId: string | number, deleteItemCb?: () => void) => {
  const { handleServerError } = useServerError();

  return useQuery({
    queryKey: ["cart-item", itemId],
    queryFn: () => fetchCartItem(itemId, deleteItemCb, handleServerError),
    staleTime: DATA_DEFAULT_STALE_TIME,
    gcTime: DATA_DEFAULT_CACHE_TIME,
    refetchOnWindowFocus: false,
  });
};

export default useCartItem;