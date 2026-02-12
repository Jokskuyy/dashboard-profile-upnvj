import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import { ToastProvider } from "./contexts/ToastContext";
import {
  Header,
  Footer,
  ProtectedRoute,
  ErrorBoundary,
} from "./components/common";
import Dashboard from "./components/dashboard/Dashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import Login from "./components/auth/Login";
import Analytics from "./components/analytics/Analytics";
import "./App.css";

function App() {
  // Use basename only on GitHub Pages, not in development
  const basename = import.meta.env.BASE_URL;

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <DashboardProvider>
            <ToastProvider>
              <Router basename={basename}>
                <Analytics />
                <Routes>
                  {/* Public Dashboard Route */}
                  <Route
                    path="/"
                    element={
                      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
                        <Header />
                        <main className="pb-16">
                          <Dashboard />
                        </main>
                        <Footer />
                      </div>
                    }
                  />

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
            </ToastProvider>
          </DashboardProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
