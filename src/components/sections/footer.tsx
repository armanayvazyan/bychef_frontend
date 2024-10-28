import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import Button from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import Separator from "@/components/ui/separator";
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
      title: "support@bychef",
      href: "mailto:support@bychef",
    }
  ],
];

const socials = [
  {
    logo: "src/assets/instagram.svg",
    href: "https://www.instagram.com/",
  },
];

const Footer = () => {
  const { t } = useTranslation("translation", { keyPrefix: "footer" });

  return (
    <footer className="flex flex-col items-center mt-16 px-4">
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