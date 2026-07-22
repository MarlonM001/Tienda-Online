import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import CartDrawer from "./components/cart/CartDrawer";
import WhatsAppFloatButton from "./components/layout/WhatsAppFloatButton";
import ProtectedRoute from "./components/ProtectedRoute";
import RequireCustomer from "./components/RequireCustomer";

import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminReports from "./pages/admin/AdminReports";

function StoreLayout({ query, onQueryChange, children }) {
  return (
    <div className="store" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-bg)" }}>
      <Navbar query={query} onQueryChange={onQueryChange} />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>{children}</main>
      <Footer />
      <CartDrawer />
      <WhatsAppFloatButton />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const [query, setQuery] = useState("");

  const content = (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Catalog query={query} onQueryChange={setQuery} />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <RequireCustomer>
              <Checkout />
            </RequireCustomer>
          }
        />
        <Route path="/pedido-confirmado" element={<OrderConfirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route
          path="/cuenta"
          element={
            <RequireCustomer>
              <Account />
            </RequireCustomer>
          }
        />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="productos" element={<AdminProducts />} />
          <Route path="pedidos" element={<AdminOrders />} />
          <Route path="clientes" element={<AdminCustomers />} />
          <Route path="reportes" element={<AdminReports />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );

  if (isAdmin) return content;
  return (
    <StoreLayout query={query} onQueryChange={setQuery}>
      {content}
    </StoreLayout>
  );
}
