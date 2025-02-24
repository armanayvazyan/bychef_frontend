import { useMemo } from "react";
import { ICartItem } from "@/types";
import { useTranslation } from "react-i18next";
import useCartItem from "@/hooks/use-cart-item";
import Separator from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import CartItemCard from "@/components/sections/cart-item-card";
import { getDataStringByLocale } from "@/helpers/getDataByLocale";

interface IOrderItem {
  product: ICartItem;
  isLastItem?: boolean;
}

const OrderItem = ({ product, isLastItem = false }: IOrderItem) => {
  const { data } = useCartItem(product.id);
  const { t, i18n } = useTranslation("translation");

  const name = data ? getDataStringByLocale(data, "name", i18n.language) : null;

  const totalCartItemPrice = useMemo(() => {
    const additionsTotalPrice = product.additions
      ? Object.values(product.additions).reduce((acc, additionPrice) => acc + Number(additionPrice), 0)
      : 0;

    return (product.price + additionsTotalPrice) * product.quantity;
  }, [product.additions, product.price, product.quantity]);

  const details = useMemo(() => {
    const details = [];

    if (product.spiceLevel) {
      const spiceLevel = data?.adjustableSpiceLevelDtoList.find(spiceLevelInfo => product.spiceLevel === spiceLevelInfo.id)?.spiceLevel;
      details.unshift(t(`spice-levels.${spiceLevel}`));
    }

    if (product.additions) {
      const additions = Object.keys(product.additions).map(additionId => {
        const currentAddition = data?.dishAdditionDtoList.find(info => String(info.id) === additionId);
        const additionName = currentAddition ? getDataStringByLocale(currentAddition, "name", i18n.language) : "";

        return additionName;
      }).join(", ");

      details.push(additions);
    }

    return details.join(", ");
  }, [data?.adjustableSpiceLevelDtoList, data?.dishAdditionDtoList, i18n.language, product.additions, product.spiceLevel, t]);

  if (!data) {
    return (
      <>
        <Skeleton className="w-full min-w-[344px] h-[180px] rounded-xl" />
        {!isLastItem && <Separator className="my-4" />}
      </>
    );
  }

  return (
    <CartItemCard
      title={name}
      details={details}
      imageUrl={data.url}
      hasSeparator={!isLastItem}
      price={totalCartItemPrice}
      quantity={product.quantity}
    />
  );
};

export default OrderItem;