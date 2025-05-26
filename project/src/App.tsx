import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ExhibitsPage from './pages/ExhibitsPage';
import ExhibitDetailPage from './pages/ExhibitDetailPage';
import HistoryPage from './pages/HistoryPage';
import GalleryPage from './pages/GalleryPage';
import PeoplePage from './pages/PeoplePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/exhibits" element={<ExhibitsPage />} />
              <Route path="/exhibits/:id" element={<ExhibitDetailPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/people" element={<PeoplePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;