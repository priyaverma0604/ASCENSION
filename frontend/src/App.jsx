import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import waterfallBg from './assets/waterfall_bg.jpg';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Programs from './pages/Programs';
import Shop from './pages/Shop';
import Community from './pages/Community';
import NGO from './pages/NGO';
import Donation from './pages/Donation';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetails from './pages/ProductDetails';

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
            <div className="flex flex-col min-h-screen bg-[#FFFDF7] text-charcoal relative">
              {/* Global Subtle Waterfall Watermark Background */}
              <div 
                className="fixed inset-0 pointer-events-none z-0 opacity-[0.05] bg-cover bg-center bg-no-repeat bg-fixed"
                style={{ backgroundImage: `url(${waterfallBg})` }}
              />
              {/* Luxury Header */}
              <Navbar />
              
              {/* Content Panel */}
              <main className="flex-grow">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/programs" element={<Programs />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/ngo" element={<NGO />} />
                  <Route path="/donate" element={<Donation />} />
                  <Route path="/contact" element={<Contact />} />
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

              {/* Luxury Footer */}
              <Footer />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
