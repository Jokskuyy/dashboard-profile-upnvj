import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import { Header, Footer, ProtectedRoute } from "./components/common";
import Dashboard from "./components/dashboard/Dashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import Login from "./components/auth/Login";
import Analytics from "./components/analytics/Analytics";
import SupabaseTest from "./components/SupabaseTest";
import "./App.css";

function App() {
  // Use basename only on GitHub Pages, not in development
  const basename = import.meta.env.BASE_URL;

  return (
    <LanguageProvider>
      <AuthProvider>
        <DashboardProvider>
          <Router basename={basename}>
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

            {/* Supabase Test Route */}
            <Route path="/test-supabase" element={<SupabaseTest />} />

            {/* Login Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<Login />} />

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
        </DashboardProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
