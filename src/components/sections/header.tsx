import { db } from "@/db";
import logo from "@/assets/logo.svg";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLiveQuery } from "dexie-react-hooks";
import Map from "@/components/sections/map-dialog";
import UserCart from "@/components/sections/user-cart";
import { NavigationMenu } from "@/components/ui/navigation-menu";

const Header = () => {
  const sessionLocation = useLiveQuery(() => db.location.toArray());

  return (
    <NavigationMenu className="w-full sticky top-0 bg-background flex-none flex-col md:flex max-w-full gap-5 border-b-2 border-zinc-100 px-4 md:px-16 py-4 md:py-6">
      <div className="w-full flex justify-between items-center gap-4">
        <Link to="/" className="shrink-0">
          <img src={logo} alt="logo" className="h-8 md:h-auto"/>
        </Link>
        {!!sessionLocation?.length && (
          <Map
            trigger={
              <div className="hidden gap-2 md:flex items-center">
                <MapPin className="shrink-0" />
                <p className="text-base font-bold text-primary underline">{sessionLocation[0].address}</p>
              </div>
            }
          />
        )}
        <UserCart/>
      </div>
      {!!sessionLocation?.length && (
        <Map
          trigger={
            <div className="flex gap-2 md:hidden items-center">
              <span className="flex-1">
                <MapPin />
              </span>
              <p className="text-base font-bold text-primary underline">{sessionLocation[0].address}</p>
            </div>
          }
        />
      )}
    </NavigationMenu>
  );
};

export default Header;