import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="pb-16">
          <Dashboard />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}

export default App;
