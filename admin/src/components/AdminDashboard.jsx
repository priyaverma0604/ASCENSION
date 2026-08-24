import React, { useState, useEffect } from 'react';
import { 
  Compass, Eye, Edit2, Trash2, PlusCircle, CheckCircle, 
  X, RefreshCw, Layers, ShieldCheck, ShoppingBag, 
  Calendar, MapPin, DollarSign, MessageCircle, FileText, Smile 
} from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.png';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase}${path}`;
};

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('services');
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [gratitudeProgramId, setGratitudeProgramId] = useState('');
  
  // Assignment form states
  const [assignmentDayNumber, setAssignmentDayNumber] = useState('');
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentContent, setAssignmentContent] = useState('');
  const [assignmentDuration, setAssignmentDuration] = useState('20 minutes');
  const [assignmentStatus, setAssignmentStatus] = useState('Active');
  const [assignmentImage, setAssignmentImage] = useState(null);
  
  // Submission review state
  const [reviewComment, setReviewComment] = useState('');

  // Form Modals
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedItem, setSelectedItem] = useState(null);
  const [programProgressList, setProgramProgressList] = useState([]);
  const [loadingProgressList, setLoadingProgressList] = useState(false);
  const [selectedUserProgress, setSelectedUserProgress] = useState(null);

  // Form State
  const [serviceTitle, setServiceTitle] = useState('');
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceBenefits, setServiceBenefits] = useState('');
  const [serviceDuration, setServiceDuration] = useState('');
  const [servicePrice, setServicePrice] = useState('');

  const [productName, setProductName] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('Crystals');
  const [productStock, setProductStock] = useState('');

  const [workshopTitle, setWorkshopTitle] = useState('');
  const [workshopDesc, setWorkshopDesc] = useState('');
  const [workshopDate, setWorkshopDate] = useState('');
  const [workshopTime, setWorkshopTime] = useState('');
  const [workshopPrice, setWorkshopPrice] = useState('');
  const [workshopCapacity, setWorkshopCapacity] = useState('');
  const [workshopZoomLink, setWorkshopZoomLink] = useState('');

  const [programTitle, setProgramTitle] = useState('');
  const [programDesc, setProgramDesc] = useState('');
  const [programDuration, setProgramDuration] = useState('');
  const [programPrice, setProgramPrice] = useState('');
  const [programCapacity, setProgramCapacity] = useState('');
  const [programYoutubeUrl, setProgramYoutubeUrl] = useState('');

  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState('update');

  const [retreatTitle, setRetreatTitle] = useState('');
  const [retreatDesc, setRetreatDesc] = useState('');
  const [retreatPrice, setRetreatPrice] = useState('');
  const [retreatCapacity, setRetreatCapacity] = useState('');
  const [retreatItinerary, setRetreatItinerary] = useState(''); // JSON string

  // Webinar form state
  const [webinarTitle, setWebinarTitle] = useState('');
  const [webinarShortDesc, setWebinarShortDesc] = useState('');
  const [webinarDetailedDesc, setWebinarDetailedDesc] = useState('');
  const [webinarSpeaker, setWebinarSpeaker] = useState('');
  const [webinarDate, setWebinarDate] = useState('');
  const [webinarTime, setWebinarTime] = useState('');
  const [webinarDuration, setWebinarDuration] = useState('');
  const [webinarPrice, setWebinarPrice] = useState('1');
  const [webinarMaxSeats, setWebinarMaxSeats] = useState('100');
  const [webinarUpiId, setWebinarUpiId] = useState('sonalibhasinkumar@ptaxis');
  const [webinarZoomLink, setWebinarZoomLink] = useState('');
  const [webinarStatus, setWebinarStatus] = useState('Upcoming');
  const [webinarCover, setWebinarCover] = useState(null);
  const [webinarQr, setWebinarQr] = useState(null);

  const tabs = [
    { id: 'services', label: 'Services', icon: <Layers className="w-4 h-4" /> },
    { id: 'programs', label: 'Programs', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'gratitude-assignments', label: 'Gratitude Assignments', icon: <FileText className="w-4 h-4" /> },
    { id: 'gratitude-submissions', label: 'Gratitude Submissions', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'products', label: 'Products', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'workshops', label: 'Workshops', icon: <Calendar className="w-4 h-4" /> },
    { id: 'webinars', label: 'Webinars', icon: <Calendar className="w-4 h-4" /> },
    { id: 'webinar-registrations', label: 'Webinar Registrations', icon: <FileText className="w-4 h-4" /> },
    { id: 'workshop-registrations', label: 'Workshop Registrations', icon: <FileText className="w-4 h-4" /> },
    { id: 'program-registrations', label: 'Program Registrations', icon: <FileText className="w-4 h-4" /> },
    { id: 'service-bookings', label: 'Service Bookings', icon: <FileText className="w-4 h-4" /> },
    { id: 'retreats', label: 'Retreats', icon: <MapPin className="w-4 h-4" /> },
    { id: 'donations', label: 'Donations', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'community', label: 'Community', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'contacts', label: 'Contacts', icon: <FileText className="w-4 h-4" /> },
    { id: 'testimonials', label: 'Testimonials', icon: <Smile className="w-4 h-4" /> }
  ];

  useEffect(() => {
    fetchGratitudeProgramId();
  }, []);

  const fetchGratitudeProgramId = async () => {
    try {
      const { data } = await axios.get('/api/programs');
      if (data.success) {
        const gratProg = data.data.find(p => p.title.toLowerCase().includes('gratitude'));
        if (gratProg) {
          setGratitudeProgramId(gratProg._id);
        }
      }
    } catch (err) {
      console.error('Error fetching programs for gratitude id:', err.message);
    }
  };

  useEffect(() => {
    fetchTabData();
  }, [activeTab, gratitudeProgramId]);

  const fetchTabData = async () => {
    setLoading(true);
    setListData([]);
    try {
      let endpoint = `/api/${activeTab}`;
      if (activeTab === 'community') endpoint = '/api/community';
      if (activeTab === 'webinar-registrations') endpoint = '/api/webinars/registrations';
      if (activeTab === 'workshop-registrations') endpoint = '/api/workshops/registrations';
      if (activeTab === 'program-registrations') endpoint = '/api/programs/registrations';
      if (activeTab === 'service-bookings') endpoint = '/api/contacts';

      if (activeTab === 'gratitude-assignments') {
        if (!gratitudeProgramId) {
          setLoading(false);
          return;
        }
        endpoint = `/api/programs/${gratitudeProgramId}/assignments/admin`;
      }
      if (activeTab === 'gratitude-submissions') {
        if (!gratitudeProgramId) {
          setLoading(false);
          return;
        }
        endpoint = `/api/programs/${gratitudeProgramId}/submissions/admin`;
      }
      
      const { data } = await axios.get(endpoint);
      if (data.success) {
        if (activeTab === 'service-bookings') {
          const bookings = data.data.filter(item => item.message && item.message.includes('[SERVICE BOOKING REQUEST:'));
          setListData(bookings);
        } else {
          setListData(data.data);
        }
      }
    } catch (err) {
      console.error('Error fetching admin data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (activeTab === 'gratitude-assignments') {
      const itemToDelete = listData.find(i => i._id === id);
      if (itemToDelete && itemToDelete.stats?.total > 0) {
        alert("Cannot permanently delete this assignment because submissions already exist. You can deactivate it by editing the status instead.");
        return;
      }
    }

    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      let endpoint = `/api/${activeTab}/${id}`;
      if (activeTab === 'community') endpoint = `/api/community/${id}`;
      if (activeTab === 'webinar-registrations') endpoint = `/api/webinars/registrations/${id}`;
      if (activeTab === 'workshop-registrations') endpoint = `/api/workshops/registrations/${id}`;
      if (activeTab === 'program-registrations') endpoint = `/api/programs/registrations/${id}`;
      if (activeTab === 'service-bookings') endpoint = `/api/contacts/${id}`;
      if (activeTab === 'gratitude-assignments') endpoint = `/api/programs/assignments/${id}`;

      const { data } = await axios.delete(endpoint);
      if (data.success) {
        fetchTabData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Delete operation failed');
    }
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedItem(null);
    clearFormFields();
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setModalMode('edit');
    setSelectedItem(item);
    populateFormFields(item);
    setShowModal(true);
  };

  const handleOpenView = async (item) => {
    setModalMode('view');
    setSelectedItem(item);
    setShowModal(true);
    
    if (activeTab === 'programs') {
      setLoadingProgressList(true);
      setProgramProgressList([]);
      setSelectedUserProgress(null);
      try {
        const { data } = await axios.get(`/api/programs/${item._id}/progress/all`);
        if (data.success) {
          setProgramProgressList(data.data);
        }
      } catch (err) {
        console.error('Error fetching program progress list:', err.message);
      } finally {
        setLoadingProgressList(false);
      }
    }
  };

  const clearFormFields = () => {
    setServiceTitle('');
    setServiceDesc('');
    setServiceBenefits('');
    setServiceDuration('60');
    setServicePrice('');

    setProductName('');
    setProductDesc('');
    setProductPrice('');
    setProductCategory('Crystals');
    setProductStock('10');

    setWorkshopTitle('');
    setWorkshopDesc('');
    setWorkshopDate('');
    setWorkshopTime('');
    setWorkshopPrice('');
    setWorkshopCapacity('30');
    setWorkshopZoomLink('');

    setProgramTitle('');
    setProgramDesc('');
    setProgramDuration('');
    setProgramPrice('');
    setProgramCapacity('20');
    setProgramYoutubeUrl('');

    setPostTitle('');
    setPostContent('');
    setPostType('update');

    setRetreatTitle('');
    setRetreatDesc('');
    setRetreatPrice('');
    setRetreatCapacity('15');
    setRetreatItinerary('[\n  {"day": 1, "title": "Day 1", "description": "Details here"}\n]');

    setWebinarTitle('');
    setWebinarShortDesc('');
    setWebinarDetailedDesc('');
    setWebinarSpeaker('');
    setWebinarDate('');
    setWebinarTime('');
    setWebinarDuration('');
    setWebinarPrice('1');
    setWebinarMaxSeats('100');
    setWebinarUpiId('sonalibhasinkumar@ptaxis');
    setWebinarZoomLink('');
    setWebinarStatus('Upcoming');
    setWebinarCover(null);
    setWebinarQr(null);

    setAssignmentDayNumber('');
    setAssignmentTitle('');
    setAssignmentContent('');
    setAssignmentDuration('20 minutes');
    setAssignmentStatus('Active');
    setAssignmentImage(null);
    setReviewComment('');
  };

  const populateFormFields = (item) => {
    if (activeTab === 'services') {
      setServiceTitle(item.title);
      setServiceDesc(item.description);
      setServiceBenefits(item.benefits?.join(', ') || '');
      setServiceDuration(item.duration);
      setServicePrice(item.pricing);
    } else if (activeTab === 'products') {
      setProductName(item.name);
      setProductDesc(item.description);
      setProductPrice(item.pricing);
      setProductCategory(item.category);
      setProductStock(item.stock);
    } else if (activeTab === 'workshops') {
      setWorkshopTitle(item.title);
      setWorkshopDesc(item.description);
      setWorkshopDate(item.date?.substring(0, 10) || '');
      setWorkshopTime(item.time);
      setWorkshopPrice(item.pricing);
      setWorkshopCapacity(item.capacity);
      setWorkshopZoomLink(item.zoomLink || '');
    } else if (activeTab === 'programs') {
      setProgramTitle(item.title);
      setProgramDesc(item.description);
      setProgramDuration(item.duration);
      setProgramPrice(item.pricing);
      setProgramCapacity(item.enrollmentCapacity);
      setProgramYoutubeUrl(item.youtubeUrl || '');
    } else if (activeTab === 'community') {
      setPostTitle(item.title);
      setPostContent(item.content);
      setPostType(item.type);
    } else if (activeTab === 'retreats') {
      setRetreatTitle(item.title);
      setRetreatDesc(item.description);
      setRetreatPrice(item.pricing);
      setRetreatCapacity(item.capacity);
      setRetreatItinerary(JSON.stringify(item.itinerary, null, 2));
    } else if (activeTab === 'webinars') {
      setWebinarTitle(item.title);
      setWebinarShortDesc(item.shortDescription);
      setWebinarDetailedDesc(item.detailedDescription);
      setWebinarSpeaker(item.speakerName);
      setWebinarDate(item.date ? item.date.substring(0, 10) : '');
      setWebinarTime(item.time);
      setWebinarDuration(item.duration);
      setWebinarPrice(item.price);
      setWebinarMaxSeats(item.maxSeats);
      setWebinarUpiId(item.upiId);
      setWebinarZoomLink(item.zoomLink);
      setWebinarStatus(item.status);
    } else if (activeTab === 'gratitude-assignments') {
      setAssignmentDayNumber(item.dayNumber);
      setAssignmentTitle(item.title);
      setAssignmentContent(item.content);
      setAssignmentDuration(item.estimatedDuration);
      setAssignmentStatus(item.status);
      setAssignmentImage(null);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload = {};
      let config = {};
      let endpoint = `/api/${activeTab}`;
      if (activeTab === 'community') endpoint = '/api/community';

      if (activeTab === 'webinars') {
        payload = new FormData();
        payload.append('title', webinarTitle);
        payload.append('shortDescription', webinarShortDesc);
        payload.append('detailedDescription', webinarDetailedDesc);
        payload.append('speakerName', webinarSpeaker);
        payload.append('date', webinarDate);
        payload.append('time', webinarTime);
        payload.append('duration', webinarDuration);
        payload.append('price', webinarPrice);
        payload.append('maxSeats', webinarMaxSeats);
        payload.append('upiId', webinarUpiId);
        payload.append('zoomLink', webinarZoomLink);
        payload.append('status', webinarStatus);
        
        if (webinarCover) payload.append('coverImage', webinarCover);
        if (webinarQr) payload.append('upiQrCodeImage', webinarQr);
        
        config = { headers: { 'Content-Type': 'multipart/form-data' } };
      } else if (activeTab === 'services') {
        payload = {
          title: serviceTitle,
          description: serviceDesc,
          benefits: serviceBenefits ? serviceBenefits.split(',').map(b => b.trim()) : [],
          duration: serviceDuration,
          pricing: servicePrice
        };
      } else if (activeTab === 'products') {
        payload = {
          name: productName,
          description: productDesc,
          pricing: productPrice,
          category: productCategory,
          stock: productStock
        };
      } else if (activeTab === 'workshops') {
        payload = {
          title: workshopTitle,
          description: workshopDesc,
          date: workshopDate,
          time: workshopTime,
          pricing: workshopPrice,
          capacity: workshopCapacity,
          zoomLink: workshopZoomLink
        };
      } else if (activeTab === 'programs') {
        payload = {
          title: programTitle,
          description: programDesc,
          duration: programDuration,
          pricing: programPrice,
          enrollmentCapacity: programCapacity,
          youtubeUrl: programYoutubeUrl
        };
      } else if (activeTab === 'community') {
        payload = {
          title: postTitle,
          content: postContent,
          type: postType
        };
      } else if (activeTab === 'gratitude-assignments') {
        payload = new FormData();
        payload.append('dayNumber', assignmentDayNumber);
        payload.append('title', assignmentTitle);
        payload.append('content', assignmentContent);
        payload.append('estimatedDuration', assignmentDuration);
        payload.append('status', assignmentStatus);
        if (assignmentImage) {
          payload.append('image', assignmentImage);
        }
        config = { headers: { 'Content-Type': 'multipart/form-data' } };
        endpoint = `/api/programs/${gratitudeProgramId}/assignments`;

        if (modalMode === 'edit') {
          endpoint = `/api/programs/assignments/${selectedItem._id}`;
        }
      }

      if (modalMode === 'create') {
        await axios.post(endpoint, payload, config);
      } else {
        if (activeTab === 'gratitude-assignments') {
          await axios.put(endpoint, payload, config);
        } else {
          await axios.put(`${endpoint}/${selectedItem._id}`, payload, config);
        }
      }

      setShowModal(false);
      fetchTabData();
    } catch (err) {
      alert(err.response?.data?.message || 'Form submission failed');
    }
  };

  const handleReviewSubmission = async (status) => {
    try {
      const { data } = await axios.patch(`/api/programs/submissions/${selectedItem._id}/review`, {
        status,
        adminComment: reviewComment
      });
      if (data.success) {
        alert(`Submission marked as ${status} successfully.`);
        setShowModal(false);
        setReviewComment('');
        fetchTabData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Review failed');
    }
  };

  const handleApproveRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to approve this registration?')) return;
    try {
      const { data } = await axios.put(`/api/webinars/registrations/${id}/approve`);
      if (data.success) {
        alert('Registration approved successfully.');
        fetchTabData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleRejectRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to reject this registration?')) return;
    try {
      const { data } = await axios.put(`/api/webinars/registrations/${id}/reject`);
      if (data.success) {
        alert('Registration rejected successfully.');
        fetchTabData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    }
  };

  const handleApproveWorkshopRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to approve this workshop registration?')) return;
    try {
      const { data } = await axios.put(`/api/workshops/registrations/${id}/approve`);
      if (data.success) {
        alert('Workshop registration approved successfully.');
        fetchTabData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleRejectWorkshopRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to reject this workshop registration?')) return;
    try {
      const { data } = await axios.put(`/api/workshops/registrations/${id}/reject`);
      if (data.success) {
        alert('Workshop registration rejected successfully.');
        fetchTabData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    }
  };

  const handleApproveProgramRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to approve this program enrollment?')) return;
    try {
      const { data } = await axios.post(`/api/programs/registrations/${id}/verify`, { status: 'Paid' });
      if (data.success) {
        alert('Program enrollment approved successfully.');
        fetchTabData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  const handleRejectProgramRegistration = async (id) => {
    if (!window.confirm('Are you sure you want to reject this program enrollment?')) return;
    try {
      const { data } = await axios.post(`/api/programs/registrations/${id}/verify`, { status: 'Rejected' });
      if (data.success) {
        alert('Program enrollment rejected successfully.');
        fetchTabData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    }
  };

  const handleApproveOrderPayment = async (id) => {
    if (!window.confirm('Are you sure you want to mark this order as paid?')) return;
    try {
      const { data } = await axios.post(`/api/orders/${id}/verify-upi`);
      if (data.success) {
        alert('Order payment marked as paid successfully.');
        fetchTabData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Payment approval failed');
    }
  };

  const handleUpdateStatus = async (id, field, value) => {
    try {
      let endpoint = `/api/${activeTab}/${id}/${field}`;
      if (activeTab === 'service-bookings') {
        endpoint = `/api/contacts/${id}/${field}`;
      }
      await axios.put(endpoint, { [field]: value });
      fetchTabData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update item status');
    }
  };

  return (
    <div className="min-h-screen bg-cream-light font-sans text-charcoal pb-16">
      
      {/* Header bar */}
      <header className="glass shadow-sm border-b border-cream-dark/50 px-6 py-4 flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Ascension Healer" className="h-10 w-auto object-contain" />
          <span className="text-[10px] uppercase font-bold tracking-widest bg-gold/10 text-gold-dark px-2.5 py-0.5 rounded border border-gold/25">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-charcoal/70 hidden sm:inline">Signed in as <strong>{user.email}</strong></span>
          <button 
            onClick={onLogout}
            className="text-xs font-bold uppercase tracking-wider bg-gold hover:bg-gold-dark text-white px-4 py-2 rounded-xl transition-all duration-300 shadow-sm"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
          
          {/* Left Side: Side Nav Tabs */}
          <div className="w-full md:w-64 glass rounded-2xl p-5 border border-cream-dark/50 self-start text-left flex flex-col gap-1.5 shrink-0">
            <div className="flex items-center gap-2 border-b border-cream-dark/65 pb-3 mb-3">
              <span className="gold-gradient p-1.5 rounded-lg text-white">
                <Compass className="w-5 h-5" />
              </span>
              <span className="font-serif font-bold text-sm tracking-wider text-charcoal-dark uppercase">Admin Backoffice</span>
            </div>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all focus:outline-none ${
                  activeTab === t.id
                    ? 'bg-sage text-white font-bold shadow-sm'
                    : 'bg-transparent text-charcoal/70 hover:bg-cream-dark/50'
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Right Side: Data Feed Grid Panels */}
          <div className="flex-grow flex flex-col gap-6 text-left overflow-hidden">
            
            {/* Header toolbar */}
            <div className="flex justify-between items-center bg-cream/40 p-4 rounded-2xl border border-cream-dark/60">
              <h3 className="font-serif text-lg font-bold text-charcoal-dark uppercase tracking-wider">
                Manage {activeTab}
              </h3>
              <div className="flex gap-2">
                <button 
                  onClick={fetchTabData}
                  className="p-2 bg-cream-light border border-cream-dark hover:bg-cream rounded-xl text-charcoal transition-colors focus:outline-none"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                {['services', 'programs', 'products', 'workshops', 'retreats', 'community', 'webinars', 'gratitude-assignments'].includes(activeTab) && (
                  <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-1.5 bg-sage hover:bg-sage-dark text-white font-semibold py-2 px-4 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
                  >
                    <PlusCircle className="w-4.5 h-4.5" />
                    <span>Create New</span>
                  </button>
                )}
              </div>
            </div>

            {/* Table display */}
            {loading ? (
              <div className="shimmer h-80 rounded-2xl w-full"></div>
            ) : listData.length > 0 ? (
              <div className="glass rounded-2xl border border-cream-dark/50 overflow-x-auto shadow-sm">
                <table className="w-full text-xs text-charcoal border-collapse">
                  <thead>
                    <tr className="bg-cream-dark/40 border-b border-cream-dark uppercase text-[10px] tracking-wider font-bold">
                      <th className="py-3 px-4 text-left">Details</th>
                      <th className="py-3 px-4 text-left">Identities / Extras</th>
                      <th className="py-3 px-4 text-left">Financials</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listData.map((item) => (
                      <tr key={item._id} className="border-b border-cream-dark/40 hover:bg-cream/20 transition-colors">
                        {/* Column 1: Details */}
                        <td className="py-3 px-4">
                          <p className="font-bold text-charcoal-dark">
                            {activeTab === 'gratitude-assignments'
                              ? `Day ${item.dayNumber}: ${item.title}`
                              : activeTab === 'gratitude-submissions'
                                ? `Student: ${item.user?.name} - Day ${item.dayNumber}`
                                : item.title || item.name || `Log ID: ${item._id.substring(0, 10)}`}
                          </p>
                          <p className="text-[10px] text-charcoal-light line-clamp-1 max-w-sm mt-0.5">
                            {activeTab === 'gratitude-assignments'
                              ? item.content
                              : activeTab === 'gratitude-submissions'
                                ? `Assignment: ${item.assignment?.title || 'Unknown'}`
                                : ['webinar-registrations', 'workshop-registrations', 'program-registrations', 'service-bookings'].includes(activeTab) 
                                  ? `Email: ${item.email} | Phone: ${item.phone}` 
                                  : item.description || item.shortDescription || item.reviewText || item.message || item.content || `Date: ${new Date(item.createdAt).toLocaleDateString()}`}
                          </p>
                        </td>

                        {/* Column 2: Details 2 */}
                        <td className="py-3 px-4">
                          {activeTab === 'gratitude-assignments' && (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sage font-medium">Submissions: {item.stats?.total || 0}</span>
                              <span className="text-[10px] text-charcoal-light">Approved: {item.stats?.approved || 0} | Pending: {item.stats?.pending || 0}</span>
                            </div>
                          )}
                          {activeTab === 'gratitude-submissions' && (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-charcoal-dark font-medium">{item.user?.email}</span>
                              {item.imageUrl && (
                                <a 
                                  href={getImageUrl(item.imageUrl)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sage hover:underline font-bold text-[10px] uppercase inline-block mt-0.5"
                                >
                                  View Work Proof ↗
                                </a>
                              )}
                            </div>
                          )}
                          {activeTab === 'products' && <span className="bg-cream-dark text-charcoal-light py-0.5 px-2 rounded-md font-semibold">{item.category} (Stock: {item.stock})</span>}
                          {activeTab === 'workshops' && <span className="text-sage font-medium">Slots: {item.registeredUsers?.length} / {item.capacity}</span>}
                          {activeTab === 'retreats' && <span className="text-sage font-medium">Interested: {item.interestedUsers?.length} logged</span>}
                          {activeTab === 'programs' && <span className="text-sage font-medium">Enrolled: {item.enrolledUsers?.length} / {item.enrollmentCapacity}</span>}
                          {activeTab === 'community' && <span className="bg-lavender text-charcoal-dark py-0.5 px-2 rounded-md font-semibold uppercase">{item.type}</span>}
                          {activeTab === 'contacts' && <span className="text-charcoal-light font-medium">{item.email}</span>}
                          {activeTab === 'donations' && <span className="font-mono text-charcoal-light">{item.transactionId}</span>}
                          {activeTab === 'orders' && <span className="text-charcoal-light font-medium">Status: {item.status}</span>}
                          {activeTab === 'testimonials' && <span className="text-gold">{'★'.repeat(item.rating)}</span>}
                          {activeTab === 'webinars' && <span className="text-sage font-medium">Speaker: {item.speakerName} | Date: {new Date(item.date).toLocaleDateString()}</span>}
                          {activeTab === 'webinar-registrations' && (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-charcoal-dark">Webinar: {item.webinar?.title || 'Unknown'}</span>
                              <span className="font-mono text-[10px] text-charcoal-light">TxID: {item.transactionId}</span>
                              {item.paymentScreenshot && (
                                <a 
                                  href={getImageUrl(item.paymentScreenshot)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sage hover:underline font-bold text-[10px] uppercase flex items-center gap-0.5"
                                >
                                  View Screenshot ↗
                                </a>
                              )}
                              {item.webinar && (
                                <div className="mt-2 pt-2 border-t border-cream-dark/40 flex flex-col sm:flex-row sm:items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-charcoal-light uppercase tracking-wider">Zoom Link:</span>
                                  <div className="flex gap-1.5 items-center">
                                    <input
                                      type="url"
                                      id={`zoom-link-${item._id}`}
                                      defaultValue={item.webinar.zoomLink || ''}
                                      placeholder="Paste Zoom Link here"
                                      className="bg-cream-light border border-cream-dark/80 rounded px-2 py-0.5 text-[10px] w-48 sm:w-64 focus:outline-none focus:border-sage font-mono text-charcoal"
                                    />
                                    <button
                                      onClick={async () => {
                                        const inputVal = document.getElementById(`zoom-link-${item._id}`)?.value;
                                        if (!inputVal) {
                                          alert('Please enter a Zoom Link before saving.');
                                          return;
                                        }
                                        try {
                                          await axios.put(`/api/webinars/${item.webinar._id}`, { zoomLink: inputVal });
                                          alert('Webinar Zoom Link updated successfully.');
                                          fetchTabData();
                                        } catch (err) {
                                          alert(err.response?.data?.message || 'Failed to update Zoom Link.');
                                        }
                                      }}
                                      className="bg-sage hover:bg-sage-dark text-white px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-colors shrink-0"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                          {activeTab === 'workshop-registrations' && (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-charcoal-dark">Workshop: {item.workshop?.title || 'Unknown'}</span>
                              <span className="font-mono text-[10px] text-charcoal-light">TxID: {item.transactionId}</span>
                              {item.paymentScreenshot && (
                                <a 
                                  href={getImageUrl(item.paymentScreenshot)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sage hover:underline font-bold text-[10px] uppercase flex items-center gap-0.5"
                                >
                                  View Screenshot ↗
                                </a>
                              )}
                            </div>
                          )}
                          {activeTab === 'program-registrations' && (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-charcoal-dark">Program: {item.program?.title || 'Unknown'}</span>
                              <span className="font-mono text-[10px] text-charcoal-light">TxID: {item.transactionId}</span>
                              {item.paymentScreenshot && (
                                <a 
                                  href={getImageUrl(item.paymentScreenshot)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sage hover:underline font-bold text-[10px] uppercase flex items-center gap-0.5"
                                >
                                  View Screenshot ↗
                                </a>
                              )}
                            </div>
                          )}
                          {activeTab === 'service-bookings' && (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-charcoal-dark">
                                {item.message?.split('\n')[0]?.replace('[SERVICE BOOKING REQUEST: ', '')?.replace(']', '') || 'Service Session'}
                              </span>
                              <span className="text-[10px] text-charcoal-light font-sans">
                                Slot: {item.message?.split('\n')[1]?.replace('Preferred Date: ', '') || 'Unspecified'}
                              </span>
                              {item.transactionId && <span className="font-mono text-[10px] text-charcoal-light">TxID: {item.transactionId}</span>}
                              {item.paymentScreenshot && (
                                <a 
                                  href={getImageUrl(item.paymentScreenshot)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sage hover:underline font-bold text-[10px] uppercase flex items-center gap-0.5"
                                >
                                  View Screenshot ↗
                                </a>
                              )}
                            </div>
                          )}
                          {activeTab === 'orders' && (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-charcoal-dark">Payment Type: {item.paymentType || 'RAZORPAY'}</span>
                              {item.transactionId && <span className="font-mono text-[10px] text-charcoal-light">TxID: {item.transactionId}</span>}
                              {item.paymentScreenshot && (
                                <a 
                                  href={getImageUrl(item.paymentScreenshot)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sage hover:underline font-bold text-[10px] uppercase flex items-center gap-0.5"
                                >
                                  View Screenshot ↗
                                </a>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Column 3: Pricing / Status */}
                        <td className="py-3 px-4">
                          {activeTab === 'gratitude-assignments' && (
                            <span className={`py-0.5 px-2.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              item.status === 'Active' ? 'bg-sage/10 text-sage' : 'bg-red-500/10 text-red-600'
                            }`}>
                              {item.status}
                            </span>
                          )}
                          {activeTab === 'gratitude-submissions' && (
                            <span className={`py-0.5 px-2.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              item.status === 'approved' 
                                ? 'bg-sage/10 text-sage' 
                                : item.status === 'rejected'
                                  ? 'bg-red-500/10 text-red-600'
                                  : 'bg-gold/15 text-gold-dark'
                            }`}>
                              {item.status}
                            </span>
                          )}
                          {item.pricing !== undefined && <span className="font-bold text-gold-dark">₹{item.pricing}</span>}
                          {item.price !== undefined && <span className="font-bold text-gold-dark">₹{item.price}</span>}
                          {item.totalAmount !== undefined && <span className="font-bold text-gold-dark">₹{item.totalAmount}</span>}
                          {item.amount !== undefined && <span className="font-bold text-gold-dark">₹{item.amount}</span>}
                          {item.paymentStatus && (
                            <span className={`py-0.5 px-2.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              item.paymentStatus === 'Paid' || item.paymentStatus === 'paid' || item.status === 'completed' 
                                ? 'bg-sage/10 text-sage' 
                                : item.paymentStatus === 'Rejected' || item.paymentStatus === 'rejected'
                                  ? 'bg-red-500/10 text-red-600'
                                  : 'bg-gold/15 text-gold-dark'
                            }`}>
                              {item.paymentStatus || item.status}
                            </span>
                          )}
                          {activeTab === 'service-bookings' && (
                            <span className={`py-0.5 px-2.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                              item.status === 'resolved' 
                                ? 'bg-sage/10 text-sage' 
                                : 'bg-gold/15 text-gold-dark'
                            }`}>
                              {item.status === 'resolved' ? 'Approved / Resolved' : 'Pending Verification'}
                            </span>
                          )}
                          {item.status && !item.paymentStatus && !['gratitude-assignments', 'gratitude-submissions', 'service-bookings'].includes(activeTab) && (
                            <span className="bg-cream-dark text-charcoal-light py-0.5 px-2 rounded-full text-[9px] font-bold uppercase tracking-wider ml-1">
                              {item.status}
                            </span>
                          )}
                        </td>

                        {/* Column 4: Actions */}
                        <td className="py-3 px-4 text-right flex justify-end gap-1.5 items-center">
                          {/* View Registrants/Inquiries Button */}
                          {['workshops', 'retreats', 'programs', 'orders', 'contacts', 'donations', 'service-bookings', 'gratitude-assignments', 'gratitude-submissions'].includes(activeTab) && (
                            <button
                              onClick={() => handleOpenView(item)}
                              className="p-1.5 hover:text-sage text-charcoal/60 transition-colors focus:outline-none"
                              title="View registrations / details"
                            >
                              <Eye className="w-4.5 h-4.5" />
                            </button>
                          )}

                          {/* Edit Button */}
                          {['services', 'programs', 'products', 'workshops', 'retreats', 'community', 'webinars', 'gratitude-assignments'].includes(activeTab) && (
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 hover:text-gold text-charcoal/60 transition-colors focus:outline-none"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Custom quick Actions */}
                          {activeTab === 'donations' && item.status === 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(item._id, 'status', 'completed')}
                              className="p-1 text-sage hover:text-sage-dark focus:outline-none font-bold text-[10px] uppercase border border-sage/40 rounded px-1.5"
                            >
                              Approve
                            </button>
                          )}
                          {activeTab === 'contacts' && item.status === 'unread' && (
                            <button
                              onClick={() => handleUpdateStatus(item._id, 'status', 'resolved')}
                              className="p-1 text-sage hover:text-sage-dark focus:outline-none font-bold text-[10px] uppercase border border-sage/40 rounded px-1.5"
                            >
                              Resolve
                            </button>
                          )}
                          {activeTab === 'service-bookings' && item.status === 'unread' && (
                            <button
                              onClick={() => handleUpdateStatus(item._id, 'status', 'resolved')}
                              className="p-1 text-sage hover:text-sage-dark focus:outline-none font-bold text-[10px] uppercase border border-sage/40 rounded px-1.5"
                            >
                              Approve
                            </button>
                          )}
                          {/* Webinar Approval/Rejection Buttons */}
                          {activeTab === 'webinar-registrations' && item.paymentStatus === 'Pending' && (
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => handleApproveRegistration(item._id)}
                                className="p-1 text-sage hover:text-sage-dark focus:outline-none font-bold text-[9px] uppercase border border-sage/40 rounded px-1.5 bg-sage/5"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectRegistration(item._id)}
                                className="p-1 text-red-500 hover:text-red-700 focus:outline-none font-bold text-[9px] uppercase border border-red-500/40 rounded px-1.5 bg-red-500/5"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {/* Workshop Approval/Rejection Buttons */}
                          {activeTab === 'workshop-registrations' && item.paymentStatus === 'Pending' && (
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => handleApproveWorkshopRegistration(item._id)}
                                className="p-1 text-sage hover:text-sage-dark focus:outline-none font-bold text-[9px] uppercase border border-sage/40 rounded px-1.5 bg-sage/5"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectWorkshopRegistration(item._id)}
                                className="p-1 text-red-500 hover:text-red-700 focus:outline-none font-bold text-[9px] uppercase border border-red-500/40 rounded px-1.5 bg-red-500/5"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {/* Program Approval/Rejection Buttons */}
                          {activeTab === 'program-registrations' && item.paymentStatus === 'Pending' && (
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => handleApproveProgramRegistration(item._id)}
                                className="p-1 text-sage hover:text-sage-dark focus:outline-none font-bold text-[9px] uppercase border border-sage/40 rounded px-1.5 bg-sage/5"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectProgramRegistration(item._id)}
                                className="p-1 text-red-500 hover:text-red-700 focus:outline-none font-bold text-[9px] uppercase border border-red-500/40 rounded px-1.5 bg-red-500/5"
                              >
                                Reject
                              </button>
                            </div>
                          )}

                          {/* Order UPI Payment Approval Button */}
                          {activeTab === 'orders' && item.paymentType === 'UPI_QR' && item.paymentStatus === 'pending' && (
                            <button
                              onClick={() => handleApproveOrderPayment(item._id)}
                              className="p-1 text-sage hover:text-sage-dark focus:outline-none font-bold text-[9px] uppercase border border-sage/40 rounded px-1.5 bg-sage/5"
                            >
                              Approve Payment
                            </button>
                          )}

                          {/* Delete Button */}
                          {['services', 'programs', 'products', 'workshops', 'retreats', 'community', 'testimonials', 'webinars', 'webinar-registrations', 'workshop-registrations', 'program-registrations', 'service-bookings', 'gratitude-assignments'].includes(activeTab) && (
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-1.5 hover:text-red-600 text-charcoal/60 transition-colors focus:outline-none"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-20 text-center glass rounded-2xl">
                <p className="text-xs text-charcoal-light">No records found inside this collection database.</p>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Main Form/Viewer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass max-w-lg w-full rounded-2xl shadow-xl overflow-hidden animate-slide-up max-h-[85vh] flex flex-col text-left">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-cream-dark shrink-0">
              <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider">
                {modalMode === 'view' ? 'Review Details' : modalMode === 'edit' ? 'Edit Details' : 'Create Record'}
              </h3>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setSelectedUserProgress(null);
                  setProgramProgressList([]);
                }}
                className="p-1 text-charcoal hover:text-gold transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto text-xs text-charcoal font-sans flex flex-col gap-4">
              {modalMode === 'view' ? (
                /* ---------------- VIEW MODE PANELS ---------------- */
                <div className="flex flex-col gap-4 font-sans text-xs">
                  {/* Workshop registrations details */}
                  {activeTab === 'workshops' && (
                    <div className="flex flex-col gap-3">
                      <h4 className="font-bold text-charcoal-dark border-b pb-1">Participants Registered ({selectedItem.registeredUsers?.length})</h4>
                      {selectedItem.registeredUsers?.length > 0 ? (
                        <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                          {selectedItem.registeredUsers.map((reg, idx) => (
                            <div key={idx} className="bg-cream p-3 rounded-xl border flex flex-col gap-0.5 text-[11px]">
                              <p className="font-bold text-charcoal-dark">{reg.name} ({reg.phone})</p>
                              <p className="text-charcoal-light">Email: {reg.email}</p>
                              <p className="text-[10px] text-sage font-medium mt-1">Status: {reg.paymentStatus} | Ref: {reg.paymentId}</p>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-charcoal-light">No participants registered yet.</p>}
                    </div>
                  )}

                  {/* Webinar specific details */}
                  {activeTab === 'webinars' && (
                    <div className="flex flex-col gap-3">
                      <h4 className="font-bold text-charcoal-dark border-b pb-1">Webinar Specifics</h4>
                      <div className="flex flex-col gap-1.5 leading-relaxed">
                        <p><strong>Speaker:</strong> {selectedItem.speakerName}</p>
                        <p><strong>Date & Time:</strong> {new Date(selectedItem.date).toLocaleDateString()} at {selectedItem.time}</p>
                        <p><strong>Duration:</strong> {selectedItem.duration}</p>
                        <p><strong>Price:</strong> ₹{selectedItem.price}</p>
                        <p><strong>UPI ID:</strong> {selectedItem.upiId}</p>
                        <p><strong>Zoom Link:</strong> <a href={selectedItem.zoomLink} target="_blank" rel="noopener noreferrer" className="text-sage font-bold hover:underline">{selectedItem.zoomLink}</a></p>
                        <p><strong>Capacity:</strong> {selectedItem.maxSeats} seats max</p>
                        <p><strong>Status:</strong> {selectedItem.status}</p>
                        {selectedItem.coverImage && (
                          <div className="mt-2">
                            <span className="font-bold block mb-1">Cover Image:</span>
                            <img src={getImageUrl(selectedItem.coverImage)} className="w-full h-32 object-cover rounded-xl border animate-fade-in" />
                          </div>
                        )}
                        {selectedItem.upiQrCodeImage && (
                          <div className="mt-2">
                            <span className="font-bold block mb-1">UPI QR Code Image:</span>
                            <img src={getImageUrl(selectedItem.upiQrCodeImage)} className="w-32 h-32 object-contain rounded-xl border bg-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Retreat interest list */}
                  {activeTab === 'retreats' && (
                    <div className="flex flex-col gap-3">
                      <h4 className="font-bold text-charcoal-dark border-b pb-1">Inquiries & Bookings</h4>
                      {selectedItem.interestedUsers?.length > 0 ? (
                        <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                          {selectedItem.interestedUsers.map((inq, idx) => (
                            <div key={idx} className="bg-cream p-3 rounded-xl border flex flex-col gap-1 text-[11px]">
                              <div className="flex justify-between items-center">
                                <p className="font-bold text-charcoal-dark">{inq.name} ({inq.phone})</p>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                  inq.bookedStatus === 'booked' ? 'bg-sage/10 text-sage' : 'bg-cream-dark text-charcoal-light'
                                }`}>
                                  {inq.bookedStatus}
                                </span>
                              </div>
                              <p className="text-charcoal-light">Email: {inq.email}</p>
                              {inq.message && <p className="bg-white/60 p-2 rounded text-[10px] italic border mt-1">Message: "{inq.message}"</p>}
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-charcoal-light">No bookings/interest inquiries logged yet.</p>}
                    </div>
                  )}

                  {/* Gratitude Assignments detail view */}
                  {activeTab === 'gratitude-assignments' && (
                    <div className="flex flex-col gap-3">
                      <h4 className="font-bold text-charcoal-dark border-b pb-1">Assignment Details</h4>
                      <div className="flex flex-col gap-1.5 leading-relaxed text-[11.5px]">
                        <p><strong>Day Number:</strong> {selectedItem.dayNumber}</p>
                        <p><strong>Title:</strong> {selectedItem.title}</p>
                        <p><strong>Estimated Duration:</strong> {selectedItem.estimatedDuration}</p>
                        <p><strong>Status:</strong> {selectedItem.status}</p>
                        {selectedItem.image && (
                          <div className="mt-2">
                            <span className="font-bold block mb-1">Image:</span>
                            <img src={getImageUrl(selectedItem.image)} className="w-full h-32 object-cover rounded-xl border" />
                          </div>
                        )}
                        <div className="mt-2">
                          <span className="font-bold block mb-1">Content:</span>
                          <div className="bg-cream p-3 rounded-lg border whitespace-pre-wrap max-h-48 overflow-y-auto font-medium">
                            {selectedItem.content}
                          </div>
                        </div>
                        <div className="mt-2 border-t pt-2">
                          <h5 className="font-bold text-charcoal-dark uppercase text-[9px] tracking-wider">Submissions Statistics</h5>
                          <p className="mt-1">Total Submissions: <strong>{selectedItem.stats?.total || 0}</strong></p>
                          <p>Approved: <strong>{selectedItem.stats?.approved || 0}</strong> | Pending: <strong>{selectedItem.stats?.pending || 0}</strong></p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gratitude Submissions review/detail view */}
                  {activeTab === 'gratitude-submissions' && (
                    <div className="flex flex-col gap-3">
                      <h4 className="font-bold text-charcoal-dark border-b pb-1">Review User Submission</h4>
                      <div className="bg-cream p-3.5 rounded-xl border flex flex-col gap-1.5 leading-relaxed text-[11.5px]">
                        <p><strong>User:</strong> {selectedItem.user?.name} ({selectedItem.user?.email})</p>
                        <p><strong>Assignment:</strong> Day {selectedItem.dayNumber} - {selectedItem.assignment?.title}</p>
                        <p><strong>Submitted At:</strong> {new Date(selectedItem.submittedAt).toLocaleString()}</p>
                        <p><strong>Status:</strong> <span className="font-bold uppercase">{selectedItem.status}</span></p>
                        {selectedItem.adminComment && (
                          <p className="bg-white p-2 rounded border italic"><strong>Comment:</strong> "{selectedItem.adminComment}"</p>
                        )}
                        {selectedItem.imageUrl && (
                          <div className="mt-2">
                            <span className="font-bold block mb-1">Uploaded Proof:</span>
                            <a href={getImageUrl(selectedItem.imageUrl)} target="_blank" rel="noopener noreferrer">
                              <img src={getImageUrl(selectedItem.imageUrl)} className="w-full max-h-64 object-contain rounded-xl border bg-white cursor-zoom-in" />
                            </a>
                            <span className="text-[9px] text-charcoal-light block text-center mt-1">(Click image to view full resolution ↗)</span>
                          </div>
                        )}
                      </div>

                      {selectedItem.status === 'pending' && (
                        <div className="flex flex-col gap-3 mt-2 border-t pt-3">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-charcoal-light uppercase text-[10px]">Admin Review Comments (Optional for approval, recommended for rejection)</label>
                            <textarea
                              rows="2"
                              placeholder="Add feedback for the student..."
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none text-[11px]"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleReviewSubmission('approved')}
                              className="flex-1 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl text-center text-xs uppercase tracking-wider transition-colors shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReviewSubmission('rejected')}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-center text-xs uppercase tracking-wider transition-colors shadow-sm"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Program enrollment list */}
                  {activeTab === 'programs' && (
                    <div className="flex flex-col gap-3 text-left">
                      {selectedUserProgress ? (
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-between items-center border-b pb-2">
                            <h4 className="font-bold text-charcoal-dark text-[12px] uppercase tracking-wider">
                              Submissions: {selectedUserProgress.user?.name}
                            </h4>
                            <button
                              onClick={() => setSelectedUserProgress(null)}
                              className="text-[9px] bg-cream hover:bg-cream-dark border py-1 px-3 rounded-lg font-bold transition-all uppercase tracking-wider"
                            >
                              ← Back to Students
                            </button>
                          </div>
                          
                          <p className="text-[10px] text-charcoal-light">
                            Current Day: <strong className="text-charcoal-dark">Day {selectedUserProgress.currentDay}</strong> | Completed: <strong className="text-charcoal-dark">{selectedUserProgress.completed ? 'Yes' : 'No'}</strong>
                          </p>

                          {selectedUserProgress.submissions?.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto pt-2">
                              {selectedUserProgress.submissions.map((sub, idx) => (
                                <div key={idx} className="border rounded-lg overflow-hidden bg-cream p-1 text-[10px] flex flex-col gap-1">
                                  <div className="h-16 bg-cream-dark/20 relative">
                                    <img 
                                      src={getImageUrl(sub.photo)} 
                                      alt={`Day ${sub.day}`} 
                                      className="w-full h-full object-cover" 
                                    />
                                    <a
                                      href={getImageUrl(sub.photo)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="absolute inset-0 bg-charcoal/20 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold"
                                    >
                                      Full Image ↗
                                    </a>
                                  </div>
                                  <div className="flex justify-between font-bold text-charcoal-dark px-1">
                                    <span>Day {sub.day}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-charcoal-light py-4 text-center font-medium">No assignments submitted yet.</p>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <h4 className="font-bold text-charcoal-dark border-b pb-1">Enrolled Students</h4>
                          {loadingProgressList ? (
                            <div className="shimmer h-24 rounded-xl"></div>
                          ) : selectedItem.enrolledUsers?.length > 0 ? (
                            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                              {selectedItem.enrolledUsers.map((stu, idx) => {
                                // Find progress
                                const userProg = programProgressList.find(p => p.user?._id === stu._id);
                                return (
                                  <div key={idx} className="bg-cream p-2.5 px-3.5 rounded-xl border flex justify-between items-center text-[11px] gap-2">
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                      <span className="font-bold text-charcoal-dark truncate">{stu.name}</span>
                                      <span className="text-charcoal-light truncate text-[10px]">{stu.email}</span>
                                      {userProg && (
                                        <span className="text-[9px] text-sage font-bold uppercase mt-0.5">
                                          Progress: Day {userProg.currentDay} / 30 {userProg.completed && '✓'}
                                        </span>
                                      )}
                                    </div>
                                    {selectedItem.title.toLowerCase().includes('gratitude') && userProg ? (
                                      <button
                                        onClick={() => setSelectedUserProgress(userProg)}
                                        className="bg-sage/10 text-sage hover:bg-sage hover:text-white text-xs font-bold py-1.5 px-3 rounded-lg border border-sage/20 shrink-0 transition-all"
                                      >
                                        View Submissions
                                      </button>
                                    ) : (
                                      <span className="text-charcoal-light text-[9px] italic shrink-0">No active progress</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          ) : <p className="text-charcoal-light">No students enrolled yet.</p>}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Order shipment details */}
                  {activeTab === 'orders' && (
                    <div className="flex flex-col gap-3">
                      <h4 className="font-bold text-charcoal-dark border-b pb-1">Customer Order Shipment</h4>
                      <div className="bg-cream p-3.5 rounded-xl border flex flex-col gap-1 leading-relaxed text-left">
                        <p><strong>Customer:</strong> {selectedItem.user?.name} ({selectedItem.user?.email})</p>
                        <p><strong>Shipping Address:</strong> {selectedItem.shippingAddress?.address}, {selectedItem.shippingAddress?.city}, {selectedItem.shippingAddress?.state} - {selectedItem.shippingAddress?.postalCode}, {selectedItem.shippingAddress?.country}</p>
                        <p><strong>Contact Phone:</strong> {selectedItem.shippingAddress?.phone}</p>
                        {selectedItem.paymentType === 'UPI_QR' && (
                          <>
                            <p><strong>Payment Type:</strong> UPI QR Code</p>
                            <p><strong>Transaction ID:</strong> {selectedItem.transactionId}</p>
                            {selectedItem.paymentScreenshot && (
                              <p>
                                <strong>Receipt Screenshot:</strong>{' '}
                                <a 
                                  href={getImageUrl(selectedItem.paymentScreenshot)} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-sage font-bold hover:underline"
                                >
                                  View Screenshot ↗
                                </a>
                              </p>
                            )}
                          </>
                        )}
                      </div>

                      {/* Update Shipping Status */}
                      <div className="flex flex-col gap-1.5 mt-2">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Update shipment Status</label>
                        <select
                          value={selectedItem.status}
                          onChange={(e) => handleUpdateStatus(selectedItem._id, 'status', e.target.value)}
                          className="bg-cream-light border border-cream-dark/65 rounded-xl py-2 px-3 focus:outline-none"
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Donation verify logs details */}
                  {activeTab === 'donations' && (
                    <div className="flex flex-col gap-3">
                      <h4 className="font-bold text-charcoal-dark border-b pb-1">Donation Transaction Verification</h4>
                      <div className="bg-cream p-3.5 rounded-xl border flex flex-col gap-1 text-[11.5px] leading-relaxed">
                        <p><strong>Donor:</strong> {selectedItem.name} ({selectedItem.email || 'N/A'})</p>
                        <p><strong>Contact phone:</strong> {selectedItem.phone || 'N/A'}</p>
                        <p><strong>Type:</strong> {selectedItem.paymentType} | Ref Ref: {selectedItem.transactionId}</p>
                        {selectedItem.message && <p className="italic">Message: "{selectedItem.message}"</p>}
                      </div>
                      
                      {selectedItem.status === 'pending' && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => {
                              handleUpdateStatus(selectedItem._id, 'status', 'completed');
                              setShowModal(false);
                            }}
                            className="flex-1 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl text-center"
                          >
                            Mark Completed (Verified Funds)
                          </button>
                          <button
                            onClick={() => {
                              handleUpdateStatus(selectedItem._id, 'status', 'failed');
                              setShowModal(false);
                            }}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-center"
                          >
                            Mark Failed
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contact detail query viewer */}
                  {activeTab === 'contacts' && (
                    <div className="flex flex-col gap-3">
                      <h4 className="font-bold text-charcoal-dark border-b pb-1">Message Query Details</h4>
                      <div className="bg-cream p-4 rounded-xl border flex flex-col gap-1 leading-relaxed text-[11.5px]">
                        <p><strong>Sender:</strong> {selectedItem.name}</p>
                        <p><strong>Contact Email:</strong> {selectedItem.email}</p>
                        <p><strong>Phone:</strong> {selectedItem.phone || 'N/A'}</p>
                        <p className="mt-2 border-t pt-2 font-sans italic text-charcoal">"{selectedItem.message}"</p>
                      </div>

                      {selectedItem.status === 'unread' && (
                        <button
                          onClick={() => {
                            handleUpdateStatus(selectedItem._id, 'status', 'resolved');
                            setShowModal(false);
                          }}
                          className="bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl text-center mt-2"
                        >
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  )}
                  {/* Service Booking detail query viewer */}
                  {activeTab === 'service-bookings' && (
                    <div className="flex flex-col gap-3">
                      <h4 className="font-bold text-charcoal-dark border-b pb-1">Service Booking Details</h4>
                      <div className="bg-cream p-4 rounded-xl border flex flex-col gap-1.5 leading-relaxed text-[11.5px] font-sans">
                        <p><strong>Customer Name:</strong> {selectedItem.name}</p>
                        <p><strong>Email Address:</strong> {selectedItem.email}</p>
                        <p><strong>WhatsApp Number:</strong> {selectedItem.phone || 'N/A'}</p>
                        <p><strong>Transaction ID:</strong> {selectedItem.transactionId || 'N/A'}</p>
                        {selectedItem.paymentScreenshot && (
                          <p>
                            <strong>Payment Receipt:</strong>{' '}
                            <a 
                              href={getImageUrl(selectedItem.paymentScreenshot)} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-sage font-bold hover:underline"
                            >
                              View Screenshot ↗
                            </a>
                          </p>
                        )}
                        <p className="mt-2 border-t pt-2 italic text-charcoal">"{selectedItem.message}"</p>
                      </div>

                      {selectedItem.status === 'unread' && (
                        <button
                          onClick={() => {
                            handleUpdateStatus(selectedItem._id, 'status', 'resolved');
                            setShowModal(false);
                          }}
                          className="bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl text-center mt-2"
                        >
                          Approve / Mark Resolved
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* ---------------- CREATE / EDIT FORM FIELDS ---------------- */
                <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 text-[11.5px] text-charcoal">
                  {/* GRATITUDE ASSIGNMENTS Form */}
                  {activeTab === 'gratitude-assignments' && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Day Number</label>
                          <input type="number" required value={assignmentDayNumber} onChange={(e) => setAssignmentDayNumber(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Estimated Duration</label>
                          <input type="text" required placeholder="e.g. 20 minutes" value={assignmentDuration} onChange={(e) => setAssignmentDuration(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Assignment Title</label>
                        <input type="text" required value={assignmentTitle} onChange={(e) => setAssignmentTitle(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Assignment Content (Journal Prompts / Instructions)</label>
                        <textarea required rows="8" value={assignmentContent} onChange={(e) => setAssignmentContent(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none leading-relaxed text-[11px]" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Optional Image File</label>
                          <input type="file" accept="image/*" onChange={(e) => setAssignmentImage(e.target.files[0])} className="text-xs file:bg-cream file:border file:border-cream-dark file:rounded-lg file:py-1 file:px-2" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Status</label>
                          <select value={assignmentStatus} onChange={(e) => setAssignmentStatus(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none">
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {/* SERVICES Form */}
                  {activeTab === 'services' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Service Title</label>
                        <input type="text" required value={serviceTitle} onChange={(e) => setServiceTitle(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Description</label>
                        <textarea required rows="3" value={serviceDesc} onChange={(e) => setServiceDesc(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Benefits (comma separated)</label>
                        <input type="text" value={serviceBenefits} onChange={(e) => setServiceBenefits(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Duration (mins)</label>
                          <input type="number" required value={serviceDuration} onChange={(e) => setServiceDuration(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Price (INR)</label>
                          <input type="number" required value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* PRODUCTS Form */}
                  {activeTab === 'products' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Product Name</label>
                        <input type="text" required value={productName} onChange={(e) => setProductName(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Description</label>
                        <textarea required rows="3" value={productDesc} onChange={(e) => setProductDesc(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Price (INR)</label>
                          <input type="number" required value={productPrice} onChange={(e) => setProductPrice(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Category</label>
                          <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none">
                            <option value="Crystals">Crystals</option>
                            <option value="Lamps">Lamps</option>
                            <option value="Candles">Candles</option>
                            <option value="Crystal Trees">Crystal Trees</option>
                            <option value="Pendants">Pendants</option>
                            <option value="Bracelets">Bracelets</option>
                            <option value="Healing Stones">Healing Stones</option>
                            <option value="Selenite Products">Selenite Products</option>
                            <option value="Trays">Trays</option>
                            <option value="Decorative Pieces">Decorative Pieces</option>
                            <option value="Wax Melts">Wax Melts</option>
                            <option value="Bath Salts">Bath Salts</option>
                            <option value="Healing Oils">Healing Oils</option>
                            <option value="Healing Camphor">Healing Camphor</option>
                            <option value="Wax Tablets">Wax Tablets</option>
                            <option value="Sage Leaves">Sage Leaves</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Stock Count</label>
                          <input type="number" required value={productStock} onChange={(e) => setProductStock(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                      </div>
                    </>
                  )}

                  {/* WORKSHOPS Form */}
                  {activeTab === 'workshops' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Workshop Title</label>
                        <input type="text" required value={workshopTitle} onChange={(e) => setWorkshopTitle(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Description</label>
                        <textarea required rows="3" value={workshopDesc} onChange={(e) => setWorkshopDesc(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Date</label>
                          <input type="date" required value={workshopDate} onChange={(e) => setWorkshopDate(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Time</label>
                          <input type="text" required placeholder="e.g. 4:00 PM - 6:00 PM" value={workshopTime} onChange={(e) => setWorkshopTime(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Price (INR)</label>
                          <input type="number" required value={workshopPrice} onChange={(e) => setWorkshopPrice(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Capacity</label>
                          <input type="number" required value={workshopCapacity} onChange={(e) => setWorkshopCapacity(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Zoom Link (Optional)</label>
                        <input type="url" value={workshopZoomLink} onChange={(e) => setWorkshopZoomLink(e.target.value)} placeholder="Enter Zoom link for tomorrow's emails" className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                    </>
                  )}

                  {/* WEBINARS Form */}
                  {activeTab === 'webinars' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Webinar Title</label>
                        <input type="text" required value={webinarTitle} onChange={(e) => setWebinarTitle(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Speaker Name</label>
                        <input type="text" required value={webinarSpeaker} onChange={(e) => setWebinarSpeaker(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Short Description</label>
                        <textarea required rows="2" value={webinarShortDesc} onChange={(e) => setWebinarShortDesc(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Detailed Description</label>
                        <textarea required rows="4" value={webinarDetailedDesc} onChange={(e) => setWebinarDetailedDesc(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Date</label>
                          <input type="date" required value={webinarDate} onChange={(e) => setWebinarDate(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Time</label>
                          <input type="text" required placeholder="e.g. 4:00 PM - 5:30 PM" value={webinarTime} onChange={(e) => setWebinarTime(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Duration</label>
                          <input type="text" required placeholder="e.g. 90 mins" value={webinarDuration} onChange={(e) => setWebinarDuration(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Price (INR)</label>
                          <input type="number" required value={webinarPrice} onChange={(e) => setWebinarPrice(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Maximum Seats</label>
                          <input type="number" required value={webinarMaxSeats} onChange={(e) => setWebinarMaxSeats(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">UPI ID</label>
                        <input type="text" required placeholder="name@upi" value={webinarUpiId} onChange={(e) => setWebinarUpiId(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none font-mono" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Zoom Meeting Link</label>
                        <input type="url" required value={webinarZoomLink} onChange={(e) => setWebinarZoomLink(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Cover Image</label>
                          <input type="file" accept="image/*" onChange={(e) => setWebinarCover(e.target.files[0])} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">UPI QR Code Image</label>
                          <input type="file" accept="image/*" onChange={(e) => setWebinarQr(e.target.files[0])} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Status</label>
                        <select value={webinarStatus} onChange={(e) => setWebinarStatus(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none">
                          <option value="Upcoming">Upcoming</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* PROGRAMS Form */}
                  {activeTab === 'programs' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Program Title</label>
                        <input type="text" required value={programTitle} onChange={(e) => setProgramTitle(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Description</label>
                        <textarea required rows="3" value={programDesc} onChange={(e) => setProgramDesc(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Duration Description</label>
                        <input type="text" required placeholder="e.g. 4 weeks (12 sessions)" value={programDuration} onChange={(e) => setProgramDuration(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Price (INR)</label>
                          <input type="number" required value={programPrice} onChange={(e) => setProgramPrice(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Enrollment capacity limit</label>
                          <input type="number" required value={programCapacity} onChange={(e) => setProgramCapacity(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">YouTube Embed URL (Optional)</label>
                        <input type="text" placeholder="e.g. https://www.youtube.com/embed/..." value={programYoutubeUrl} onChange={(e) => setProgramYoutubeUrl(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                    </>
                  )}

                  {/* COMMUNITY Post Form */}
                  {activeTab === 'community' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Post Title</label>
                        <input type="text" required value={postTitle} onChange={(e) => setPostTitle(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Post Content</label>
                        <textarea required rows="4" value={postContent} onChange={(e) => setPostContent(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Post Type</label>
                        <select value={postType} onChange={(e) => setPostType(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none">
                          <option value="update">Update Feed</option>
                          <option value="announcement">Announcement banner</option>
                          <option value="event">Upcoming event details</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* RETREATS Form */}
                  {activeTab === 'retreats' && (
                    <>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Retreat Title</label>
                        <input type="text" required value={retreatTitle} onChange={(e) => setRetreatTitle(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Description</label>
                        <textarea required rows="3" value={retreatDesc} onChange={(e) => setRetreatDesc(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Price (INR)</label>
                          <input type="number" required value={retreatPrice} onChange={(e) => setRetreatPrice(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-light uppercase text-[10px]">Capacity Limit</label>
                          <input type="number" required value={retreatCapacity} onChange={(e) => setRetreatCapacity(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Itinerary JSON (raw array)</label>
                        <textarea rows="5" required value={retreatItinerary} onChange={(e) => setRetreatItinerary(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 font-mono text-[10px] focus:outline-none" />
                      </div>
                    </>
                  )}

                  {/* Modal Action Buttons */}
                  <div className="flex gap-3 border-t border-cream-dark/65 pt-4 mt-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="w-1/3 bg-cream hover:bg-cream-dark border border-cream-dark/50 text-charcoal font-bold py-2.5 rounded-xl text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl text-center uppercase tracking-wider"
                    >
                      {modalMode === 'create' ? 'Create Record' : 'Save Modifications'}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
