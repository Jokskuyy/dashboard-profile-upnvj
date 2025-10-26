import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";
import Analytics from "./components/Analytics";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Analytics />
          <Routes>
            {/* Public Dashboard Route */}
            <Route
              path="/"
              element={
                <div className="min-h-screen bg-gray-50">
                  <Header />
                  <main className="pb-16">
                    <Dashboard />
                  </main>
                  <Footer />
                </div>
              }
            />

            {/* Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Admin Dashboard Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
