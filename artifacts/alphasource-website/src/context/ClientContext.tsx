import { createContext, useContext, useState, ReactNode } from "react";

export interface Client {
  id: string;
  name: string;
  letter: string;
  color: string;
}

export const CLIENTS: Client[] = [
  { id: "all",    name: "All Clients",            letter: "∗", color: "#0A1547" },
  { id: "acme",   name: "Acme Dental Group",       letter: "A", color: "#A380F6" },
  { id: "ridge",  name: "Ridge Medical Partners",  letter: "R", color: "#02ABE0" },
  { id: "summit", name: "Summit Health Network",   letter: "S", color: "#02D99D" },
];

interface ClientContextType {
  selectedClient: Client;
  setSelectedClient: (c: Client) => void;
}

const ClientContext = createContext<ClientContextType>({
  selectedClient: CLIENTS[1],
  setSelectedClient: () => {},
});

export function ClientProvider({ children }: { children: ReactNode }) {
  const [selectedClient, setSelectedClient] = useState<Client>(CLIENTS[1]);
  return (
    <ClientContext.Provider value={{ selectedClient, setSelectedClient }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClient() {
  return useContext(ClientContext);
}
