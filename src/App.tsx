import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth';
import { SnackbarProvider } from './components/Snackbar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { NewAgent } from './pages/NewAgent';
import { NewApiKey } from './pages/NewApiKey';
import { NewDomain } from './pages/NewDomain';
import { Challenge } from './pages/Challenge';
import { Check } from './pages/Check';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Support } from './pages/Support';
import { Guide } from './pages/Guide';
import { NotFound } from './pages/NotFound';
import { ScrollToTop } from './components/ScrollToTop';

function App() {
  return (
    <AuthProvider>
      <SnackbarProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-[#1f1f1f] flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/challenge" element={<Challenge />} />
              <Route path="/check" element={<Check />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/support" element={<Support />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/new"
                element={
                  <ProtectedRoute>
                    <NewAgent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/api-keys/new"
                element={
                  <ProtectedRoute>
                    <NewApiKey />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/domains/new"
                element={
                  <ProtectedRoute>
                    <NewDomain />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
      </SnackbarProvider>
    </AuthProvider>
  );
}

export default App;