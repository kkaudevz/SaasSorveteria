import React, { useState } from "react";
import styled from "styled-components";
import { useSales, Sale } from "../contexts/SalesContext";

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 15px;
  background-color: #2563eb; /* azul */
  color: white;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 12px 15px;
  border-bottom: 1px solid #ddd;
`;

const Button = styled.button<{ variant?: "edit" | "delete" }>`
  padding: 6px 12px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  color: white;
  background-color: ${(p) =>
    p.variant === "delete"
      ? "#ef4444"
      : p.variant === "edit"
      ? "#3b82f6"
      : "#999"};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(p) =>
      p.variant === "delete"
        ? "#dc2626"
        : p.variant === "edit"
        ? "#2563eb"
        : "#666"};
  }
`;

const Input = styled.input`
  padding: 6px 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 80px;
`;

const SalesList: React.FC = () => {
  const { sales, deleteSale, editSale } = useSales();

  // Estado local para edição inline
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const startEditing = (sale: Sale) => {
    setEditingId(sale.id);
    setEditValue(sale.value.toString());
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEditing = async () => {
    if (editingId && !isNaN(Number(editValue)) && Number(editValue) >= 0) {
      await editSale(editingId, Number(editValue));
      cancelEditing();
    } else {
      alert("Digite um valor válido para salvar.");
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <>
      <h2>Vendas Registradas</h2>
      {sales.length === 0 && <p>Nenhuma venda registrada ainda.</p>}

      {sales.length > 0 && (
        <Table>
          <thead>
            <tr>
              <Th>#</Th>
              <Th>Valor (R$)</Th>
              <Th>Data</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {[...sales]
              .sort(
                (a, b) =>
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
              )
              .map((sale, index) => (
                <tr key={sale.id}>
                  <Td>{index + 1}</Td>

                  <Td>
                    {editingId === sale.id ? (
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                    ) : typeof sale.value === "number" ? (
                      sale.value.toFixed(2)
                    ) : (
                      "0.00"
                    )}
                  </Td>

                  <Td>{formatDate(sale.createdAt)}</Td>

                  <Td>
                    {editingId === sale.id ? (
                      <>
                        <Button onClick={saveEditing} variant="edit">
                          Salvar
                        </Button>
                        <Button onClick={cancelEditing} variant="delete">
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => startEditing(sale)}
                          variant="edit"
                        >
                          Editar
                        </Button>
                        <Button
                          variant="delete"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Tem certeza que deseja excluir esta venda?"
                              )
                            ) {
                              deleteSale(sale.id);
                            }
                          }}
                        >
                          Excluir
                        </Button>
                      </>
                    )}
                  </Td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default SalesList;
