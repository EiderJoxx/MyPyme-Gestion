import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.tsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<h1>Pagina Inicio</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
