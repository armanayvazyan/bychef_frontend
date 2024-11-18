import logo from "@/assets/logo.svg";
import { Link } from "react-router-dom";
import UserCart from "@/components/sections/user-cart";
import { NavigationMenu } from "@/components/ui/navigation-menu";

const Header = () => {
  return (
    <NavigationMenu className="w-full sticky top-0 bg-background flex-none flex justify-between max-w-full border-b-2 border-zinc-100 px-4 md:px-16 py-4 md:py-6">
      <Link to="/">
        <img src={logo} alt="logo" className="h-8 md:h-auto" />
      </Link>
      <UserCart />
    </NavigationMenu>
  );
};

export default Header;