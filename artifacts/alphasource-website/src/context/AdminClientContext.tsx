import { createContext, useContext, useState, ReactNode } from "react";

export interface AdminClient {
  id: string;
  name: string;
  letter: string;
  color: string;
}

export const ADMIN_CLIENTS: AdminClient[] = [
  { id: "all",        name: "All Clients",               letter: "∗", color: "#0A1547" },
  { id: "acme",       name: "Acme Dental Group",          letter: "A", color: "#A380F6" },
  { id: "ridge",      name: "Ridge Medical Partners",     letter: "R", color: "#02ABE0" },
  { id: "summit",     name: "Summit Health Network",      letter: "S", color: "#02D99D" },
  { id: "crestwood",  name: "Crestwood Orthopedics",      letter: "C", color: "#F0A500" },
  { id: "lakeside",   name: "Lakeside Dermatology",       letter: "L", color: "#FF6B6B" },
  { id: "pinnacle",   name: "Pinnacle Surgical Group",    letter: "P", color: "#5B6FBB" },
  { id: "harborcove", name: "Harbor Cove Family Health",  letter: "H", color: "#0285B0" },
];

interface AdminClientContextType {
  selectedClient: AdminClient;
  setSelectedClient: (c: AdminClient) => void;
}

const AdminClientContext = createContext<AdminClientContextType>({
  selectedClient: ADMIN_CLIENTS[0],
  setSelectedClient: () => {},
});

export function AdminClientProvider({ children }: { children: ReactNode }) {
  const [selectedClient, setSelectedClient] = useState<AdminClient>(ADMIN_CLIENTS[0]);
  return (
    <AdminClientContext.Provider value={{ selectedClient, setSelectedClient }}>
      {children}
    </AdminClientContext.Provider>
  );
}

export function useAdminClient() {
  return useContext(AdminClientContext);
}
