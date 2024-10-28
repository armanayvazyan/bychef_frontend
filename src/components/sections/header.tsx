import { useState } from "react";
import i18n from "i18next";
import { LOCALES } from "@/types.ts";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import Button from "@/components/ui/button.tsx";
import changeLanguage from "@/helpers/changeLanguage.ts";
import { NavigationMenu } from "@/components/ui/navigation-menu";

const languageNames = {
  [LOCALES.HY]: "ARM",
  [LOCALES.EN]: "EN",
  [LOCALES.RU]: "RU"
};

const Header = () => {
  const [selectedLocale, setSelectedLocale] = useState((i18n.language as LOCALES) || LOCALES.HY);

  return (
    <NavigationMenu className="w-full flex justify-between max-w-full px-4 md:px-16 py-6">
      <img src="src/assets/logo.svg" alt="logo"/>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline">{languageNames[selectedLocale]}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="py-1 cursor-pointer data-[selected=true]:bg-secondary"
            data-selected={selectedLocale === LOCALES.HY}
            onSelect={() => { changeLanguage(LOCALES.HY); setSelectedLocale(LOCALES.HY); }}
          >
            <p>{languageNames[LOCALES.HY]}</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-1 cursor-pointer data-[selected=true]:bg-secondary"
            data-selected={selectedLocale === LOCALES.EN}
            onSelect={() => {
              changeLanguage(LOCALES.EN);
              setSelectedLocale(LOCALES.EN);
            }}
          >
            <p>{languageNames[LOCALES.EN]}</p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="py-1 cursor-pointer data-[selected=true]:bg-secondary"
            data-selected={selectedLocale === LOCALES.RU}
            onSelect={() => {
              changeLanguage(LOCALES.RU);
              setSelectedLocale(LOCALES.RU);
            }}
          >
            <p>{languageNames[LOCALES.RU]}</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </NavigationMenu>
  );
};

export default Header;