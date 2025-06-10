import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

export interface Sale {
  id: string;
  value: number;
  createdAt: Date;
}

interface SalesContextType {
  sales: Sale[];
  totalSales: number;
  addSale: (value: number) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  editSale: (id: string, newValue: number) => Promise<void>;
}

export const SalesContext = createContext<SalesContextType | undefined>(
  undefined
);

export const useSales = () => {
  const context = useContext(SalesContext);
  if (!context) throw new Error("useSales deve estar dentro do SalesProvider");
  return context;
};

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    // Ouve as vendas em tempo real no Firestore
    const unsubscribe = onSnapshot(collection(db, "sales"), (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const sale = doc.data();
        return {
          id: doc.id,
          value: sale.value,
          createdAt: sale.createdAt?.toDate?.() || new Date(),
        } as Sale;
      });
      setSales(data);
    });

    return () => unsubscribe();
  }, []);

  const addSale = async (value: number) => {
    await addDoc(collection(db, "sales"), {
      value,
      createdAt: Timestamp.now(),
    });
  };

  const deleteSale = async (id: string) => {
    await deleteDoc(doc(db, "sales", id));
  };

  const editSale = async (id: string, newValue: number) => {
    await updateDoc(doc(db, "sales", id), {
      value: newValue,
      updatedAt: Timestamp.now(),
    });
  };

  const totalSales = sales.reduce((acc, sale) => acc + sale.value, 0);

  return (
    <SalesContext.Provider
      value={{ sales, addSale, deleteSale, editSale, totalSales }}
    >
      {children}
    </SalesContext.Provider>
  );
};
