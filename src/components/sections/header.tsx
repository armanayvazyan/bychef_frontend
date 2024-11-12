import { useEffect, useState } from "react";
import i18n from "i18next";
import { LOCALES } from "@/types.ts";
import logo from "@/assets/logo.svg";
import { Link } from "react-router-dom";
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
  [LOCALES.HY]: "AM",
  [LOCALES.EN]: "EN",
  [LOCALES.RU]: "RU"
};

const Header = () => {
  const [selectedLocale, setSelectedLocale] = useState<LOCALES | null>(null);

  useEffect(() => {
    setSelectedLocale(i18n.resolvedLanguage as LOCALES);
  }, []);

  return (
    <NavigationMenu className="w-full flex justify-between max-w-full px-4 md:px-16 py-6">
      <Link to="/">
        <img src={logo} alt="logo" />
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="outline">{languageNames[selectedLocale ?? LOCALES.HY]}</Button>
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