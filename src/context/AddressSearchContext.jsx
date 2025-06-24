import { createContext, useContext, useState } from "react";

const AddressSearchContext = createContext();

export const useAddressSearch = () => useContext(AddressSearchContext);

export const AddressSearchProvider = ({ children }) => {
  const [address, setAddress] = useState("");

  return (
    <AddressSearchContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressSearchContext.Provider>
  );
};
