// src/contexts/PontoContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  Timestamp,
  query,
  orderBy,
} from "firebase/firestore";

interface Ponto {
  id: string;
  funcionarioId: string;
  nome: string;
  data: string;
  entrada: string;
  saida: string;
  createdAt: Date;
}

interface PontoContextType {
  pontos: Ponto[];
  adicionarPonto: (ponto: Omit<Ponto, "id" | "createdAt">) => Promise<void>;
}

const PontoContext = createContext<PontoContextType | undefined>(undefined);

export const usePonto = () => {
  const context = useContext(PontoContext);
  if (!context) throw new Error("usePonto deve estar dentro do PontoProvider");
  return context;
};

export const PontoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pontos, setPontos] = useState<Ponto[]>([]);

  useEffect(() => {
    const q = query(collection(db, "pontos"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const ponto = doc.data();
        return {
          id: doc.id,
          funcionarioId: ponto.funcionarioId,
          nome: ponto.nome,
          data: ponto.data,
          entrada: ponto.entrada,
          saida: ponto.saida,
          createdAt: ponto.createdAt?.toDate?.() || new Date(),
        } as Ponto;
      });
      setPontos(data);
    });
    return () => unsubscribe();
  }, []);

  const adicionarPonto = async (ponto: Omit<Ponto, "id" | "createdAt">) => {
    await addDoc(collection(db, "pontos"), {
      ...ponto,
      createdAt: Timestamp.now(),
    });
  };

  

  return (
    <PontoContext.Provider value={{ pontos, adicionarPonto }}>
      {children}
    </PontoContext.Provider>
  );
};

