import { useEffect, useState } from "react";
import i18n from "i18next";
import { LOCALES } from "@/types";
import { Globe } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Button from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Separator from "@/components/ui/separator";
import instagramLogo from "@/assets/instagram.svg";
import changeLanguage from "@/helpers/changeLanguage";
import { NavigationMenuItem } from "@radix-ui/react-navigation-menu";

const components: { title: string; href: string }[][] = [
  // [
  //   {
  //     title: "Become a chef",
  //     href: "/sign-in",
  //   },
  //   {
  //     title: "About Us",
  //     href: "/about",
  //   }
  // ],
  [
    // {
    //   title: "Privacy policy",
    //   href: "/privacy",
    // },
    {
      title: "support@bychef.am",
      href: "mailto:support@bychef.am",
    }
  ],
];

const socials = [
  {
    logo: instagramLogo,
    href: "https://www.instagram.com/bychef.am",
  },
];

const languageNames = {
  [LOCALES.HY]: "AM",
  [LOCALES.EN]: "EN",
  [LOCALES.RU]: "RU"
};

const Footer = () => {
  const { t } = useTranslation("translation", { keyPrefix: "footer" });

  const [selectedLocale, setSelectedLocale] = useState<LOCALES | null>(null);

  const handleSelectLocale = (e: Event) => {
    const name = (e.currentTarget as HTMLElement).getAttribute("data-locale");

    if (name) {
      changeLanguage(name as LOCALES);
      setSelectedLocale(name as LOCALES);
    }
  };

  useEffect(() => {
    setSelectedLocale(i18n.resolvedLanguage as LOCALES);
  }, []);

  return (
    <footer className="flex flex-none flex-col items-center mt-16 px-4">
      <div className="w-full px-16 flex flex-col-reverse md:flex-row justify-between items-center py-6">
        <NavigationMenu>
          <NavigationMenuList className="flex justify-between items-center text-zinc-700">
            {components.map(([component1, component2]) => (
              <div key={component1.href} className="flex flex-wrap justify-center">
                {component1 && (
                  <NavigationMenuItem key={component1.title}>
                    <NavigationMenuLink href={component1.href} className={navigationMenuTriggerStyle()}>
                      {component1.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
                {component2 && (
                  <NavigationMenuItem key={component2.title}>
                    <NavigationMenuLink href={component2.href} className={navigationMenuTriggerStyle()}>
                      {component2.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </div>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost2">
                  <Globe />
                  {t(`locales.${languageNames[selectedLocale ?? LOCALES.HY]}`)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  data-locale={LOCALES.HY}
                  className="py-1 cursor-pointer data-[selected=true]:bg-secondary"
                  data-selected={selectedLocale === LOCALES.HY}
                  onSelect={handleSelectLocale}
                >
                  <p>{t(`locales.${languageNames[LOCALES.HY]}`)}</p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="py-1 cursor-pointer data-[selected=true]:bg-secondary"
                  data-selected={selectedLocale === LOCALES.EN}
                  data-locale={LOCALES.EN}
                  onSelect={handleSelectLocale}
                >
                  <p>{t(`locales.${languageNames[LOCALES.EN]}`)}</p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="py-1 cursor-pointer data-[selected=true]:bg-secondary"
                  data-selected={selectedLocale === LOCALES.RU}
                  data-locale={LOCALES.RU}
                  onSelect={handleSelectLocale}
                >
                  <p>{t(`locales.${languageNames[LOCALES.RU]}`)}</p>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex gap-4 py-6">
          {socials.map((social) => (
            <Link key={social.logo} to={social.href} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost2" role="link" data-href={social.href}>
                <img src={social.logo} alt="social icon" />
              </Button>
            </Link>
          ))}
        </div>
      </div>
      <Separator />
      <span className="py-6 text-center">{t("copyright")}</span>
    </footer>
  );
};

export default Footer;