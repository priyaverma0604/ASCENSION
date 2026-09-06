import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import waterfallBg from './assets/waterfall_bg.jpg';
import { Heart } from 'lucide-react';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Programs from './pages/Programs';
import Shop from './pages/Shop';
import Community from './pages/Community';
import NGO from './pages/NGO';
import CSR from './pages/CSR';
import Donation from './pages/Donation';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetails from './pages/ProductDetails';
import ProgramDashboard from './pages/ProgramDashboard';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <ScrollToTop />
            <div className="flex flex-col min-h-screen bg-[#FFFDF7] text-charcoal relative">
              {/* Global Subtle Waterfall Watermark Background */}
              <div 
                className="fixed inset-0 pointer-events-none z-0 opacity-[0.05] bg-cover bg-center bg-no-repeat bg-fixed"
                style={{ backgroundImage: `url(${waterfallBg})` }}
              />
              {/* Luxury Header */}
              <Navbar />
              
              {/* Content Panel with mobile bottom safe padding */}
              <main className="flex-grow pb-16 lg:pb-0">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/webinars" element={<Home scrollToWebinar={true} />} />
                  <Route path="/webinar" element={<Home scrollToWebinar={true} />} />
                  <Route path="/ancestral-healing-webinar" element={<Home scrollToWebinar={true} autoOpenAncestral={true} />} />
                  <Route path="/ancestral-webinar" element={<Home scrollToWebinar={true} autoOpenAncestral={true} />} />
                  <Route path="/webinar/ancestral-healing" element={<Home scrollToWebinar={true} autoOpenAncestral={true} />} />
                  <Route path="/webinars/ancestral-healing" element={<Home scrollToWebinar={true} autoOpenAncestral={true} />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/ngo" element={<NGO />} />
                  <Route path="/donate" element={<Donation />} />
                  <Route path="/contact" element={<Contact />} />
                   <Route path="/csr" element={<CSR />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Private User Route */}
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />

                  <Route 
                    path="/programs/:id/dashboard" 
                    element={
                      <ProtectedRoute>
                        <ProgramDashboard />
                      </ProtectedRoute>
                    } 
                  />

                  {/* Secure Admin Route */}
                  <Route 
                    path="/admin" 
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } 
                  />

                  {/* Fallback redirect */}
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>

              {/* Floating Heartbeat Donate Button - adjusted for mobile bottom navigation */}
              <Link 
                to="/donate" 
                className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-30 bg-sage hover:bg-sage-dark text-white p-3.5 sm:p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 group animate-heartbeat border border-gold/30"
                title="Support Our Seva - Donate Now"
              >
                <Heart className="w-5 h-5 fill-current transition-colors" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 ease-in-out text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                  Donate
                </span>
              </Link>

              {/* Luxury Footer */}
              <Footer />

              {/* Mobile Single-Thumb Navigation Bar */}
              <MobileBottomNav />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
