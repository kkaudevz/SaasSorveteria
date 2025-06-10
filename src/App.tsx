import React, { useState } from "react";
import styled from "styled-components";
import SalesList from "./components/SaleList";
import Calculator from "./components/Calculator";
import RegistroPonto from "./components/RegistroPonto";
import ListaPontos from "./components/ListaPontos";
import { PontoProvider } from "./contexts/PontoContext";

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f7fa;
  color: #222;
`;

const Sidebar = styled.div<{ open: boolean }>`
  width: 250px;
  background-color: #1f2937;
  color: white;
  transition: transform 0.3s ease;
  transform: translateX(${(p) => (p.open ? "0" : "-100%")});
  position: fixed;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    transform: translateX(0);
    position: relative;
  }
`;

const SidebarHeader = styled.h2`
  margin-bottom: 2rem;
  font-weight: 700;
  font-size: 1.5rem;
  border-bottom: 1px solid #374151;
  padding-bottom: 0.5rem;
`;

const SidebarItem = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.1rem;
  padding: 12px 0;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-radius: 4px;

  &:hover {
    background-color: #374151;
  }
`;

const Content = styled.main<{ sidebarOpen: boolean }>`
  margin-left: ${(p) => (p.sidebarOpen ? "250px" : "0")};
  flex: 1;
  padding: 2rem;
  transition: margin-left 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
`;

const InnerContent = styled.div`
  max-width: 900px;
  width: 100%;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgb(0 0 0 / 0.1);
`;

const ToggleButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 20;
  background-color: #1f2937;
  border: none;
  color: white;
  font-size: 1.2rem;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgb(0 0 0 / 0.2);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #374151;
  }

  @media (min-width: 768px) {
    display: none;
  }
`;

// Página de ponto agrupando form e listagem, dentro do provider
const PontoPage = () => (
  <PontoProvider>
    <h2 style={{ marginBottom: "1rem" }}></h2>
    <RegistroPonto />
    <div style={{ marginTop: "2rem" }}>
      
    </div>
  </PontoProvider>
);

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState("calculator");

  const toggleSidebar = () => setSidebarOpen((open) => !open);

  const handleNavigate = (newPage: string) => {
    setPage(newPage);
    setSidebarOpen(false); // Fecha menu no mobile
  };

  return (
    <LayoutContainer>
      <ToggleButton onClick={toggleSidebar}>
        {sidebarOpen ? "✕" : "☰"}
      </ToggleButton>

      <Sidebar open={sidebarOpen}>
        <SidebarHeader>Menu</SidebarHeader>
        {["calculator", "sales", "ponto"].map((item) => (
          <SidebarItem
            key={item}
            onClick={() => handleNavigate(item)}
            style={{
              fontWeight: page === item ? "700" : "normal",
              color: page === item ? "#60a5fa" : "white",
            }}
          >
            {item === "calculator"
              ? "Calculadora"
              : item === "sales"
              ? "Vendas"
              : "Ponto"}
          </SidebarItem>
        ))}
      </Sidebar>

      <Content sidebarOpen={sidebarOpen}>
        <InnerContent>
          {page === "calculator" && <Calculator />}
          {page === "sales" && <SalesList />}
          {page === "ponto" && <PontoPage />}
        </InnerContent>
      </Content>
    </LayoutContainer>
  );
};

export default App;
