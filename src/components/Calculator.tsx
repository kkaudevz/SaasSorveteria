import React, { useState } from "react";
import styled from "styled-components";
import { useSales } from "../contexts/SalesContext";
import { Parser } from "expr-eval";

const CalculatorContainer = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  border-radius: 12px;
  background-color: #f8f9fa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Display = styled.div`
  background-color: black;
  color: #0f0;
  font-size: 2.5rem;
  padding: 16px;
  border-radius: 8px;
  text-align: right;
  font-family: "Courier New", Courier, monospace;
  min-height: 60px;
  margin-bottom: 20px;
  user-select: none;
`;

const ButtonsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const Button = styled.button<{ variant?: string }>`
  padding: 15px;
  font-size: 1.25rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  background-color: ${({ variant }) =>
    variant === "operator"
      ? "#f9a825"
      : variant === "equal"
      ? "#43a047"
      : "#e0e0e0"};
  color: ${({ variant }) => (variant === "equal" ? "white" : "black")};

  &:hover {
    filter: brightness(0.9);
  }
`;

const Calculator: React.FC = () => {
  const { addSale } = useSales();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<number | null>(null);

  function handleButtonClick(value: string) {
    if (value === "C") {
      setInput("");
      setResult(null);
      return;
    }

    if (value === "=") {
      try {
        const parser = new Parser();
        const res = parser.evaluate(input);
        setResult(res);
      } catch {
        alert("Expressão inválida");
      }
      return;
    }

    if (result !== null) {
      if (/[0-9.]/.test(value)) {
        setInput(value);
      } else {
        setInput(result + value);
      }
      setResult(null);
      return;
    }

    setInput((prev) => prev + value);
  }

  async function saveSale() {
    let finalValue = result;

    // Se ainda não foi avaliado, tenta resolver
    if (finalValue === null) {
      try {
        const parser = new Parser();
        finalValue = parser.evaluate(input);
        setResult(finalValue); // opcional: mostrar no visor
      } catch {
        alert("Expressão inválida. Não foi possível salvar.");
        return;
      }
    }

    if (
      typeof finalValue === "number" &&
      !isNaN(finalValue) &&
      finalValue > 0
    ) {
      await addSale(finalValue);
      alert(`Venda de R$ ${finalValue.toFixed(2)} salva!`);
      setInput("");
      setResult(null);
    } else {
      alert("Valor inválido para salvar a venda.");
    }
  }

  const buttons = [
    "7",
    "8",
    "9",
    "/",
    "4",
    "5",
    "6",
    "*",
    "1",
    "2",
    "3",
    "-",
    "0",
    ".",
    "C",
    "+",
    "=",
  ];

  return (
    <CalculatorContainer>
      <Display>{result !== null ? result : input || "0"}</Display>
      <ButtonsGrid>
        {buttons.map((btn) => (
          <Button
            key={btn}
            variant={
              ["+", "-", "*", "/", "="].includes(btn)
                ? btn === "="
                  ? "equal"
                  : "operator"
                : undefined
            }
            onClick={() => handleButtonClick(btn)}
            style={btn === "=" ? { gridColumn: "span 2" } : {}}
          >
            {btn}
          </Button>
        ))}

        <Button
          variant="equal"
          style={{ gridColumn: "span 2" }}
          onClick={saveSale}
        >
          Salvar Venda
        </Button>
      </ButtonsGrid>
    </CalculatorContainer>
  );
};

export default Calculator;
