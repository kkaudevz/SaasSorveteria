// src/components/ListaPontos.tsx
import React from "react";
import { usePonto } from "../contexts/PontoContext";

const ListaPontos: React.FC = () => {
  const { pontos } = usePonto();

  return (
    <div>
      <h2>Registros de Ponto</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Data</th>
            <th>Entrada</th>
            <th>Saída</th>
          </tr>
        </thead>
        <tbody>
          {pontos.map((ponto) => (
            <tr key={ponto.id}>
              <td>{ponto.nome}</td>
              <td>{ponto.data}</td>
              <td>{ponto.entrada}</td>
              <td>{ponto.saida}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaPontos;
