import { useTranslation } from "react-i18next";

interface IDietaryOptionProps {
  value: string;
}

const DietaryOption = ({ value }: IDietaryOptionProps) => {
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-nowrap gap-2 px-4 py-2 bg-secondary border-transparent border-[1px] rounded-md items-center"
    >
      <div className="w-[20px]">
        <img
          alt="dietary option icon"
          src={`https://static.bychef.am/icons/${value}.svg`}
        />
      </div>
      <p className="text-nowrap text-sm text-center font-normal text-zinc-600">
        {t(`dietary-options.${value}`)}
      </p>
    </div>
  );
};

export default DietaryOption;