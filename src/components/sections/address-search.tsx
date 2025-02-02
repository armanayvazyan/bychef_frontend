import { useContext, useState } from "react";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Cross2Icon } from "@radix-ui/react-icons";
import { AddressSearchContext } from "@/context/address-search-context";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { useTranslation } from "react-i18next";

interface ISuggestion {
  address: string;
  location: string
}

const AddressSearch = () => {
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const { selectedAddress, onSelectAddress, onSetIsUserInteracting } = useContext(AddressSearchContext);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<ISuggestion[] | null>(null);

  const handleSearchAddress = async (search: string) => {
    try {
      const url = new URL("https://geocode-maps.yandex.ru/1.x");
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      url.searchParams.set("apikey", import.meta.env.VITE_YMAP_KEY);
      url.searchParams.set("geocode", search);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      url.searchParams.set("results", import.meta.env.VITE_YMAP_SEARCH_RESULTS_COUNT);
      url.searchParams.set("lang", `${i18n.language.split("-")[0]}_AM`);
      url.searchParams.set("format", "json");
      url.searchParams.set("ll", "44.491567,40.153759");
      url.searchParams.set("spn", "0.473785400390625,0.7407931148263032");

      const res = await fetch(url);
      const data = await res.json();

      const collection = data.response.GeoObjectCollection.featureMember.map(
        (item: {
          GeoObject: { name: string; Point: { pos: string; }; };
        }) => ({ address: item.GeoObject.name, location: item.GeoObject.Point.pos })
      );

      setOpen(true);
      setSuggestions(collection);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Oops!",
        description: error?.toString(),
      });
    }
  };

  return (
    <div className="relative w-full flex gap-2">
      <div className="relative flex-1">
        <Input
          placeholder="Մուտքագրեք հասցեն"
          value={(selectedAddress?.address && !value) ? selectedAddress.address : value}
          onChange={(e) => {
            setSuggestions([]);
            setValue(e.target.value);
            setOpen(false);
          }}
          className="w-full"
        />
        {(selectedAddress ?? value) && (
          <Button
            variant="ghost"
            size="lg"
            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
            onClick={() => {
              setValue("");
              setOpen(false);
              setSuggestions([]);
              onSelectAddress(null);
            }}
          >
            <Cross2Icon />
          </Button>
        )}
        {open && (
          <div className="absolute top-full z-50 w-full rounded-b-lg border bg-background shadow-md mt-1">
            <Command>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {suggestions?.map((suggestion) => (
                    <CommandItem
                      key={suggestion.address + suggestion.location}
                      className="px-4 py-3 cursor-pointer"
                      onSelect={() => {
                        setValue("");
                        setOpen(false);
                        setSuggestions([]);
                        onSetIsUserInteracting(false);
                        onSelectAddress({
                          address: suggestion.address,
                          location: [
                            Number(suggestion.location.split(" ")[0]),
                            Number(suggestion.location.split(" ")[1])
                          ]
                        });
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{suggestion.address}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>
      <Button
        type="submit"
        disabled={!value}
        onClick={() => handleSearchAddress(value)}
      >
        Փնտրել
      </Button>
    </div>
  );
};

export default AddressSearch;
