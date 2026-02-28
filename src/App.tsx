import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DashboardProvider } from "./contexts/DashboardContext";
import { ToastProvider } from "./contexts/ToastContext";
import { Header, Footer, ProtectedRoute, ErrorBoundary } from "./components/common";
import { DashboardSkeleton } from "./components/common/SkeletonLoader";
import "./App.css";

// Lazy-loaded route components for code splitting
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const Login = lazy(() => import("./components/auth/Login"));
const Analytics = lazy(() => import("./components/analytics/Analytics"));

// Fallback component for Suspense
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <DashboardSkeleton />
  </div>
);

function App() {
  // Use basename only on GitHub Pages, not in development
  const basename = import.meta.env.BASE_URL;

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Router basename={basename}>
              <Suspense fallback={null}>
                <Analytics />
              </Suspense>
              <Routes>
                {/* Public Dashboard Route — DashboardProvider only wraps this route */}
                <Route
                  path="/"
                  element={
                    <DashboardProvider>
                      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
                        <Header />
                        <main className="pb-16">
                          <Suspense fallback={<PageLoader />}>
                            <Dashboard />
                          </Suspense>
                        </main>
                        <Footer />
                      </div>
                    </DashboardProvider>
                  }
                />

                {/* Login Routes */}
                <Route path="/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />
                <Route path="/admin/login" element={<Suspense fallback={<PageLoader />}><Login /></Suspense>} />

                {/* Protected Admin Dashboard Route */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Suspense fallback={<PageLoader />}>
                        <AdminDashboard />
                      </Suspense>
                    </ProtectedRoute>
                  }
                />

                {/* 404 Catch-all */}
                <Route
                  path="*"
                  element={
                    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                        <p className="text-xl text-gray-600 mb-6">Halaman tidak ditemukan</p>
                        <a href="/" className="px-6 py-3 bg-[#2C5F2D] text-white rounded-lg hover:bg-[#234d24] transition-colors">
                          Kembali ke Beranda
                        </a>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </Router>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
