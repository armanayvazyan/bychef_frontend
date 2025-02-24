import { useQuery } from "@tanstack/react-query";
import { fetchCartItem } from "@/server-actions";
import { DATA_DEFAULT_STALE_TIME } from "@/configs/constants";

const useCartItem = (itemId: string | number, deleteItemCb?: () => void) => {
  return useQuery({
    queryKey: ["cart-item", itemId],
    queryFn: () => fetchCartItem(itemId, deleteItemCb),
    refetchOnWindowFocus: false,
    staleTime: DATA_DEFAULT_STALE_TIME
  });
};

export default useCartItem;