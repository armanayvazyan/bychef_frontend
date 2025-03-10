import { useMemo } from "react";
import { IOrderDishDto } from "@/types";
import { useTranslation } from "react-i18next";
import CartItemCard from "@/components/sections/cart-item-card";
import { getDataStringByLocale } from "@/helpers/getDataByLocale";

interface IOrderItem {
  product: IOrderDishDto;
  isLastItem?: boolean;
}

const OrderItem = ({ product, isLastItem = false }: IOrderItem) => {
  const { t, i18n } = useTranslation("translation");

  const name = product ? getDataStringByLocale(product, "name", i18n.language) : null;

  const totalCartItemPrice = useMemo(() => {
    const additionsTotalPrice = product.orderDishAdditionDtoList
      ? Object.values(product.orderDishAdditionDtoList).reduce((acc, addition) => acc + Number(addition.price), 0)
      : 0;

    return (product.price + additionsTotalPrice) * product.quantity;
  }, [product.orderDishAdditionDtoList, product.price, product.quantity]);

  const details = useMemo(() => {
    const details = [];

    if (product.selectedSpiceLevel) {
      const spiceLevel = product.dishDto.adjustableSpiceLevelDtoList.find(spiceLevelInfo => product.selectedSpiceLevel === spiceLevelInfo.id)?.spiceLevel;
      details.unshift(t(`spice-levels.${spiceLevel}`));
    }

    if (product.orderDishAdditionDtoList.length) {
      const additions = product.orderDishAdditionDtoList.map(addition => {
        const additionName = getDataStringByLocale(addition.dishAdditionDto, "name", i18n.language);

        return additionName;
      }).join(", ");

      details.push(additions);
    }

    return details.join(", ");
  }, [i18n.language, product.dishDto.adjustableSpiceLevelDtoList, product.orderDishAdditionDtoList, product.selectedSpiceLevel, t]);

  return (
    <CartItemCard
      title={name}
      details={details}
      imageUrl={product.url}
      hasSeparator={!isLastItem}
      price={totalCartItemPrice}
      quantity={product.quantity}
    />
  );
};

export default OrderItem;