import React from "react";
import { useSales } from "../contexts/SalesContext";

const TotalSales: React.FC = () => {
  const { sales, totalSales } = useSales();

  if (!sales) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Total vendido: R$ {totalSales.toFixed(2)}</h2>
      <ul>
        {sales.map((sale) => (
          <li key={sale.id}>
            Venda: R$ {sale.value.toFixed(2)} -{" "}
            {sale.createdAt.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TotalSales;
