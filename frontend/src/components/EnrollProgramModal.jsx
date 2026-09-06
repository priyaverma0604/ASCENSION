import React, { useState, useContext } from 'react';
import { X, CheckCircle, Compass, UploadCloud, Smartphone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase}${path}`;
};

const EnrollProgramModal = ({ program, onClose }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form fields
  const [phone, setPhone] = useState(user ? user.phone || '' : '');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transactionId || !screenshot) {
      alert('Please enter your transaction Reference ID and upload the receipt screenshot.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('phone', phone);
      formData.append('transactionId', transactionId);
      formData.append('paymentScreenshot', screenshot);

      const { data } = await axios.post(`/api/programs/${program._id}/enroll-qr`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        setSuccess(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit enrollment request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="glass max-w-md w-full rounded-2xl shadow-xl overflow-hidden animate-slide-up text-left max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-5 border-b border-cream-dark shrink-0">
          <div>
            <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider">
              Program Enrollment
            </h3>
            <p className="text-[10px] text-sage font-medium tracking-wide uppercase mt-0.5 max-w-[280px] truncate">
              {program.title}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-charcoal hover:text-gold transition-colors focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          /* Success Screen */
          <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center gap-4 overflow-y-auto flex-1">
            <CheckCircle className="w-12 h-12 text-gold animate-pulse" />
            <h4 className="font-serif text-lg font-bold text-charcoal-dark">
              Request Submitted!
            </h4>
            <p className="text-xs text-charcoal-light leading-relaxed px-2 sm:px-4">
              Thank you, **{user?.name}**! Your manual payment check request (Transaction ID: **{transactionId}**) has been submitted successfully. 
              Our team will verify the payment and activate the program in your dashboard shortly.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gold hover:bg-gold-dark text-charcoal-dark text-xs font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm mt-4 uppercase tracking-wider"
            >
              Done
            </button>
          </div>
        ) : (
          /* Checkout Fields Screen */
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 flex flex-col gap-4 text-xs text-charcoal overflow-y-auto flex-1">
            
            {/* Instruction Block */}
            <div className="bg-cream/60 border border-cream-dark/60 p-3.5 rounded-xl flex gap-3 text-charcoal-light font-sans leading-relaxed">
              <Smartphone className="w-5 h-5 text-gold-dark shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase tracking-wider text-[9px] text-charcoal-dark">Scan & Pay via UPI</p>
                <p className="text-[10px] mt-0.5">
                  Scan the QR code below, or use the UPI ID: <strong className="text-charcoal-dark">sonalibhasinkumar@ptaxis</strong>. 
                  After payment, enter the reference transaction ID and upload the receipt screenshot below.
                </p>
              </div>
            </div>

            {/* QR Image */}
            <div className="flex justify-center py-2 bg-white/40 rounded-xl border border-cream-dark/40 max-w-[200px] mx-auto">
              <img 
                src={getImageUrl('/uploads/default_upi_qr.jpg')} 
                alt="Payment QR Code" 
                className="w-40 h-40 object-contain"
              />
            </div>

            {/* Price Box */}
            <div className="flex justify-between items-center bg-cream/70 p-3 rounded-xl border border-cream-dark font-sans">
              <span className="text-charcoal-light font-medium">Program Investment</span>
              <span className="font-serif font-bold text-sm text-gold-dark">
                ₹{new Intl.NumberFormat('en-IN').format(program.sellingPrice || program.pricing)}
              </span>
            </div>

            {/* Input fields */}
            <div className="flex flex-col gap-3 font-sans">
              
              {/* WhatsApp phone number */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-gold transition-all"
                />
              </div>

              {/* Transaction reference ID */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Transaction Reference ID</label>
                <input
                  type="text"
                  required
                  placeholder="Enter 12-digit transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-gold transition-all"
                />
              </div>

              {/* Screenshot file upload */}
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[9px]">Upload Receipt Screenshot</label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-cream-dark/60 rounded-xl py-3 px-4 bg-cream-light hover:bg-cream cursor-pointer transition-colors duration-200">
                    <UploadCloud className="w-5 h-5 text-gold-dark mb-1" />
                    <span className="text-[10px] text-charcoal-light">
                      {screenshot ? screenshot.name : 'Choose image file'}
                    </span>
                    <input 
                      type="file"
                      required
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {screenshotPreview && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-cream-dark shrink-0">
                      <img src={screenshotPreview} alt="Receipt preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* CTAs */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl transition-colors duration-200 uppercase tracking-wider text-[10px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-gold hover:bg-gold-dark text-charcoal-dark font-bold py-2.5 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider text-[10px] border border-gold-dark/20"
              >
                {loading && <Compass className="w-4 h-4 animate-spin text-charcoal-dark" />}
                <span>{loading ? 'Submitting...' : 'Submit Receipt'}</span>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};

export default EnrollProgramModal;
