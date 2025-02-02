import { createContext, PropsWithChildren, useCallback, useState } from "react";

interface IAddressSearchContextProvider {
  selectedAddress: string;
  onSelectAddress: (address: string) => void
}

export const AddressSearchContext = createContext<IAddressSearchContextProvider>({} as IAddressSearchContextProvider);

const AddressSearchContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleSelectAddress = useCallback((address: string) => {
    setSelectedAddress(address);
  }, []);

  return (
    <AddressSearchContext.Provider
      value={{
        selectedAddress,
        onSelectAddress: handleSelectAddress,
      }}
    >
      {children}
    </AddressSearchContext.Provider>
  );
};

export default AddressSearchContextProvider;