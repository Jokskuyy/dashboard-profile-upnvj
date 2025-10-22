import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <LanguageProvider>
      <Router>
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

          {/* Admin Dashboard Route */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
