import { useContext, useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { ISuggestion, LOCALES } from "@/types";
import useDebounce from "@/hooks/use-debounce";
import { useUnmount } from "@/hooks/use-unmount";
import { useQuery } from "@tanstack/react-query";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchSearchAddressSuggestions } from "@/server-actions";
import { AddressSearchContext } from "@/context/address-search-context";
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command";

interface IAddressSearchProps {
  onApplyAddress: (callback?: () => void) => void
}

const AddressSearch = ({ onApplyAddress }: IAddressSearchProps) => {
  const { t, i18n } = useTranslation("translation");
  const { selectedAddress, onSelectAddress, onSetIsUserInteracting } = useContext(AddressSearchContext);

  const [value, setValue] = useState("");
  const search = useDebounce(value, 700);

  // TODO: handle error case
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["search-address", search],
    queryFn: () => fetchSearchAddressSuggestions(value, i18n.language.split("-")[0] as LOCALES),
    refetchOnWindowFocus: false,
  });

  const handleResetInputState = () => {
    setValue("");
    onSelectAddress(null);
  };

  const handleApplyAddress = () => {
    onApplyAddress(handleResetInputState);
  };

  const handleSelectAddress = (suggestion: ISuggestion) => {
    setValue("");
    onSetIsUserInteracting(false);
    onSelectAddress({
      address: suggestion.address,
      location: [
        Number(suggestion.location.split(" ")[1]),
        Number(suggestion.location.split(" ")[0])
      ]
    });
  };

  useUnmount(() => { handleResetInputState(); });

  return (
    <div className="relative w-full flex gap-2">
      <div className="relative flex-1">
        <Input
          className="w-full"
          placeholder={t("home-page.address.input-address")}
          value={(selectedAddress?.address && !value) ? selectedAddress.address : value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
        />
        {(selectedAddress ?? value) && (
          <Button
            size="lg"
            variant="ghost"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={handleResetInputState}
          >
            <Cross2Icon />
          </Button>
        )}
        {value && (
          <div className="absolute top-full z-50 w-full rounded-lg border bg-background shadow-md mt-1">
            <Command>
              <CommandList>
                {isLoading && <Skeleton className="w-full h-[44px] rounded-md" />}
                {!isLoading && suggestions && !suggestions.length && <CommandEmpty>{t("home-page.address.address-not-found")}</CommandEmpty>}
                {suggestions?.map((suggestion: ISuggestion, index) => (
                  <CommandItem
                    onSelect={() => { handleSelectAddress(suggestion); }}
                    className="px-4 py-3 cursor-pointer"
                    key={suggestion.address + suggestion.location}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{suggestion.address}</span>
                      {/* suggestions interfere with each other when their values are same, this solution prevents it */}
                      <span className="hidden">{String(index)}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </div>
        )}
      </div>
      <Button
        disabled={!selectedAddress}
        onClick={handleApplyAddress}
      >
        {t("home-page.address.confirm")}
      </Button>
    </div>
  );
};

export default AddressSearch;
