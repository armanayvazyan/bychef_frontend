import { Dispatch, MouseEvent, SetStateAction, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Addition from "@/components/sections/addition";
import { IDishAddition, ISelectedProductInfo } from "@/types";

interface IAdditionList {
  additions: IDishAddition[];
  selectedAdditions?: Record<string, number>;
  onSetProduct: Dispatch<SetStateAction<ISelectedProductInfo>>;
}

const AdditionList = ({ additions, selectedAdditions, onSetProduct }: IAdditionList) => {
  const { t } = useTranslation();

  const handleSelectAddition = useCallback((e: MouseEvent<HTMLDivElement>) => {
    const id = e.currentTarget.getAttribute("data-id");

    if (!id) return;

    const price = e.currentTarget.getAttribute("data-price");
    const hasAddition = selectedAdditions
      ? Object.keys(selectedAdditions).find(additionId => additionId === id)
      : false;

    if (hasAddition) {
      const filteredAdditions = { ...selectedAdditions };
      delete filteredAdditions[id];

      onSetProduct(prevState => ({
        ...prevState,
        additions: filteredAdditions
      }));
    } else {
      onSetProduct(prevState => ({
        ...prevState,
        additions: {
          ...(prevState.additions ?? {}),
          [id]: Number(price),
        }
      }));
    }
  }, [onSetProduct, selectedAdditions]);

  return (
    <div className="flex flex-col gap-3 mb-13">
      <p className="text-primary text-base font-bold">{t("additions")}</p>
      {additions.map(additionInfo => (
        <Addition
          key={additionInfo.id}
          additionInfo={additionInfo}
          onSelectAddition={handleSelectAddition}
          isActive={selectedAdditions ? !!selectedAdditions[additionInfo.id] : false}
        />
      ))}
    </div>
  );
};

export default AdditionList;