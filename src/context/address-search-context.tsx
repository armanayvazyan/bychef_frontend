import { createContext, PropsWithChildren, useCallback, useState } from "react";

export interface ISelectedAddress {
  address: string;
  location: number[];
}

interface IAddressSearchContextProvider {
  isUserInteracting: boolean;
  onSetIsUserInteracting: (isUserInteracting: boolean) => void;
  selectedAddress: ISelectedAddress | null;
  onSelectAddress: (addressInfo: ISelectedAddress | null) => void
}

export const AddressSearchContext = createContext<IAddressSearchContextProvider>({} as IAddressSearchContextProvider);

const AddressSearchContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedAddress, setSelectedAddress] = useState<ISelectedAddress | null>(null);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const handleSelectAddress = useCallback((addressInfo: ISelectedAddress | null) => {
    setSelectedAddress(addressInfo);
  }, []);

  const handleSetIsUserInteracting = useCallback((isUserInteracting: boolean) => {
    setIsUserInteracting(isUserInteracting);
  }, []);

  return (
    <AddressSearchContext.Provider
      value={{
        isUserInteracting,
        onSetIsUserInteracting: handleSetIsUserInteracting,
        selectedAddress,
        onSelectAddress: handleSelectAddress,
      }}
    >
      {children}
    </AddressSearchContext.Provider>
  );
};

export default AddressSearchContextProvider;