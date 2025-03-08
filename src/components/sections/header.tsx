import { useContext, useMemo } from "react";
import { db } from "@/db";
import logo from "@/assets/logo.svg";
import { MapPin } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import UserCart from "@/components/sections/user-cart";
import MapDialog from "@/components/sections/map-dialog";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AddressSearchContext } from "@/context/address-search-context";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedAddress } = useContext(AddressSearchContext);
  const sessionLocation = useLiveQuery(() => db.location.toArray());

  const showAddress = useMemo(() =>
    !!sessionLocation?.length && !location.pathname.includes("/checkout"),
  [location.pathname, sessionLocation?.length]
  );

  const handleApplyAddress = async (callback?: () => void) => {
    if (selectedAddress) {
      await db.location.put({
        id: "1",
        address: selectedAddress.address,
        coordinates: { lat: selectedAddress.location[0], lng: selectedAddress.location[1] },
      }, "1");

      if (callback) callback();

      if (location.pathname === "/") {
        navigate("/explore");
      }
    }
  };

  return (
    <NavigationMenu className="w-full sticky top-0 bg-background flex-none flex-col md:flex max-w-full gap-5 border-b-2 border-zinc-100 px-4 md:px-16 py-2">
      <div className="w-full flex justify-between items-center gap-4">
        <Link to={sessionLocation?.[0] ? "/explore" : "/"} className="shrink-0">
          <img src={logo} alt="logo" className="h-8 md:h-10"/>
        </Link>
        {showAddress && (
          <span className="hidden md:inline">
            <MapDialog
              onApplyAddress={handleApplyAddress}
              trigger={
                <div className="hidden gap-2 md:flex items-center">
                  <MapPin className="shrink-0" />
                  <p className="text-base font-bold text-primary underline">{sessionLocation?.[0].address}</p>
                </div>
              }
            />
          </span>
        )}
        <UserCart/>
      </div>
      {showAddress && (
        <span className="md:hidden">
          <MapDialog
            onApplyAddress={handleApplyAddress}
            trigger={
              <div className="flex gap-2 items-center">
                <span className="flex-1">
                  <MapPin />
                </span>
                <p className="text-base font-bold text-primary underline">{sessionLocation?.[0].address}</p>
              </div>
            }
          />
        </span>
      )}
    </NavigationMenu>
  );
};

export default Header;