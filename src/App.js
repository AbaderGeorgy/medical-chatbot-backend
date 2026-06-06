import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import ForgetPassword from "./components/ForgetPassword";
import Home from "./pages/Home";
import Upload from "./pages/upload";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Chatbot from "./pages/Chatbot";
import Education from "./pages/Education";
import ChatbotWidget from "./components/ChatbotWidget";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function Layout() {
  const location = useLocation();
  const hideFloatingChat =
    location.pathname === "/chatbot" ||
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/forgetpassword" ||
    location.pathname === "/auth";

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route path="/education" element={<Education />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
      {!hideFloatingChat && <ChatbotWidget />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}
