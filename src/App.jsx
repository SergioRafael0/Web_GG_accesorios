import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import DetalleProducto from "./pages/DetalleProducto";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Failure from "./pages/Failure";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

export default function App() {
  function RequireAdmin({ children }) {
    try {
      const raw = localStorage.getItem("usuarioActivo");
      const user = raw ? JSON.parse(raw) : null;
      const role = user?.role || user?.user?.role; // tolerar estructuras
      if (role === "ADMIN") return children;
      return <Navigate to="/login" replace />;
    } catch {
      return <Navigate to="/login" replace />;
    }
  }
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100 text-light">
        {/* Encabezado principal */}
        <Header />
        <ScrollToTop />
        {/* Contenido principal */}
        <main className="flex-grow-1 py-4">
          <Suspense fallback={<div className="container py-5">Cargando...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/:id" element={<DetalleProducto />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/success" element={<Success />} />
              <Route path="/failure" element={<Failure />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <Admin />
                  </RequireAdmin>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>

        {/* Pie de página */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
