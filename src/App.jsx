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
import AdminProductos from "./pages/AdminProductos";
import AdminUsuarios from "./pages/AdminUsuarios";
import AdminOrdenes from "./pages/AdminOrdenes";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Resumen from "./pages/Resumen";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import Perfil from "./pages/Perfil";

export default function App() {
  function getUserRole() {
    try {
      const raw = localStorage.getItem("usuarioActivo");
      const user = raw ? JSON.parse(raw) : null;
      return user?.role || user?.user?.role || null;
    } catch {
      return null;
    }
  }
  function RequireAdmin({ children }) {
    try {
      const role = getUserRole();
      if (role === "ADMIN") return children;
      return <Navigate to="/login" replace />;
    } catch {
      return <Navigate to="/login" replace />;
    }
  }
  function RequireRole({ children, allow }) {
    try {
      const role = getUserRole();
      if (role && Array.isArray(allow) && allow.includes(role)) return children;
      return <Navigate to="/login" replace />;
    } catch {
      return <Navigate to="/login" replace />;
    }
  }
  function RequireAuth({ children }) {
    try {
      const raw = localStorage.getItem("usuarioActivo");
      const user = raw ? JSON.parse(raw) : null;
      if (user && (localStorage.getItem("token") || user.token)) return children;
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
              <Route path="/resumen" element={<Resumen />} />
              <Route path="/success" element={<Success />} />
              <Route path="/failure" element={<Failure />} />
              <Route
                path="/orders"
                element={
                  <RequireAuth>
                    <Orders />
                  </RequireAuth>
                }
              />
              <Route
                path="/perfil"
                element={
                  <RequireAuth>
                    <Perfil />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <Navigate to="/admin/productos" replace />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/productos"
                element={
                  <RequireRole allow={["ADMIN","PROD_AD"]}>
                    <AdminProductos />
                  </RequireRole>
                }
              />
              <Route
                path="/admin/usuarios"
                element={
                  <RequireRole allow={["ADMIN","USERS_AD","USER_AD"]}>
                    <AdminUsuarios />
                  </RequireRole>
                }
              />
              <Route
                path="/admin/ordenes"
                element={
                  <RequireRole allow={["ADMIN","VENDEDOR"]}>
                    <AdminOrdenes />
                  </RequireRole>
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
