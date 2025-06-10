import { db } from "./firebase";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  Timestamp,
  where,
} from "firebase/firestore";

export interface SaleFirebase {
  id?: string;
  value: number;
  date: Timestamp;
}

// Coleção “sales” no Firestore
const salesCollection = collection(db, "sales");

// Função para salvar venda
export async function saveSale(value: number): Promise<void> {
  await addDoc(salesCollection, {
    value,
    date: Timestamp.fromDate(new Date()),
  });
}

// Função para escutar vendas do dia em tempo real
export function subscribeSalesToday(callback: (sales: SaleFirebase[]) => void) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = Timestamp.fromDate(today);

  const q = query(
    salesCollection,
    where("date", ">=", todayTimestamp),
    orderBy("date", "desc")
  );

  // onSnapshot escuta em tempo real as alterações
  return onSnapshot(q, (querySnapshot) => {
    const sales: SaleFirebase[] = [];
    querySnapshot.forEach((doc) => {
      sales.push({
        id: doc.id,
        value: doc.data().value,
        date: doc.data().date,
      });
    });
    callback(sales);
  });
}
