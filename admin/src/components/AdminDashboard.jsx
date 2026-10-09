import React, { useState, useEffect } from 'react';
import { 
  Compass, Eye, Edit2, Trash2, PlusCircle, CheckCircle, 
  X, RefreshCw, Layers, ShieldCheck, ShoppingBag, 
  Calendar, MapPin, DollarSign, MessageCircle, FileText, Smile,
  Share2, Copy, Check, Sparkles, Users, Activity, BarChart3, Globe,
  Smartphone, Laptop, Tablet, Search, Shield, UserCheck, Radio, Clock,
  ExternalLink, UserX, CheckCircle2, AlertCircle
} from 'lucide-react';
import axios from 'axios';
import logo from '../assets/logo.png';

const getImageUrl = (path) => {
  if (!path || path === 'razorpay_online') return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || axios.defaults.baseURL || (typeof window !== 'undefined' ? window.location.origin : '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (apiBase && !apiBase.includes('localhost') && !apiBase.startsWith('http')) {
    return `https://${apiBase}${cleanPath}`;
  }
  return apiBase ? `${apiBase.replace(/\/$/, '')}${cleanPath}` : cleanPath;
};

const formatTimeAgo = (date) => {
  if (!date) return 'Never';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Recently';
    const diffMs = Date.now() - d.getTime();
    if (diffMs < 0) return 'Just now';
    const seconds = Math.floor(diffMs / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return d.toLocaleDateString();
  } catch (e) {
    return 'Recently';
  }
};

const INDEXABLE_PAGES = [
  {
    title: 'Homepage / Divine Ascension Hub',
    path: '/',
    url: 'https://ascension.ind.in/',
    category: 'Core',
    priority: '1.0 (Highest)',
    changefreq: 'Daily',
    description: 'Main landing gateway with spiritual master intro, services, aura photography & instant booking.',
    targetKeywords: 'Spiritual Healing, Theta Healing, Sound Healing, Sonali Bhasin Kumar',
    inSitemap: true,
    status: 'Ready for Indexing'
  },
  {
    title: 'Navratri 9-Day Sacred Program',
    path: '/programs/6a4963f49e941f93f91f5ac5',
    url: 'https://ascension.ind.in/programs/6a4963f49e941f93f91f5ac5',
    category: 'Programs',
    priority: '0.9 (High)',
    changefreq: 'Daily',
    description: '9-Day Divine Navratri Transformation, Daily Audiobooks of Maa Durga 9 Swaroop, sacred mantras & reflections.',
    targetKeywords: '9 Days Navratri Sadhana, Maa Durga Audiobooks, Sacred Mantras, Navratri Online Program',
    inSitemap: true,
    status: 'Ready for Indexing'
  },
  {
    title: 'All Programs & Courses Hub',
    path: '/programs',
    url: 'https://ascension.ind.in/programs',
    category: 'Programs',
    priority: '0.9 (High)',
    changefreq: 'Weekly',
    description: 'Complete catalog of guided spiritual programs, ancestral healing, gratitude mastery and meditation cohorts.',
    targetKeywords: 'Ancestral Healing Course, Gratitude Mastery, Spiritual Online Workshops',
    inSitemap: true,
    status: 'Ready for Indexing'
  },
  {
    title: 'Ancestral Healing Program Details',
    path: '/ancestral-healing-program',
    url: 'https://ascension.ind.in/ancestral-healing-program',
    category: 'Programs',
    priority: '0.9 (High)',
    changefreq: 'Weekly',
    description: 'Deep clearing of generational trauma, Pitrudosh Nivaran, bloodline healing and family karma transformation.',
    targetKeywords: 'Pitrudosh Nivaran, Ancestral Trauma Healing, Generational Karma Release',
    inSitemap: true,
    status: 'Ready for Indexing'
  },
  {
    title: 'Spiritual Services & Theta Sessions',
    path: '/services',
    url: 'https://ascension.ind.in/services',
    category: 'Services',
    priority: '0.8 (High)',
    changefreq: 'Weekly',
    description: '1-on-1 private spiritual sessions including Theta Healing, Sound Bath, Tarot, Chakra Balancing and Life Coaching.',
    targetKeywords: 'Theta Healing Sessions, Sound Therapy Delhi, Spiritual Life Coach India',
    inSitemap: true,
    status: 'Ready for Indexing'
  },
  {
    title: 'Spiritual Crystals & Energized Shop',
    path: '/shop',
    url: 'https://ascension.ind.in/shop',
    category: 'Shop',
    priority: '0.8 (High)',
    changefreq: 'Daily',
    description: '100% natural, energized healing crystals, Pyrite abundance stones, Selenite, healing oils, and bracelets.',
    targetKeywords: 'Authentic Pyrite India, Selenite Crystal Lamps, Energized Healing Crystals',
    inSitemap: true,
    status: 'Ready for Indexing'
  },
  {
    title: 'About Sonali Bhasin Kumar & Ascension',
    path: '/about',
    url: 'https://ascension.ind.in/about',
    category: 'About',
    priority: '0.8 (Medium)',
    changefreq: 'Monthly',
    description: 'Founder story, spiritual credentials, media features, mission, and philosophy of Ascension Healer.',
    targetKeywords: 'Sonali Bhasin Kumar Bio, Spiritual Master Delhi, Healer Ascension',
    inSitemap: true,
    status: 'Ready for Indexing'
  },
  {
    title: 'Sacred Community Forum & Feeds',
    path: '/community',
    url: 'https://ascension.ind.in/community',
    category: 'Community',
    priority: '0.7 (Medium)',
    changefreq: 'Daily',
    description: 'Global spiritual devotee forum, daily inspirational reflections, announcement board and collective prayers.',
    targetKeywords: 'Spiritual Devotees Community, Daily Meditations, Spiritual Discussion Forum',
    inSitemap: true,
    status: 'Ready for Indexing'
  },
  {
    title: 'Live Webinars & Masterclasses',
    path: '/webinars',
    url: 'https://ascension.ind.in/webinars',
    category: 'Webinars',
    priority: '0.7 (Medium)',
    changefreq: 'Weekly',
    description: 'Live interactive spiritual webinars, zoom meditations, full moon rituals, and masterclasses.',
    targetKeywords: 'Spiritual Webinars Live, Zoom Meditation Classes India',
    inSitemap: true,
    status: 'Ready for Indexing'
  },
  {
    title: 'Ancestral Healing Special Webinar',
    path: '/ancestral-healing-webinar',
    url: 'https://ascension.ind.in/ancestral-healing-webinar',
    category: 'Webinars',
    priority: '0.7 (Medium)',
    changefreq: 'Weekly',
    description: 'Live 90-min masterclass with Sonali Bhasin Kumar on uncovering family shadow patterns & karmic clearance.',
    targetKeywords: 'Pitru Paksha Live Webinar, Ancestral Healing Workshop',
    inSitemap: true,
    status: 'Ready for Indexing'
  },
  {
    title: 'NGO & Social Seva Projects',
    path: '/ngo',
    url: 'https://ascension.ind.in/ngo',
    category: 'Seva',
    priority: '0.7 (Medium)',
    changefreq: 'Monthly',
    description: 'Shiksha Kendra for underprivileged children, animal rescue, medical aid, and community food drives.',
    targetKeywords: 'NGO Delhi NCR, Animal Welfare Seva, Free Child Education NGO',
    inSitemap: true,
    status: 'Ready for Indexing'
  },
  {
    title: 'CSR Corporate Initiatives',
    path: '/csr',
    url: 'https://ascension.ind.in/csr',
    category: 'Seva',
    priority: '0.7 (Medium)',
    changefreq: 'Monthly',
    description: 'Corporate social responsibility partnerships, employee wellness, educational kits, and sustainable seva.',
    targetKeywords: 'CSR Partnerships Delhi, Corporate Social Responsibility NGO India',
    inSitemap: true,
    status: 'Ready for Indexing'
  },
  {
    title: 'Donate & Seva Contributions',
    path: '/donate',
    url: 'https://ascension.ind.in/donate',
    category: 'Seva',
    priority: '0.7 (Medium)',
    changefreq: 'Monthly',
    description: 'Direct contribution portal for daily Mahabhoj, Gau Seva, dog food drives, and child education support.',
    targetKeywords: 'Donate for Food Seva, Gau Seva Donation, Support Underprivileged Children',
    inSitemap: true,
    status: 'Ready for Indexing'
  },
  {
    title: 'Contact & Facial Aura Diagnosis',
    path: '/contact',
    url: 'https://ascension.ind.in/contact',
    category: 'Contact',
    priority: '0.7 (Medium)',
    changefreq: 'Monthly',
    description: 'Direct booking inquiries, selfie upload for facial aura analysis, and crystal consultation with Sonali.',
    targetKeywords: 'Facial Aura Diagnosis, Contact Sonali Bhasin Kumar, Crystal Consultation',
    inSitemap: true,
    status: 'Ready for Indexing'
  }
];

const EXCLUDED_PRIVATE_PAGES = [
  { path: '/admin', reason: 'Admin Console & Backoffice (Protected for security)' },
  { path: '/profile', reason: 'User Private Profile & Personal Orders' },
  { path: '/programs/*/dashboard', reason: 'Private Student Course Area & Daily Audiobooks' },
  { path: '/thank-you', reason: 'Order Success & WhatsApp Community Join Link' },
  { path: '/reset-password', reason: 'Authentication & Password Reset Forms' }
];

const AdminDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [listData, setListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const [gratitudeProgramId, setGratitudeProgramId] = useState('');

  // User Management State
  const [userStats, setUserStats] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [userStatusFilter, setUserStatusFilter] = useState('all');
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [updatingUserRole, setUpdatingUserRole] = useState(false);

  // Website Traffic Analytics State
  const [analyticsSummary, setAnalyticsSummary] = useState(null);
  const [recentVisits, setRecentVisits] = useState([]);
  const [analyticsAutoRefresh, setAnalyticsAutoRefresh] = useState(false);
  const [clearingLogs, setClearingLogs] = useState(false);

  // SEO & Google Indexing State
  const [seoSearchQuery, setSeoSearchQuery] = useState('');
  const [seoCategoryFilter, setSeoCategoryFilter] = useState('all');
  const [copiedSeoUrl, setCopiedSeoUrl] = useState(null);
  
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
  const [adminCopiedId, setAdminCopiedId] = useState(null);

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
  const [programZoomLink, setProgramZoomLink] = useState('');
  const [programWhatsappLink, setProgramWhatsappLink] = useState('');

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
  const [webinarWhatsappLink, setWebinarWhatsappLink] = useState('');
  const [webinarStatus, setWebinarStatus] = useState('Upcoming');
  const [webinarCover, setWebinarCover] = useState(null);
  const [webinarQr, setWebinarQr] = useState(null);

  // Horoscope Crystal Recommendation state
  const [recommendedCrystal, setRecommendedCrystal] = useState('');
  const [crystalBenefits, setCrystalBenefits] = useState('');
  const [adminReplyMessage, setAdminReplyMessage] = useState('');
  const [sendingRecommendation, setSendingRecommendation] = useState(false);

  const tabs = [
    { id: 'users', label: 'Users & Activity', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: 'Website Traffic', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'seo-indexing', label: 'SEO & Google Indexing', icon: <Globe className="w-4 h-4 text-emerald-600" /> },
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
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    fetchTabData(false);
  }, [activeTab, gratitudeProgramId]);

  useEffect(() => {
    let interval;
    if (activeTab === 'analytics' && analyticsAutoRefresh) {
      interval = setInterval(() => {
        fetchTabData(true); // background silent refresh without wiping UI
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [activeTab, analyticsAutoRefresh]);

  const fetchTabData = async (isBackground = false) => {
    if (!isBackground) {
      setLoading(true);
      setListData([]);
    }
    try {
      if (activeTab === 'users') {
        const [usersRes, statsRes] = await Promise.all([
          axios.get('/api/users'),
          axios.get('/api/users/stats')
        ]);
        if (usersRes?.data?.success) {
          setListData(usersRes.data.data || []);
        }
        if (statsRes?.data?.success) {
          setUserStats(statsRes.data.data || null);
        }
        if (!isBackground) setLoading(false);
        return;
      }

      if (activeTab === 'analytics') {
        const [summaryRes, recentRes] = await Promise.all([
          axios.get('/api/analytics/summary'),
          axios.get('/api/analytics/recent?limit=50')
        ]);
        if (summaryRes?.data?.success) {
          setAnalyticsSummary(summaryRes.data.data || null);
        }
        if (recentRes?.data?.success) {
          setRecentVisits(recentRes.data.data || []);
          setListData(recentRes.data.data || []);
        }
        if (!isBackground) setLoading(false);
        return;
      }

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
      if (!isBackground) {
        setLoading(false);
      }
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;
    setUpdatingUserRole(true);
    try {
      const { data } = await axios.put(`/api/users/${userId}/role`, { role: newRole });
      if (data.success) {
        fetchTabData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdatingUserRole(false);
    }
  };

  const handleClearAnalyticsLogs = async () => {
    if (!window.confirm('Are you sure you want to clear all website visit logs? This will reset visitor history.')) return;
    setClearingLogs(true);
    try {
      const { data } = await axios.delete('/api/analytics/clear');
      if (data.success) {
        fetchTabData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to clear logs');
    } finally {
      setClearingLogs(false);
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

    if (activeTab === 'users') {
      if (!window.confirm('Are you sure you want to delete this user account? This cannot be undone.')) return;
    } else {
      if (!window.confirm('Are you sure you want to delete this item?')) return;
    }

    try {
      let endpoint = `/api/${activeTab}/${id}`;
      if (activeTab === 'users') endpoint = `/api/users/${id}`;
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

    if (activeTab === 'contacts') {
      setRecommendedCrystal(item.recommendedCrystal || '');
      setCrystalBenefits(item.crystalBenefits || '');
      setAdminReplyMessage(item.adminReplyMessage || '');
    }
    
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
    setProgramZoomLink('');
    setProgramWhatsappLink('');

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
    setWebinarWhatsappLink('');
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
      setProgramZoomLink(item.zoomLink || '');
      setProgramWhatsappLink(item.whatsappGroupLink || '');
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
      setWebinarWhatsappLink(item.whatsappGroupLink || '');
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
        payload.append('whatsappGroupLink', webinarWhatsappLink);
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
          youtubeUrl: programYoutubeUrl,
          zoomLink: programZoomLink,
          whatsappGroupLink: programWhatsappLink
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

  const handleSendCrystalRecommendation = async (id) => {
    if (!recommendedCrystal || !recommendedCrystal.trim()) {
      alert('Please enter a recommended crystal / stone name.');
      return;
    }
    setSendingRecommendation(true);
    try {
      const { data } = await axios.put(`/api/contacts/${id}/status`, {
        status: 'resolved',
        recommendedCrystal: recommendedCrystal.trim(),
        crystalBenefits: crystalBenefits.trim(),
        adminReplyMessage: adminReplyMessage.trim()
      });
      alert('Personalized crystal recommendation emailed to user and query resolved successfully!');
      setShowModal(false);
      fetchTabData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send crystal recommendation');
    } finally {
      setSendingRecommendation(false);
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
              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal-dark uppercase tracking-wider">
                  {activeTab === 'users' 
                    ? 'Registered Users & Live Activity' 
                    : activeTab === 'analytics' 
                      ? 'Website Traffic & Visitor Analytics' 
                      : `Manage ${activeTab}`}
                </h3>
                <p className="text-[11px] text-charcoal-light mt-0.5">
                  {activeTab === 'users' 
                    ? 'Monitor registered user sessions, online presence, login frequency, and activity.' 
                    : activeTab === 'analytics' 
                      ? 'Track live visitors, pageviews, top visited content, and real-time site usage.' 
                      : `Backoffice database records for ${activeTab}.`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={fetchTabData}
                  className="p-2 bg-cream-light border border-cream-dark hover:bg-cream rounded-xl text-charcoal transition-colors focus:outline-none"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                {activeTab === 'analytics' && (
                  <button
                    onClick={handleClearAnalyticsLogs}
                    disabled={clearingLogs}
                    className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-semibold py-2 px-3 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Logs</span>
                  </button>
                )}
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

            {/* USERS & ACTIVITY TAB */}
            {activeTab === 'users' ? (
              <div className="flex flex-col gap-6">
                {/* User Metrics Summary */}
                {userStats && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="bg-white/85 border border-cream-dark/60 rounded-2xl p-4 shadow-sm flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-light flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-sage" /> Total Registered
                      </span>
                      <span className="text-2xl font-serif font-bold text-charcoal-dark mt-1">{userStats.totalUsers}</span>
                      <span className="text-[10px] text-charcoal-light mt-0.5">+{userStats.newThisMonth} in last 30d</span>
                    </div>
                    <div className="bg-emerald-50/90 border border-emerald-200/80 rounded-2xl p-4 shadow-sm flex flex-col relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-emerald-600" /> Online Now
                        </span>
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                      </div>
                      <span className="text-2xl font-serif font-bold text-emerald-900 mt-1">{userStats.onlineNow}</span>
                      <span className="text-[10px] text-emerald-700 mt-0.5">Active in last 5 mins</span>
                    </div>
                    <div className="bg-white/85 border border-cream-dark/60 rounded-2xl p-4 shadow-sm flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-light flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-sage" /> Active Today
                      </span>
                      <span className="text-2xl font-serif font-bold text-sage mt-1">{userStats.activeToday}</span>
                      <span className="text-[10px] text-charcoal-light mt-0.5">Since midnight</span>
                    </div>
                    <div className="bg-white/85 border border-cream-dark/60 rounded-2xl p-4 shadow-sm flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-light flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-sage" /> Active (7 Days)
                      </span>
                      <span className="text-2xl font-serif font-bold text-charcoal-dark mt-1">{userStats.activeThisWeek}</span>
                      <span className="text-[10px] text-charcoal-light mt-0.5">Logged in this week</span>
                    </div>
                    <div className="bg-white/85 border border-cream-dark/60 rounded-2xl p-4 shadow-sm flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-light flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-gold-dark" /> Admins
                      </span>
                      <span className="text-2xl font-serif font-bold text-gold-dark mt-1">{userStats.adminsCount}</span>
                      <span className="text-[10px] text-charcoal-light mt-0.5">Backoffice staff</span>
                    </div>
                  </div>
                )}

                {/* Search and Filters Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-cream/40 p-3.5 rounded-2xl border border-cream-dark/50">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
                    <input 
                      type="text"
                      placeholder="Search by user name or email..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-cream-light border border-cream-dark rounded-xl text-xs focus:outline-none focus:border-sage"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <select 
                      value={userRoleFilter} 
                      onChange={(e) => setUserRoleFilter(e.target.value)}
                      className="bg-cream-light border border-cream-dark rounded-xl py-2 px-3 text-xs focus:outline-none"
                    >
                      <option value="all">All Roles</option>
                      <option value="user">Users Only</option>
                      <option value="admin">Admins Only</option>
                    </select>
                    <select 
                      value={userStatusFilter} 
                      onChange={(e) => setUserStatusFilter(e.target.value)}
                      className="bg-cream-light border border-cream-dark rounded-xl py-2 px-3 text-xs focus:outline-none"
                    >
                      <option value="all">All Status</option>
                      <option value="online">🟢 Online Now</option>
                      <option value="offline">⚪ Offline</option>
                    </select>
                  </div>
                </div>

                {/* Users Table */}
                {loading ? (
                  <div className="shimmer h-80 rounded-2xl w-full"></div>
                ) : (
                  <div className="glass rounded-2xl border border-cream-dark/50 overflow-x-auto shadow-sm">
                    <table className="w-full text-xs text-charcoal border-collapse">
                      <thead>
                        <tr className="bg-cream-dark/40 border-b border-cream-dark uppercase text-[10px] tracking-wider font-bold">
                          <th className="py-3 px-4 text-left">User Identity</th>
                          <th className="py-3 px-4 text-left">Role & Access</th>
                          <th className="py-3 px-4 text-left">Activity & Last Login</th>
                          <th className="py-3 px-4 text-left">Engagement</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(listData || [])
                          .filter(u => {
                            const matchesSearch = !userSearchQuery || 
                              u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                              u.email?.toLowerCase().includes(userSearchQuery.toLowerCase());
                            const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
                            const matchesStatus = userStatusFilter === 'all' || 
                              (userStatusFilter === 'online' && u.isOnline) || 
                              (userStatusFilter === 'offline' && !u.isOnline);
                            return matchesSearch && matchesRole && matchesStatus;
                          })
                          .map((u) => (
                            <tr key={u._id} className="border-b border-cream-dark/40 hover:bg-cream/20 transition-colors">
                              {/* Column 1: User Identity */}
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <div className="w-9 h-9 rounded-full bg-sage/20 text-sage-dark font-serif font-bold text-sm flex items-center justify-center border border-sage/30 uppercase">
                                      {u.name ? u.name.charAt(0) : 'U'}
                                    </div>
                                    {u.isOnline ? (
                                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                                    ) : (
                                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-charcoal-light/40 border-2 border-white rounded-full"></span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-bold text-charcoal-dark flex items-center gap-1.5">
                                      {u.name}
                                      {u.isOnline && (
                                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full border border-emerald-300">
                                          Online
                                        </span>
                                      )}
                                    </p>
                                    <p className="text-[10px] text-charcoal-light">{u.email}</p>
                                    <p className="text-[9px] text-charcoal-light/70 mt-0.5">Joined: {new Date(u.createdAt).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              </td>

                              {/* Column 2: Role */}
                              <td className="py-3 px-4">
                                <div className="flex flex-col gap-1">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase w-fit ${
                                    u.role === 'admin' 
                                      ? 'bg-gold/15 text-gold-dark border border-gold/30' 
                                      : 'bg-cream-dark text-charcoal-light border border-cream-dark/80'
                                  }`}>
                                    {u.role === 'admin' ? <Shield className="w-3 h-3 text-gold-dark" /> : <UserCheck className="w-3 h-3 text-sage" />}
                                    {u.role}
                                  </span>
                                  {u._id !== user._id && (
                                    <button
                                      type="button"
                                      onClick={() => handleUpdateUserRole(u._id, u.role === 'admin' ? 'user' : 'admin')}
                                      disabled={updatingUserRole}
                                      className="text-[9px] text-sage hover:underline font-bold text-left"
                                    >
                                      Make {u.role === 'admin' ? 'User' : 'Admin'} ⇄
                                    </button>
                                  )}
                                </div>
                              </td>

                              {/* Column 3: Activity & Logins */}
                              <td className="py-3 px-4">
                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-1 text-[11px] font-medium text-charcoal-dark">
                                    <Clock className="w-3 h-3 text-charcoal-light" />
                                    <span>Last Active: <strong>{formatTimeAgo(u.lastActive)}</strong></span>
                                  </div>
                                  <span className="text-[10px] text-charcoal-light">
                                    Last Login: {u.lastLogin ? new Date(u.lastLogin).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'Never recorded'}
                                  </span>
                                  <span className="text-[9px] text-charcoal-light font-medium mt-0.5">
                                    Total Logins: <strong>{u.loginCount || 0}</strong>
                                    {u.ipAddress && ` • IP: ${u.ipAddress}`}
                                  </span>
                                </div>
                              </td>

                              {/* Column 4: Engagement */}
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1 text-[10px]">
                                  <span className="bg-cream px-2 py-0.5 rounded border border-cream-dark text-charcoal-dark">
                                    🛒 {u.ordersCount || 0} Orders
                                  </span>
                                  <span className="bg-cream px-2 py-0.5 rounded border border-cream-dark text-charcoal-dark">
                                    🎓 {u.registrationsCount || 0} Enrolled
                                  </span>
                                  <span className="bg-cream px-2 py-0.5 rounded border border-cream-dark text-charcoal-dark">
                                    ✍️ {u.submissionsCount || 0} Submissions
                                  </span>
                                </div>
                              </td>

                              {/* Column 5: Actions */}
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setSelectedUserDetail(u)}
                                    className="p-1.5 hover:text-sage text-charcoal/60 hover:bg-cream rounded-lg transition-colors focus:outline-none"
                                    title="View Full Profile & Activity"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  {u._id !== user._id && (
                                    <button
                                      onClick={() => handleDelete(u._id)}
                                      className="p-1.5 hover:text-red-600 text-charcoal/60 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                                      title="Delete User"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : activeTab === 'analytics' ? (
              /* WEBSITE TRAFFIC ANALYTICS TAB */
              <div className="flex flex-col gap-6">
                {/* Realtime Live Pulse Banner */}
                <div className="bg-gradient-to-r from-emerald-900 to-sage-dark text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-4 w-4 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400"></span>
                    </span>
                    <div>
                      <h4 className="font-bold text-sm tracking-wider uppercase flex items-center gap-2">
                        Realtime Website Traffic Monitor
                      </h4>
                      <p className="text-xs text-white/80 mt-0.5">
                        <strong>{analyticsSummary?.realtime?.activeVisitors || 0} active visitors</strong> browsing the site right now (including <strong>{analyticsSummary?.realtime?.activeUsers || 0} logged-in users</strong>).
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1.5 text-xs text-white/90 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={analyticsAutoRefresh} 
                        onChange={(e) => setAnalyticsAutoRefresh(e.target.checked)}
                        className="rounded text-sage"
                      />
                      <span>Auto-refresh (15s)</span>
                    </label>
                    <button 
                      onClick={() => fetchTabData(false)} 
                      className="bg-white text-charcoal-dark hover:bg-cream font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-sm transition-all active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh Now</span>
                    </button>
                  </div>
                </div>

                {/* Metric Overview Cards Grid */}
                {analyticsSummary && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Pageviews Card */}
                    <div className="glass p-5 rounded-2xl border border-cream-dark/60 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between border-b border-cream-dark/50 pb-2 mb-3">
                        <span className="font-bold text-xs uppercase tracking-wider text-charcoal-dark flex items-center gap-1.5">
                          <Eye className="w-4 h-4 text-sage" /> Pageviews
                        </span>
                        <span className="text-[10px] bg-sage/15 text-sage font-bold px-2 py-0.5 rounded-full">All-Time: {analyticsSummary.pageviews?.total || 0}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-cream/40 p-2 rounded-xl">
                          <p className="text-[9px] text-charcoal-light uppercase font-bold">Today</p>
                          <p className="text-base font-bold text-charcoal-dark mt-0.5">{analyticsSummary.pageviews?.today || 0}</p>
                        </div>
                        <div className="bg-cream/40 p-2 rounded-xl">
                          <p className="text-[9px] text-charcoal-light uppercase font-bold">7 Days</p>
                          <p className="text-base font-bold text-charcoal-dark mt-0.5">{analyticsSummary.pageviews?.week || 0}</p>
                        </div>
                        <div className="bg-cream/40 p-2 rounded-xl">
                          <p className="text-[9px] text-charcoal-light uppercase font-bold">30 Days</p>
                          <p className="text-base font-bold text-charcoal-dark mt-0.5">{analyticsSummary.pageviews?.month || 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Meta Views & Facebook Ads Card */}
                    <div className="glass p-5 rounded-2xl border-2 border-purple-300/80 bg-gradient-to-br from-purple-50/40 via-white to-pink-50/30 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between border-b border-purple-200 pb-2 mb-3">
                        <span className="font-bold text-xs uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 animate-pulse"></span>
                          🟣 Meta & Ads Views
                        </span>
                        <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-300">
                          {analyticsSummary.metaViews?.unique || 0} Unique
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-purple-100/60 p-2 rounded-xl border border-purple-200">
                          <p className="text-[9px] text-purple-700 uppercase font-bold">Today</p>
                          <p className="text-base font-bold text-purple-950 mt-0.5">{analyticsSummary.metaViews?.today || 0}</p>
                        </div>
                        <div className="bg-purple-100/60 p-2 rounded-xl border border-purple-200">
                          <p className="text-[9px] text-purple-700 uppercase font-bold">7 Days</p>
                          <p className="text-base font-bold text-purple-950 mt-0.5">{analyticsSummary.metaViews?.week || 0}</p>
                        </div>
                        <div className="bg-purple-100/60 p-2 rounded-xl border border-purple-200">
                          <p className="text-[9px] text-purple-700 uppercase font-bold">Total</p>
                          <p className="text-base font-bold text-purple-950 mt-0.5">{analyticsSummary.metaViews?.total || 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Unique Visitors Card */}
                    <div className="glass p-5 rounded-2xl border border-cream-dark/60 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between border-b border-cream-dark/50 pb-2 mb-3">
                        <span className="font-bold text-xs uppercase tracking-wider text-charcoal-dark flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-gold-dark" /> Unique Visitors
                        </span>
                        <span className="text-[10px] bg-gold/15 text-gold-dark font-bold px-2 py-0.5 rounded-full">Total: {analyticsSummary.uniqueVisitors?.total || 0}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-cream/40 p-2 rounded-xl">
                          <p className="text-[9px] text-charcoal-light uppercase font-bold">Today</p>
                          <p className="text-base font-bold text-charcoal-dark mt-0.5">{analyticsSummary.uniqueVisitors?.today || 0}</p>
                        </div>
                        <div className="bg-cream/40 p-2 rounded-xl">
                          <p className="text-[9px] text-charcoal-light uppercase font-bold">7 Days</p>
                          <p className="text-base font-bold text-charcoal-dark mt-0.5">{analyticsSummary.uniqueVisitors?.week || 0}</p>
                        </div>
                        <div className="bg-cream/40 p-2 rounded-xl">
                          <p className="text-[9px] text-charcoal-light uppercase font-bold">30 Days</p>
                          <p className="text-base font-bold text-charcoal-dark mt-0.5">{analyticsSummary.uniqueVisitors?.month || 0}</p>
                        </div>
                      </div>
                    </div>

                    {/* Device Breakdown */}
                    <div className="glass p-5 rounded-2xl border border-cream-dark/60 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between border-b border-cream-dark/50 pb-2 mb-3">
                        <span className="font-bold text-xs uppercase tracking-wider text-charcoal-dark flex items-center gap-1.5">
                          <Laptop className="w-4 h-4 text-charcoal" /> Devices (30 Days)
                        </span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {analyticsSummary.deviceBreakdown && Array.isArray(analyticsSummary.deviceBreakdown) && analyticsSummary.deviceBreakdown.length > 0 ? (
                          analyticsSummary.deviceBreakdown.map((d, dIdx) => (
                            <div key={d?.device || dIdx} className="flex items-center justify-between text-xs">
                              <span className="flex items-center gap-1.5 text-charcoal-light font-medium">
                                {d?.device === 'Mobile' && <Smartphone className="w-3.5 h-3.5 text-sage" />}
                                {d?.device === 'Desktop' && <Laptop className="w-3.5 h-3.5 text-charcoal-dark" />}
                                {d?.device === 'Tablet' && <Tablet className="w-3.5 h-3.5 text-gold" />}
                                {d?.device || 'Other'}
                              </span>
                              <span className="font-bold text-charcoal-dark">{d?.count || 0} views</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-charcoal-light py-2 text-center">No device records yet</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Campaign Attribution & Traffic Source Breakdown Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Top Campaigns Table */}
                  <div className="glass p-5 rounded-2xl border border-purple-200 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h4 className="font-serif font-bold text-sm text-charcoal-dark uppercase tracking-wider flex items-center gap-1.5">
                        <span className="text-purple-600 font-sans">🎯</span> Top Campaigns & Meta Ads
                      </h4>
                      <span className="text-[10px] text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full font-bold">UTM Campaign</span>
                    </div>

                    {analyticsSummary?.topCampaigns && Array.isArray(analyticsSummary.topCampaigns) && analyticsSummary.topCampaigns.length > 0 ? (
                      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                        {analyticsSummary.topCampaigns.map((camp, idx) => (
                          <div key={idx} className="bg-cream/40 p-3 rounded-xl border border-cream-dark/50 flex flex-col gap-1 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-charcoal-dark flex items-center gap-1.5">
                                <span className="text-[10px] text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded font-mono">#{idx + 1}</span>
                                {camp?.campaign || 'General Campaign'}
                              </span>
                              <span className="font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full text-[10px]">
                                {camp?.views || 0} views ({camp?.uniqueVisitors || 0} unique)
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[10px] text-charcoal-light mt-0.5">
                              <span>Meta Traffic: <strong className="text-purple-800">{camp?.metaViews || 0}</strong></span>
                              {Array.isArray(camp?.sources) && camp.sources.filter(Boolean).length > 0 && (
                                <span className="truncate max-w-[200px]">Sources: {camp.sources.filter(Boolean).join(', ')}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-charcoal-light py-4 text-center">No campaign/UTM traffic recorded in the last 30 days. Add <code>?utm_campaign=navratri&utm_source=facebook</code> to your ad links.</p>
                    )}
                  </div>

                  {/* Traffic Sources Breakdown */}
                  <div className="glass p-5 rounded-2xl border border-cream-dark/60 shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <h4 className="font-serif font-bold text-sm text-charcoal-dark uppercase tracking-wider flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-gold-dark" /> Traffic Sources Breakdown
                      </h4>
                      <span className="text-[10px] text-charcoal-light">Last 30 Days</span>
                    </div>

                    {analyticsSummary?.sourceBreakdown && Array.isArray(analyticsSummary.sourceBreakdown) && analyticsSummary.sourceBreakdown.length > 0 ? (
                      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                        {analyticsSummary.sourceBreakdown.map((src, idx) => {
                          const sourceName = src?.source ? String(src.source) : 'Direct / Organic';
                          const lower = sourceName.toLowerCase();
                          const isMeta = lower.includes('meta') || lower.includes('facebook') || lower.includes('instagram');
                          return (
                            <div key={idx} className="flex justify-between items-center bg-cream/40 p-2.5 rounded-xl border border-cream-dark/40 text-xs">
                              <span className="font-bold text-charcoal-dark flex items-center gap-1.5">
                                {isMeta ? (
                                  <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0"></span>
                                ) : (
                                  <span className="w-2 h-2 rounded-full bg-sage shrink-0"></span>
                                )}
                                <span className="truncate max-w-[200px]">{sourceName}</span>
                              </span>
                              <span className="font-bold text-charcoal-dark shrink-0">
                                {src?.views || 0} views <span className="text-[10px] text-charcoal-light font-normal">({src?.uniqueVisitors || 0} unique)</span>
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-xs text-charcoal-light py-4 text-center">No source attribution data yet.</p>
                    )}
                  </div>
                </div>

                {/* Top Visited Pages */}
                {analyticsSummary?.topPages && Array.isArray(analyticsSummary.topPages) && analyticsSummary.topPages.length > 0 && (
                  <div className="glass p-5 rounded-2xl border border-cream-dark/60 shadow-sm flex flex-col gap-3">
                    <h4 className="font-serif font-bold text-sm text-charcoal-dark uppercase tracking-wider flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-sage" /> Top Visited Pages & Content
                    </h4>
                    <div className="flex flex-col gap-2">
                      {analyticsSummary.topPages.map((page, idx) => {
                        const maxViews = Math.max(analyticsSummary.topPages[0]?.views || 1, 1);
                        const pViews = page?.views || 0;
                        const pct = Math.min(Math.round((pViews / maxViews) * 100), 100);
                        const pathStr = page?.pagePath ? String(page.pagePath) : '/';
                        return (
                          <div key={pathStr || idx} className="flex flex-col gap-1 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="font-mono text-charcoal-dark font-medium flex items-center gap-1.5">
                                <span className="text-[10px] text-charcoal-light font-bold">#{idx + 1}</span>
                                <span className="truncate max-w-xs">{pathStr}</span>
                                {(page?.metaViews || 0) > 0 && (
                                  <span className="text-[9px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.2 rounded-full border border-purple-200">
                                    🟣 {page.metaViews} Meta
                                  </span>
                                )}
                              </span>
                              <span className="font-bold text-charcoal-dark">
                                {pViews} views <span className="text-charcoal-light font-normal text-[10px]">({page?.uniqueVisitors || 0} unique)</span>
                              </span>
                            </div>
                            <div className="w-full bg-cream-dark/40 h-2 rounded-full overflow-hidden">
                              <div className="bg-sage h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Live Stream of Recent Website Visits */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h4 className="font-serif font-bold text-sm text-charcoal-dark uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-600" /> Live Visitor Stream (Last 50 Visits)
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-charcoal-light">Showing newest first</span>
                      <button
                        type="button"
                        onClick={handleClearAnalyticsLogs}
                        disabled={clearingLogs}
                        className="text-[10px] text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded border border-red-200 transition-colors"
                      >
                        Clear Log History
                      </button>
                    </div>
                  </div>

                  {loading && recentVisits.length === 0 ? (
                    <div className="shimmer h-80 rounded-2xl w-full"></div>
                  ) : recentVisits && recentVisits.length > 0 ? (
                    <div className="glass rounded-2xl border border-cream-dark/50 overflow-x-auto shadow-sm">
                      <table className="w-full text-xs text-charcoal border-collapse">
                        <thead>
                          <tr className="bg-cream-dark/40 border-b border-cream-dark uppercase text-[10px] tracking-wider font-bold">
                            <th className="py-3 px-4 text-left">Visitor Identity</th>
                            <th className="py-3 px-4 text-left">Page Visited</th>
                            <th className="py-3 px-4 text-left">Campaign / Attribution</th>
                            <th className="py-3 px-4 text-left">Device & Browser</th>
                            <th className="py-3 px-4 text-left">Time & Referrer</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentVisits.map((visit, vIdx) => {
                            if (!visit) return null;
                            const visitorIdStr = visit?.visitorId ? String(visit.visitorId) : 'guest';
                            const userName = visit?.userId?.name || visit?.userName || 'Registered User';
                            const userInitial = userName.charAt(0).toUpperCase() || 'U';
                            const userEmail = visit?.userId?.email || visit?.userEmail || '';
                            const pagePath = visit?.pagePath || '/';
                            const pageTitle = visit?.pageTitle || '';
                            const deviceType = visit?.deviceType || 'Desktop';
                            
                            let timeDisplay = '';
                            try {
                              if (visit?.timestamp) {
                                timeDisplay = new Date(visit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                              }
                            } catch (e) {
                              timeDisplay = '';
                            }

                            return (
                              <tr key={visit?._id || vIdx} className="border-b border-cream-dark/40 hover:bg-cream/20 transition-colors">
                                {/* Column 1: Visitor Identity */}
                                <td className="py-3 px-4">
                                  {visit?.userId ? (
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-full bg-sage/20 text-sage-dark font-bold text-xs flex items-center justify-center border border-sage/30 shrink-0">
                                        {userInitial}
                                      </div>
                                      <div>
                                        <p className="font-bold text-charcoal-dark flex items-center gap-1">
                                          {userName}
                                          <span className="text-[8px] bg-sage/20 text-sage font-bold px-1.5 py-0.2 rounded-full">User</span>
                                        </p>
                                        <p className="text-[10px] text-charcoal-light">{userEmail}</p>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <div className="w-7 h-7 rounded-full bg-cream-dark text-charcoal-light font-bold text-xs flex items-center justify-center border border-cream-dark/80 shrink-0">
                                        <Globe className="w-3.5 h-3.5" />
                                      </div>
                                      <div>
                                        <p className="font-bold text-charcoal-dark text-[11px]">Guest Visitor</p>
                                        <p className="font-mono text-[9px] text-charcoal-light">ID: {visitorIdStr.substring(0, 14)}...</p>
                                      </div>
                                    </div>
                                  )}
                                </td>

                                {/* Column 2: Page Visited */}
                                <td className="py-3 px-4">
                                  <p className="font-mono font-bold text-charcoal-dark text-[11px]">{pagePath}</p>
                                  {pageTitle && (
                                    <p className="text-[10px] text-charcoal-light line-clamp-1 max-w-xs">{pageTitle}</p>
                                  )}
                                </td>

                                {/* Column 3: Campaign & Meta Attribution */}
                                <td className="py-3 px-4">
                                  <div className="flex flex-col gap-1 items-start">
                                    {visit?.isMetaTraffic && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                                        🟣 Meta / FB Traffic
                                      </span>
                                    )}
                                    {visit?.utmCampaign && (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                        🎯 {visit.utmCampaign}
                                      </span>
                                    )}
                                    {visit?.utmSource && (
                                      <span className="text-[9px] text-charcoal-light">
                                        Source: <strong>{visit.utmSource}</strong>
                                      </span>
                                    )}
                                    {!visit?.isMetaTraffic && !visit?.utmCampaign && !visit?.utmSource && (
                                      <span className="text-[9px] text-charcoal-light/60 italic">Direct / Organic</span>
                                    )}
                                  </div>
                                </td>

                                {/* Column 4: Device & Browser */}
                                <td className="py-3 px-4">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-charcoal-dark">
                                      {deviceType === 'Mobile' && <Smartphone className="w-3 h-3 text-sage" />}
                                      {deviceType === 'Desktop' && <Laptop className="w-3 h-3 text-charcoal" />}
                                      {deviceType === 'Tablet' && <Tablet className="w-3 h-3 text-gold" />}
                                      {deviceType}
                                    </span>
                                    {visit?.ipAddress && (
                                      <span className="font-mono text-[9px] text-charcoal-light">IP: {visit.ipAddress}</span>
                                    )}
                                  </div>
                                </td>

                                {/* Column 5: Time & Referrer */}
                                <td className="py-3 px-4">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="font-bold text-charcoal-dark text-[11px]">{formatTimeAgo(visit?.timestamp)}</span>
                                    {timeDisplay && (
                                      <span className="text-[9px] text-charcoal-light">
                                        {timeDisplay}
                                      </span>
                                    )}
                                    {visit?.referrer && (
                                      <span className="text-[9px] text-sage truncate max-w-xs" title={visit.referrer}>
                                        via {visit.referrer}
                                      </span>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-16 text-center glass rounded-2xl">
                      <p className="text-xs text-charcoal-light">No website visits recorded yet.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === 'seo-indexing' ? (
              /* SEO & GOOGLE INDEXING MANAGEMENT TAB */
              <div className="flex flex-col gap-6">
                
                {/* Hero Google Indexing Banner */}
                <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-900 text-white p-5 sm:p-6 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-blue-400/20">
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
                      <Globe className="w-6 h-6 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base tracking-wider uppercase flex items-center gap-2">
                        Google Search Indexing & Sitemap Hub
                        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-bold uppercase">
                          Sitemap Active
                        </span>
                      </h4>
                      <p className="text-xs text-white/80 mt-0.5">
                        Manage all public URLs configured for Googlebot crawler indexing, XML sitemap sync, and search ranking.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <a 
                      href="https://search.google.com/search-console" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-white text-charcoal-dark hover:bg-cream font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                      <span>Google Search Console ↗</span>
                    </a>
                    <a 
                      href="https://www.google.com/search?q=site:ascension.ind.in" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600/40 hover:bg-blue-600/60 text-white border border-blue-400/40 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>Check Live in Google ↗</span>
                    </a>
                  </div>
                </div>

                {/* Status Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Total Indexable Pages */}
                  <div className="glass p-5 rounded-2xl border border-cream-dark/60 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between border-b border-cream-dark/50 pb-2 mb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-charcoal-dark flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-sage" /> Indexable Pages
                      </span>
                      <span className="text-[10px] bg-sage/15 text-sage font-bold px-2 py-0.5 rounded-full">Public</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-charcoal-dark">{INDEXABLE_PAGES.length}</p>
                      <p className="text-[10px] text-charcoal-light mt-0.5">High-priority URLs in sitemap</p>
                    </div>
                  </div>

                  {/* Card 2: Live XML Sitemap */}
                  <div className="glass p-5 rounded-2xl border border-blue-200 bg-blue-50/20 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between border-b border-blue-200/60 pb-2 mb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-blue-600" /> XML Sitemap
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">Live</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <a 
                        href="https://ascension.ind.in/sitemap.xml" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-blue-700 font-bold hover:underline flex items-center gap-1 truncate"
                      >
                        /sitemap.xml ↗
                      </a>
                      <p className="text-[10px] text-charcoal-light">Standard 0.9 XML protocol</p>
                    </div>
                  </div>

                  {/* Card 3: Robots.txt Rules */}
                  <div className="glass p-5 rounded-2xl border border-purple-200 bg-purple-50/20 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between border-b border-purple-200/60 pb-2 mb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-purple-600" /> Robots.txt
                      </span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full border border-purple-200">Active</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <a 
                        href="https://ascension.ind.in/robots.txt" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-mono text-xs text-purple-700 font-bold hover:underline flex items-center gap-1 truncate"
                      >
                        /robots.txt ↗
                      </a>
                      <p className="text-[10px] text-charcoal-light">Guides Googlebot crawlers</p>
                    </div>
                  </div>

                  {/* Card 4: Protected Private Pages */}
                  <div className="glass p-5 rounded-2xl border border-cream-dark/60 flex flex-col justify-between shadow-sm">
                    <div className="flex items-center justify-between border-b border-cream-dark/50 pb-2 mb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-charcoal-dark flex items-center gap-1.5">
                        <Shield className="w-4 h-4 text-charcoal" /> Excluded Routes
                      </span>
                      <span className="text-[10px] bg-charcoal/10 text-charcoal font-bold px-2 py-0.5 rounded-full">Private</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-charcoal-dark">{EXCLUDED_PRIVATE_PAGES.length}</p>
                      <p className="text-[10px] text-charcoal-light mt-0.5">Admin & Auth paths protected</p>
                    </div>
                  </div>
                </div>

                {/* Search and Filters Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-cream/40 p-3.5 rounded-2xl border border-cream-dark/50">
                  <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-light" />
                    <input 
                      type="text"
                      placeholder="Search page title, URL or keyword..."
                      value={seoSearchQuery}
                      onChange={(e) => setSeoSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-cream-light border border-cream-dark rounded-xl text-xs focus:outline-none focus:border-sage"
                    />
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <select 
                      value={seoCategoryFilter} 
                      onChange={(e) => setSeoCategoryFilter(e.target.value)}
                      className="bg-cream-light border border-cream-dark rounded-xl py-2 px-3 text-xs focus:outline-none"
                    >
                      <option value="all">All Categories ({INDEXABLE_PAGES.length})</option>
                      <option value="Core">Core Landing</option>
                      <option value="Programs">Programs & Audiobooks</option>
                      <option value="Services">Services & Sessions</option>
                      <option value="Shop">Crystals & Shop</option>
                      <option value="Webinars">Webinars</option>
                      <option value="Seva">NGO & CSR Seva</option>
                      <option value="About">About</option>
                      <option value="Contact">Contact</option>
                    </select>
                  </div>
                </div>

                {/* Indexable Pages Table */}
                <div className="glass rounded-2xl border border-cream-dark/50 overflow-x-auto shadow-sm">
                  <table className="w-full text-xs text-charcoal border-collapse">
                    <thead>
                      <tr className="bg-cream-dark/40 border-b border-cream-dark uppercase text-[10px] tracking-wider font-bold">
                        <th className="py-3 px-4 text-left">Page Name & Purpose</th>
                        <th className="py-3 px-4 text-left">URL Path</th>
                        <th className="py-3 px-4 text-left">Google Priority</th>
                        <th className="py-3 px-4 text-left">Target Keywords</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INDEXABLE_PAGES
                        .filter(page => {
                          const matchesSearch = !seoSearchQuery || 
                            page.title.toLowerCase().includes(seoSearchQuery.toLowerCase()) || 
                            page.path.toLowerCase().includes(seoSearchQuery.toLowerCase()) ||
                            page.targetKeywords.toLowerCase().includes(seoSearchQuery.toLowerCase());
                          const matchesCategory = seoCategoryFilter === 'all' || page.category === seoCategoryFilter;
                          return matchesSearch && matchesCategory;
                        })
                        .map((page, idx) => (
                          <tr key={idx} className="border-b border-cream-dark/40 hover:bg-cream/20 transition-colors">
                            {/* Column 1: Title & Category */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-charcoal-dark text-xs">{page.title}</span>
                                  <span className="text-[9px] bg-cream-dark text-charcoal-light px-2 py-0.2 rounded-full font-bold uppercase">
                                    {page.category}
                                  </span>
                                </div>
                                <p className="text-[10px] text-charcoal-light max-w-sm line-clamp-1">{page.description}</p>
                              </div>
                            </td>

                            {/* Column 2: URL Path */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-charcoal-dark">
                                <span>{page.path}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(page.url);
                                    setCopiedSeoUrl(page.path);
                                    setTimeout(() => setCopiedSeoUrl(null), 2000);
                                  }}
                                  className="p-1 hover:bg-cream rounded text-charcoal-light hover:text-charcoal transition-colors"
                                  title="Copy Full URL"
                                >
                                  {copiedSeoUrl === page.path ? <Check className="w-3.5 h-3.5 text-sage" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </td>

                            {/* Column 3: Priority & Frequency */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-col gap-0.5">
                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded w-fit ${
                                  page.priority.includes('1.0') || page.priority.includes('0.9') 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                                }`}>
                                  ★ {page.priority}
                                </span>
                                <span className="text-[9px] text-charcoal-light">Updates: {page.changefreq}</span>
                              </div>
                            </td>

                            {/* Column 4: Target Keywords */}
                            <td className="py-3.5 px-4">
                              <p className="text-[10px] text-charcoal-light max-w-xs leading-relaxed">
                                {page.targetKeywords}
                              </p>
                            </td>

                            {/* Column 5: Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={`https://www.google.com/search?q=site:ascension.ind.in${page.path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 hover:bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors"
                                  title="Check Index Status on Google"
                                >
                                  <Search className="w-3 h-3" />
                                  <span>Google ↗</span>
                                </a>
                                <a
                                  href={page.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 hover:bg-cream text-charcoal/70 hover:text-charcoal rounded-lg transition-colors"
                                  title="Open Page in New Tab"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* Excluded & Private Protected Pages Table */}
                <div className="glass p-5 rounded-2xl border border-cream-dark/60 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h4 className="font-serif font-bold text-sm text-charcoal-dark uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-charcoal" /> Protected & Excluded URLs (Disallow in Robots.txt)
                    </h4>
                    <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                      Not Indexed by Search Engines
                    </span>
                  </div>
                  <p className="text-xs text-charcoal-light leading-relaxed">
                    These private routes are blocked in <code>robots.txt</code> to safeguard user confidentiality, account data, and paid member course dashboards from public Google search crawler indexing.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                    {EXCLUDED_PRIVATE_PAGES.map((ex, idx) => (
                      <div key={idx} className="bg-cream/40 p-3 rounded-xl border border-cream-dark/50 flex flex-col gap-1 text-xs">
                        <span className="font-mono font-bold text-red-700">{ex.path}</span>
                        <span className="text-[11px] text-charcoal-light">{ex.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* DEFAULT TABLES FOR OTHER TABS */
              loading ? (
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
                          {activeTab === 'contacts' && (
                            <div className="flex flex-col gap-1">
                              <span className="text-charcoal-light font-medium">{item.email}</span>
                              {item.message && (item.message.includes('[HOROSCOPE') || item.message.includes('HOROSCOPE') || item.message.includes('AURA PHOTO')) && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-gold-dark bg-gold/15 px-2 py-0.5 rounded-full border border-gold/30 w-fit">
                                  <Sparkles className="w-3 h-3" /> Horoscope & Aura Request
                                </span>
                              )}
                              {item.recommendedCrystal && (
                                <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 w-fit">
                                  💎 {item.recommendedCrystal}
                                </span>
                              )}
                              {item.paymentScreenshot && (
                                <a 
                                  href={getImageUrl(item.paymentScreenshot)} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sage hover:underline font-bold text-[10px] uppercase flex items-center gap-0.5"
                                >
                                  View Selfie / Photo ↗
                                </a>
                              )}
                            </div>
                          )}
                          {activeTab === 'donations' && (
                            <div className="flex flex-col gap-0.5">
                              {item.paymentType === 'RAZORPAY' || item.transactionId?.startsWith('pay_') ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 w-fit">
                                  ⚡ Razorpay Online
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-300 w-fit">
                                  📱 UPI / Manual
                                </span>
                              )}
                              <span className="font-mono text-[10px] text-charcoal-dark font-medium">TxID: {item.transactionId || 'N/A'}</span>
                            </div>
                          )}
                          {activeTab === 'orders' && (
                            <div className="flex flex-col gap-1">
                              {item.paymentType === 'RAZORPAY' || item.paymentId?.startsWith('pay_') || item.transactionId?.startsWith('pay_') ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 w-fit">
                                  ⚡ Razorpay Online Order
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-300 w-fit">
                                  📱 UPI QR Order
                                </span>
                              )}
                              <span className="font-mono text-[10px] text-charcoal-dark">
                                Ref: {item.paymentId || item.transactionId || item.orderId || item._id}
                              </span>
                              {item.paymentScreenshot && item.paymentScreenshot !== 'razorpay_online' && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewImage(getImageUrl(item.paymentScreenshot))}
                                  className="text-sage hover:underline font-bold text-[10px] uppercase flex items-center gap-0.5 cursor-pointer text-left"
                                >
                                  📷 View Receipt Proof ↗
                                </button>
                              )}
                            </div>
                          )}
                          {activeTab === 'testimonials' && <span className="text-gold">{'★'.repeat(item.rating)}</span>}
                          {activeTab === 'webinars' && <span className="text-sage font-medium">Speaker: {item.speakerName} | Date: {new Date(item.date).toLocaleDateString()}</span>}
                          {activeTab === 'webinar-registrations' && (
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-charcoal-dark">{item.webinar?.title || 'Ancestral Healing Webinar'}</span>
                              
                              {item.paymentScreenshot === 'razorpay_online' || item.transactionId?.startsWith('pay_') ? (
                                <div className="flex flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 w-fit">
                                    ⚡ Razorpay Online (Instant Verified)
                                  </span>
                                  <span className="font-mono text-[10px] text-charcoal-dark font-semibold">
                                    Razorpay ID: {item.transactionId}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-300 w-fit">
                                    📱 Manual UPI QR Payment
                                  </span>
                                  <span className="font-mono text-[10px] text-charcoal-light">
                                    TxID: {item.transactionId}
                                  </span>
                                  {item.paymentScreenshot && item.paymentScreenshot !== 'razorpay_online' && (
                                    <button 
                                      type="button"
                                      onClick={() => setPreviewImage(getImageUrl(item.paymentScreenshot))} 
                                      className="text-sage hover:underline font-bold text-[10px] uppercase flex items-center gap-0.5 cursor-pointer text-left mt-0.5"
                                    >
                                      📷 View Screenshot Proof ↗
                                    </button>
                                  )}
                                </div>
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
                              <span className="font-bold text-charcoal-dark">{item.workshop?.title || 'Workshop'}</span>
                              {item.paymentScreenshot === 'razorpay_online' || item.transactionId?.startsWith('pay_') ? (
                                <div className="flex flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 w-fit">
                                    ⚡ Razorpay Online (Instant Verified)
                                  </span>
                                  <span className="font-mono text-[10px] text-charcoal-dark font-semibold">
                                    Razorpay ID: {item.transactionId}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-300 w-fit">
                                    📱 Manual UPI QR Payment
                                  </span>
                                  <span className="font-mono text-[10px] text-charcoal-light">TxID: {item.transactionId}</span>
                                  {item.paymentScreenshot && item.paymentScreenshot !== 'razorpay_online' && (
                                    <button 
                                      type="button"
                                      onClick={() => setPreviewImage(getImageUrl(item.paymentScreenshot))} 
                                      className="text-sage hover:underline font-bold text-[10px] uppercase flex items-center gap-0.5 cursor-pointer text-left mt-0.5"
                                    >
                                      📷 View Screenshot Proof ↗
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          {activeTab === 'program-registrations' && (
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-charcoal-dark">{item.program?.title || 'Ascension Program'}</span>
                              {item.paymentScreenshot === 'razorpay_online' || item.transactionId?.startsWith('pay_') ? (
                                <div className="flex flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 w-fit">
                                    ⚡ Razorpay Online Enrollment
                                  </span>
                                  <span className="font-mono text-[10px] text-charcoal-dark font-semibold">
                                    Razorpay ID: {item.transactionId}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-0.5">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800 border border-purple-300 w-fit">
                                    📱 Manual UPI QR Enrollment
                                  </span>
                                  <span className="font-mono text-[10px] text-charcoal-light">TxID: {item.transactionId}</span>
                                  {item.paymentScreenshot && item.paymentScreenshot !== 'razorpay_online' && (
                                    <button 
                                      type="button"
                                      onClick={() => setPreviewImage(getImageUrl(item.paymentScreenshot))} 
                                      className="text-sage hover:underline font-bold text-[10px] uppercase flex items-center gap-0.5 cursor-pointer text-left mt-0.5"
                                    >
                                      📷 View Screenshot Proof ↗
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          {activeTab === 'service-bookings' && (
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-charcoal-dark">
                                {item.message?.split('\n')[0]?.replace('[SERVICE BOOKING REQUEST: ', '')?.replace(']', '') || 'Service Session'}
                              </span>
                              <span className="text-[10px] text-charcoal-light font-sans">
                                Slot: {item.message?.split('\n')[1]?.replace('Preferred Date: ', '') || 'Unspecified'}
                              </span>
                              {item.transactionId && (
                                <span className="font-mono text-[10px] text-charcoal-dark font-medium">TxID: {item.transactionId}</span>
                              )}
                              {item.paymentScreenshot && item.paymentScreenshot !== 'razorpay_online' && (
                                <button 
                                  type="button"
                                  onClick={() => setPreviewImage(getImageUrl(item.paymentScreenshot))} 
                                  className="text-sage hover:underline font-bold text-[10px] uppercase flex items-center gap-0.5 cursor-pointer text-left mt-0.5"
                                >
                                  📷 View Screenshot Proof ↗
                                </button>
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
                          {/* Copy Program Link Button */}
                          {activeTab === 'programs' && (
                            <button
                              type="button"
                              onClick={() => {
                                const url = `https://ascension.ind.in/program/${item._id}`;
                                navigator.clipboard.writeText(url);
                                setAdminCopiedId(item._id);
                                setTimeout(() => setAdminCopiedId(null), 2500);
                              }}
                              className="p-1.5 hover:text-gold text-charcoal/60 transition-colors focus:outline-none flex items-center gap-1 text-[10px] font-bold"
                              title="Copy Direct Program Link"
                            >
                              {adminCopiedId === item._id ? (
                                <span className="text-emerald-600 flex items-center gap-0.5"><Check className="w-3.5 h-3.5" /> Copied</span>
                              ) : (
                                <Share2 className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {/* View Registrants/Inquiries Button */}
                          {['workshops', 'retreats', 'programs', 'orders', 'contacts', 'donations', 'service-bookings', 'webinars', 'webinar-registrations', 'workshop-registrations', 'program-registrations', 'gratitude-assignments', 'gratitude-submissions'].includes(activeTab) && (
                            <button
                              onClick={() => handleOpenView(item)}
                              className="p-1.5 hover:text-sage text-charcoal/60 transition-colors focus:outline-none"
                              title="View Full Details / Payment Proof"
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
                            item.message && (item.message.includes('[HOROSCOPE') || item.message.includes('HOROSCOPE') || item.message.includes('AURA PHOTO')) ? (
                              <button
                                onClick={() => handleOpenView(item)}
                                className="p-1 text-gold-dark hover:text-charcoal-dark bg-gold/15 hover:bg-gold/30 focus:outline-none font-bold text-[10px] uppercase border border-gold/40 rounded px-2 flex items-center gap-1 cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3" /> Recommend
                              </button>
                            ) : (
                              <button
                                onClick={() => handleUpdateStatus(item._id, 'status', 'resolved')}
                                className="p-1 text-sage hover:text-sage-dark focus:outline-none font-bold text-[10px] uppercase border border-sage/40 rounded px-1.5 cursor-pointer"
                              >
                                Resolve
                              </button>
                            )
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
            ))}

          </div>

        </div>
      </div>

      {/* Main Form/Viewer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-charcoal/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`glass ${modalMode === 'view' ? 'max-w-2xl' : 'max-w-lg'} w-full rounded-2xl shadow-xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col text-left`}>
            
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
                  {/* Webinar Registration Single Details */}
                  {activeTab === 'webinar-registrations' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h4 className="font-bold text-charcoal-dark font-serif text-sm">Webinar Registration Record</h4>
                          <p className="text-[10px] text-charcoal-light">Webinar: <strong className="text-charcoal-dark">{selectedItem.webinar?.title || 'Webinar'}</strong></p>
                        </div>
                        <span className={`py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          selectedItem.paymentStatus === 'Paid' ? 'bg-sage/10 text-sage' :
                          selectedItem.paymentStatus === 'Rejected' ? 'bg-red-500/10 text-red-600' :
                          'bg-gold/20 text-gold-dark'
                        }`}>
                          Status: {selectedItem.paymentStatus}
                        </span>
                      </div>

                      {/* Participant Details */}
                      <div className="bg-cream/70 p-4 rounded-xl border border-cream-dark/60 grid grid-cols-1 sm:grid-cols-2 gap-3 leading-relaxed">
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Participant Name</p>
                          <p className="font-bold text-charcoal-dark text-sm">{selectedItem.name || selectedItem.user?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Email Address</p>
                          <p className="font-medium text-charcoal"><a href={`mailto:${selectedItem.email || selectedItem.user?.email}`} className="text-sage hover:underline">{selectedItem.email || selectedItem.user?.email || 'N/A'}</a></p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Phone / WhatsApp</p>
                          <p className="font-medium text-charcoal">{selectedItem.phone || selectedItem.user?.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Registered On</p>
                          <p className="font-medium text-charcoal">{new Date(selectedItem.createdAt || selectedItem.registeredAt).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Webinar & Transaction Details */}
                      <div className="bg-white/80 p-4 rounded-xl border border-cream-dark/60 flex flex-col gap-2">
                        <h5 className="font-bold text-charcoal-dark text-[11px] uppercase tracking-wider border-b pb-1">Webinar & Payment Details</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <p><strong>Speaker:</strong> {selectedItem.webinar?.speakerName || 'N/A'}</p>
                          <p><strong>Date & Time:</strong> {selectedItem.webinar?.date ? new Date(selectedItem.webinar.date).toLocaleDateString() : 'N/A'} at {selectedItem.webinar?.time || ''}</p>
                          <p><strong>Payment Mode:</strong> <span className="font-semibold text-charcoal-dark">{selectedItem.paymentScreenshot === 'razorpay_online' || selectedItem.transactionId?.startsWith('pay_') ? 'Razorpay Online Gateway' : 'UPI QR Code / Manual'}</span></p>
                          <p><strong>Webinar Fee:</strong> <span className="font-bold text-sage">₹{selectedItem.webinar?.price?.toLocaleString() || 'N/A'}</span></p>
                          <p className="sm:col-span-2"><strong>Transaction ID / Razorpay Ref:</strong> <code className="bg-cream px-1.5 py-0.5 rounded text-[10px] font-mono text-charcoal-dark border">{selectedItem.transactionId || 'N/A'}</code></p>
                          {selectedItem.webinar?.zoomLink && (
                            <p className="sm:col-span-2"><strong>Zoom Link:</strong> <a href={selectedItem.webinar.zoomLink} target="_blank" rel="noopener noreferrer" className="text-sage hover:underline font-medium">{selectedItem.webinar.zoomLink}</a></p>
                          )}
                          <p><strong>Zoom Link Emailed:</strong> <span className={`font-bold ${selectedItem.zoomLinkSent ? 'text-sage' : 'text-charcoal-light'}`}>{selectedItem.zoomLinkSent ? 'Yes' : 'Automated 1 hr before session'}</span></p>
                        </div>

                        {selectedItem.paymentScreenshot && selectedItem.paymentScreenshot !== 'razorpay_online' && (
                          <div className="mt-2 pt-2 border-t flex flex-col gap-1.5">
                            <span className="font-bold text-charcoal-dark text-[10px] uppercase">Payment Screenshot Proof:</span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setPreviewImage(getImageUrl(selectedItem.paymentScreenshot))}
                                className="block rounded-lg overflow-hidden border shadow-sm cursor-pointer hover:opacity-90"
                              >
                                <img src={getImageUrl(selectedItem.paymentScreenshot)} alt="Payment Proof" className="w-24 h-24 object-cover" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewImage(getImageUrl(selectedItem.paymentScreenshot))}
                                className="text-sage font-bold hover:underline text-[11px] cursor-pointer"
                              >
                                View Full Size Receipt ↗
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Approval Actions */}
                      {selectedItem.paymentStatus === 'Pending' && (
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleApproveRegistration(selectedItem._id)}
                            className="flex-1 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl text-center shadow-sm"
                          >
                            Approve Webinar Registration
                          </button>
                          <button
                            onClick={() => handleRejectRegistration(selectedItem._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-center shadow-sm"
                          >
                            Reject Registration
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Program Registration Single Details */}
                  {activeTab === 'program-registrations' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h4 className="font-bold text-charcoal-dark font-serif text-sm">Program Enrollment Record</h4>
                          <p className="text-[10px] text-charcoal-light">Enrolled for: <strong className="text-charcoal-dark">{selectedItem.program?.title || 'Ascension Program'}</strong></p>
                        </div>
                        <span className={`py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          selectedItem.paymentStatus === 'Paid' ? 'bg-sage/10 text-sage' :
                          selectedItem.paymentStatus === 'Rejected' ? 'bg-red-500/10 text-red-600' :
                          'bg-gold/20 text-gold-dark'
                        }`}>
                          Status: {selectedItem.paymentStatus}
                        </span>
                      </div>

                      {/* User & Enrollment Details */}
                      <div className="bg-cream/70 p-4 rounded-xl border border-cream-dark/60 grid grid-cols-1 sm:grid-cols-2 gap-3 leading-relaxed">
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Student Name</p>
                          <p className="font-bold text-charcoal-dark text-sm">{selectedItem.name || selectedItem.user?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Email Address</p>
                          <p className="font-medium text-charcoal"><a href={`mailto:${selectedItem.email || selectedItem.user?.email}`} className="text-sage hover:underline">{selectedItem.email || selectedItem.user?.email || 'N/A'}</a></p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Phone / WhatsApp</p>
                          <p className="font-medium text-charcoal">{selectedItem.phone || selectedItem.user?.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Enrolled On</p>
                          <p className="font-medium text-charcoal">{new Date(selectedItem.createdAt).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Payment & Transaction Card */}
                      <div className="bg-white/80 p-4 rounded-xl border border-cream-dark/60 flex flex-col gap-2">
                        <h5 className="font-bold text-charcoal-dark text-[11px] uppercase tracking-wider border-b pb-1">Payment & Verification Details</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <p><strong>Payment Mode:</strong> <span className="font-semibold text-charcoal-dark">{selectedItem.paymentScreenshot === 'razorpay_online' || selectedItem.transactionId?.startsWith('pay_') ? 'Razorpay Online Gateway' : 'UPI QR Code / Manual'}</span></p>
                          <p><strong>Program Fee:</strong> <span className="font-bold text-sage">₹{selectedItem.program?.pricing?.toLocaleString() || selectedItem.program?.sellingPrice?.toLocaleString() || 'N/A'}</span></p>
                          <p className="sm:col-span-2"><strong>Transaction ID / Razorpay Ref:</strong> <code className="bg-cream px-1.5 py-0.5 rounded text-[10px] font-mono text-charcoal-dark border">{selectedItem.transactionId || 'N/A'}</code></p>
                        </div>

                        {selectedItem.paymentScreenshot && selectedItem.paymentScreenshot !== 'razorpay_online' && (
                          <div className="mt-2 pt-2 border-t flex flex-col gap-1.5">
                            <span className="font-bold text-charcoal-dark text-[10px] uppercase">Payment Screenshot Proof:</span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setPreviewImage(getImageUrl(selectedItem.paymentScreenshot))}
                                className="block rounded-lg overflow-hidden border shadow-sm cursor-pointer hover:opacity-90"
                              >
                                <img src={getImageUrl(selectedItem.paymentScreenshot)} alt="Payment Proof" className="w-24 h-24 object-cover" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewImage(getImageUrl(selectedItem.paymentScreenshot))}
                                className="text-sage font-bold hover:underline text-[11px] cursor-pointer"
                              >
                                View Full Size Receipt ↗
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Approval Actions */}
                      {selectedItem.paymentStatus === 'Pending' && (
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleApproveProgramRegistration(selectedItem._id)}
                            className="flex-1 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl text-center shadow-sm"
                          >
                            Approve Enrollment (Mark as Paid)
                          </button>
                          <button
                            onClick={() => handleRejectProgramRegistration(selectedItem._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-center shadow-sm"
                          >
                            Reject Enrollment
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Workshop Registration Single Details */}
                  {activeTab === 'workshop-registrations' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h4 className="font-bold text-charcoal-dark font-serif text-sm">Workshop Registration Record</h4>
                          <p className="text-[10px] text-charcoal-light">Workshop: <strong className="text-charcoal-dark">{selectedItem.workshop?.title || 'Workshop'}</strong></p>
                        </div>
                        <span className={`py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          selectedItem.paymentStatus === 'Paid' ? 'bg-sage/10 text-sage' :
                          selectedItem.paymentStatus === 'Rejected' ? 'bg-red-500/10 text-red-600' :
                          'bg-gold/20 text-gold-dark'
                        }`}>
                          Status: {selectedItem.paymentStatus}
                        </span>
                      </div>

                      {/* User details */}
                      <div className="bg-cream/70 p-4 rounded-xl border border-cream-dark/60 grid grid-cols-1 sm:grid-cols-2 gap-3 leading-relaxed">
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Participant Name</p>
                          <p className="font-bold text-charcoal-dark text-sm">{selectedItem.name || selectedItem.user?.name || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Email Address</p>
                          <p className="font-medium text-charcoal"><a href={`mailto:${selectedItem.email || selectedItem.user?.email}`} className="text-sage hover:underline">{selectedItem.email || selectedItem.user?.email || 'N/A'}</a></p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Mobile / WhatsApp</p>
                          <p className="font-medium text-charcoal">{selectedItem.phone || selectedItem.user?.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Registered Date</p>
                          <p className="font-medium text-charcoal">{new Date(selectedItem.createdAt || selectedItem.registeredAt).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Workshop & Payment Details */}
                      <div className="bg-white/80 p-4 rounded-xl border border-cream-dark/60 flex flex-col gap-2">
                        <h5 className="font-bold text-charcoal-dark text-[11px] uppercase tracking-wider border-b pb-1">Workshop & Transaction Details</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <p><strong>Payment Mode:</strong> <span className="font-semibold text-charcoal-dark">{selectedItem.paymentScreenshot === 'razorpay_online' || selectedItem.transactionId?.startsWith('pay_') ? 'Razorpay Online Gateway' : 'UPI QR / Manual Proof'}</span></p>
                          <p><strong>Workshop Fee:</strong> <span className="font-bold text-sage">₹{selectedItem.workshop?.pricing?.toLocaleString() || 'N/A'}</span></p>
                          <p className="sm:col-span-2"><strong>Transaction ID / Razorpay Ref:</strong> <code className="bg-cream px-1.5 py-0.5 rounded text-[10px] font-mono text-charcoal-dark border">{selectedItem.transactionId || 'N/A'}</code></p>
                          {selectedItem.workshop?.zoomLink && (
                            <p className="sm:col-span-2"><strong>Zoom Link:</strong> <a href={selectedItem.workshop.zoomLink} target="_blank" rel="noopener noreferrer" className="text-sage hover:underline font-medium">{selectedItem.workshop.zoomLink}</a></p>
                          )}
                        </div>

                        {selectedItem.paymentScreenshot && selectedItem.paymentScreenshot !== 'razorpay_online' && (
                          <div className="mt-2 pt-2 border-t flex flex-col gap-1.5">
                            <span className="font-bold text-charcoal-dark text-[10px] uppercase">Payment Screenshot Proof:</span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setPreviewImage(getImageUrl(selectedItem.paymentScreenshot))}
                                className="block rounded-lg overflow-hidden border shadow-sm cursor-pointer hover:opacity-90"
                              >
                                <img src={getImageUrl(selectedItem.paymentScreenshot)} alt="Payment Proof" className="w-24 h-24 object-cover" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewImage(getImageUrl(selectedItem.paymentScreenshot))}
                                className="text-sage font-bold hover:underline text-[11px] cursor-pointer"
                              >
                                View Full Size Receipt ↗
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Approval Actions */}
                      {selectedItem.paymentStatus === 'Pending' && (
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleApproveWorkshopRegistration(selectedItem._id)}
                            className="flex-1 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 rounded-xl text-center shadow-sm"
                          >
                            Approve Workshop Registration
                          </button>
                          <button
                            onClick={() => handleRejectWorkshopRegistration(selectedItem._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-center shadow-sm"
                          >
                            Reject Registration
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Complete Order Details */}
                  {activeTab === 'orders' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h4 className="font-bold text-charcoal-dark font-serif text-sm">Shop Order Details</h4>
                          <p className="text-[10px] text-charcoal-light">Placed on: {new Date(selectedItem.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            selectedItem.paymentStatus === 'paid' ? 'bg-sage/10 text-sage' :
                            selectedItem.paymentStatus === 'failed' ? 'bg-red-500/10 text-red-600' :
                            'bg-gold/20 text-gold-dark'
                          }`}>
                            Payment: {selectedItem.paymentStatus}
                          </span>
                          <span className={`py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            selectedItem.status === 'delivered' ? 'bg-sage/10 text-sage' :
                            selectedItem.status === 'cancelled' ? 'bg-red-500/10 text-red-600' :
                            'bg-cream-dark text-charcoal-dark'
                          }`}>
                            {selectedItem.status}
                          </span>
                        </div>
                      </div>

                      {/* Customer & Shipping Details */}
                      <div className="bg-cream/70 p-4 rounded-xl border border-cream-dark/60 grid grid-cols-1 sm:grid-cols-2 gap-3 leading-relaxed">
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Customer Name</p>
                          <p className="font-bold text-charcoal-dark text-sm">{selectedItem.user?.name || 'Customer'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Email Address</p>
                          <p className="font-medium text-charcoal"><a href={`mailto:${selectedItem.user?.email}`} className="text-sage hover:underline">{selectedItem.user?.email}</a></p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Delivery Phone</p>
                          <p className="font-medium text-charcoal">{selectedItem.shippingAddress?.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Delivery Address</p>
                          <p className="font-medium text-charcoal text-[11px] leading-snug">
                            {selectedItem.shippingAddress?.address}, {selectedItem.shippingAddress?.city}, {selectedItem.shippingAddress?.state} - {selectedItem.shippingAddress?.postalCode}, {selectedItem.shippingAddress?.country}
                          </p>
                        </div>
                      </div>

                      {/* Payment Identifiers */}
                      <div className="bg-white/80 p-3.5 rounded-xl border border-cream-dark/60 flex flex-col gap-2">
                        <h5 className="font-bold text-charcoal-dark text-[11px] uppercase tracking-wider border-b pb-1">Payment & Order Identifiers</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <p><strong>Payment Channel:</strong> <span className="font-semibold text-charcoal-dark">{selectedItem.paymentType || 'RAZORPAY'}</span></p>
                          <p><strong>Razorpay Payment ID:</strong> <code className="bg-cream px-1.5 py-0.5 rounded text-[10px] font-mono text-charcoal-dark border">{selectedItem.paymentId || selectedItem.transactionId || 'N/A'}</code></p>
                          <p><strong>Razorpay / Internal Order ID:</strong> <code className="bg-cream px-1.5 py-0.5 rounded text-[10px] font-mono text-charcoal-dark border">{selectedItem.orderId || selectedItem._id}</code></p>
                          <p><strong>Total Amount Paid:</strong> <span className="font-bold text-sage text-sm">₹{selectedItem.totalAmount?.toLocaleString()}</span></p>
                        </div>

                        {selectedItem.paymentScreenshot && selectedItem.paymentScreenshot !== 'razorpay_online' && (
                          <div className="mt-2 pt-2 border-t flex flex-col gap-1.5">
                            <span className="font-bold text-charcoal-dark text-[10px] uppercase">Payment Screenshot Proof:</span>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setPreviewImage(getImageUrl(selectedItem.paymentScreenshot))}
                                className="block rounded-lg overflow-hidden border shadow-sm cursor-pointer hover:opacity-90"
                              >
                                <img src={getImageUrl(selectedItem.paymentScreenshot)} alt="Payment Proof" className="w-20 h-20 object-cover" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setPreviewImage(getImageUrl(selectedItem.paymentScreenshot))}
                                className="text-sage font-bold hover:underline text-[11px] cursor-pointer"
                              >
                                View Full Size Receipt ↗
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Itemized Cart Products Table */}
                      <div className="flex flex-col gap-2">
                        <h5 className="font-bold text-charcoal-dark text-[11px] uppercase tracking-wider border-b pb-1">
                          Purchased Products ({selectedItem.items?.length || 0})
                        </h5>
                        <div className="border border-cream-dark/60 rounded-xl overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-cream text-[10px] uppercase font-bold text-charcoal-light border-b border-cream-dark/60">
                              <tr>
                                <th className="p-2.5">Product</th>
                                <th className="p-2.5 text-center">Qty</th>
                                <th className="p-2.5 text-right">Price</th>
                                <th className="p-2.5 text-right">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-cream-dark/40 bg-white">
                              {selectedItem.items?.map((item, idx) => {
                                const prodName = item.name || item.product?.name || 'Product';
                                const prodImg = item.product?.images?.[0] || item.product?.image;
                                const unitPrice = item.price || item.product?.pricing || 0;
                                const lineTotal = (item.quantity || 1) * unitPrice;
                                return (
                                  <tr key={idx} className="hover:bg-cream/20">
                                    <td className="p-2.5 flex items-center gap-2.5">
                                      {prodImg ? (
                                        <img src={getImageUrl(prodImg)} alt={prodName} className="w-10 h-10 object-cover rounded-lg border shrink-0 bg-cream" />
                                      ) : (
                                        <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center text-[10px] text-charcoal-light shrink-0">🛒</div>
                                      )}
                                      <span className="font-bold text-charcoal-dark text-[11px] leading-tight line-clamp-2">{prodName}</span>
                                    </td>
                                    <td className="p-2.5 text-center font-bold text-charcoal">{item.quantity}</td>
                                    <td className="p-2.5 text-right text-charcoal-light">₹{unitPrice.toLocaleString()}</td>
                                    <td className="p-2.5 text-right font-bold text-charcoal-dark">₹{lineTotal.toLocaleString()}</td>
                                  </tr>
                                );
                              })}
                            </tbody>
                            <tfoot className="bg-cream/50 font-bold border-t border-cream-dark/60">
                              <tr>
                                <td colSpan="3" className="p-2.5 text-right uppercase text-[10px] text-charcoal-light">Grand Total:</td>
                                <td className="p-2.5 text-right text-sage text-sm font-serif">₹{selectedItem.totalAmount?.toLocaleString()}</td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>

                      {/* Order Fulfillment & Status Update */}
                      <div className="bg-cream/40 p-4 rounded-xl border border-cream-dark/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1">
                        <div className="flex flex-col gap-1">
                          <label className="font-bold text-charcoal-dark uppercase text-[10px] tracking-wider">Update Fulfillment Status</label>
                          <select
                            value={selectedItem.status}
                            onChange={(e) => handleUpdateStatus(selectedItem._id, 'status', e.target.value)}
                            className="bg-white border border-cream-dark rounded-xl py-2 px-3 text-xs font-semibold focus:outline-none focus:border-gold"
                          >
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>

                        {selectedItem.paymentStatus === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleApproveOrderPayment(selectedItem._id)}
                            className="bg-sage hover:bg-sage-dark text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm self-end sm:self-auto"
                          >
                            Mark Payment as Paid
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Service Bookings query viewer */}
                  {activeTab === 'service-bookings' && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <div>
                          <h4 className="font-bold text-charcoal-dark font-serif text-sm">1-on-1 Consultation Booking</h4>
                          <p className="text-[10px] text-charcoal-light">Received on: {new Date(selectedItem.createdAt).toLocaleString()}</p>
                        </div>
                        <span className={`py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          selectedItem.status === 'resolved' ? 'bg-sage/10 text-sage' : 'bg-gold/20 text-gold-dark'
                        }`}>
                          {selectedItem.status === 'resolved' ? 'Confirmed / Resolved' : 'Pending Verification'}
                        </span>
                      </div>

                      <div className="bg-cream/70 p-4 rounded-xl border border-cream-dark/60 grid grid-cols-1 sm:grid-cols-2 gap-3 leading-relaxed">
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Client Name</p>
                          <p className="font-bold text-charcoal-dark text-sm">{selectedItem.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Email Address</p>
                          <p className="font-medium text-charcoal"><a href={`mailto:${selectedItem.email}`} className="text-sage hover:underline">{selectedItem.email}</a></p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Phone / WhatsApp</p>
                          <p className="font-medium text-charcoal">{selectedItem.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-charcoal-light uppercase font-bold tracking-wider">Transaction Reference ID</p>
                          <code className="bg-cream px-1.5 py-0.5 rounded text-[10px] font-mono text-charcoal-dark border">{selectedItem.transactionId || 'N/A'}</code>
                        </div>
                      </div>

                      {selectedItem.paymentScreenshot && selectedItem.paymentScreenshot !== 'razorpay_online' && (
                        <div className="bg-white/80 p-3.5 rounded-xl border border-cream-dark/60 flex flex-col gap-1.5">
                          <span className="font-bold text-charcoal-dark text-[10px] uppercase">Payment Screenshot:</span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setPreviewImage(getImageUrl(selectedItem.paymentScreenshot))}
                              className="block rounded-lg overflow-hidden border shadow-sm cursor-pointer hover:opacity-90"
                            >
                              <img src={getImageUrl(selectedItem.paymentScreenshot)} alt="Payment Screenshot" className="w-20 h-20 object-cover" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewImage(getImageUrl(selectedItem.paymentScreenshot))}
                              className="text-sage font-bold hover:underline text-[11px] cursor-pointer"
                            >
                              View Full Size Receipt ↗
                            </button>
                          </div>
                        </div>
                      )}

                      <div className="bg-white/80 p-3.5 rounded-xl border border-cream-dark/60 flex flex-col gap-1">
                        <span className="font-bold text-charcoal-dark text-[10px] uppercase tracking-wider">Session Details & Notes:</span>
                        <p className="font-sans whitespace-pre-wrap text-charcoal text-[11px] leading-relaxed bg-cream/40 p-2.5 rounded-lg border">
                          {selectedItem.message}
                        </p>
                      </div>

                      {selectedItem.status === 'unread' && (
                        <button
                          type="button"
                          onClick={() => {
                            handleUpdateStatus(selectedItem._id, 'status', 'resolved');
                            setShowModal(false);
                          }}
                          className="bg-sage hover:bg-sage-dark text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm"
                        >
                          Mark Consultation as Confirmed & Resolved
                        </button>
                      )}
                    </div>
                  )}

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
                            <button
                              type="button"
                              onClick={() => setPreviewImage(getImageUrl(selectedItem.imageUrl))}
                              className="block w-full cursor-zoom-in"
                            >
                              <img src={getImageUrl(selectedItem.imageUrl)} className="w-full max-h-64 object-contain rounded-xl border bg-white" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewImage(getImageUrl(selectedItem.imageUrl))}
                              className="text-[9px] text-sage font-bold block text-center mt-1 hover:underline cursor-pointer"
                            >
                              (Click image to view in lightbox preview ↗)
                            </button>
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
                                      className="w-full h-full object-cover cursor-pointer" 
                                      onClick={() => setPreviewImage(getImageUrl(sub.photo))}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => setPreviewImage(getImageUrl(sub.photo))}
                                      className="absolute inset-0 bg-charcoal/20 opacity-0 hover:opacity-100 flex items-center justify-center text-white text-[9px] font-bold cursor-pointer"
                                    >
                                      Preview ↗
                                    </button>
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

                  {/* Donation verify logs details */}
                  {activeTab === 'donations' && (
                    <div className="flex flex-col gap-3">
                      <h4 className="font-bold text-charcoal-dark border-b pb-1">Donation Transaction Verification</h4>
                      <div className="bg-cream p-3.5 rounded-xl border flex flex-col gap-1 text-[11.5px] leading-relaxed">
                        <p><strong>Donor:</strong> {selectedItem.name} ({selectedItem.email || 'N/A'})</p>
                        <p><strong>Contact phone:</strong> {selectedItem.phone || 'N/A'}</p>
                        <p><strong>Amount:</strong> <span className="font-bold text-sage">₹{selectedItem.amount?.toLocaleString()}</span></p>
                        <p><strong>Type:</strong> {selectedItem.paymentType} | Ref: {selectedItem.transactionId}</p>
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
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between border-b pb-2">
                        <h4 className="font-bold text-charcoal-dark font-serif text-sm">
                          {selectedItem.message?.includes('[HOROSCOPE') || selectedItem.message?.includes('HOROSCOPE') || selectedItem.message?.includes('AURA PHOTO')
                            ? '✨ Horoscope & Facial Aura Request Details'
                            : 'Message Query Details'}
                        </h4>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          selectedItem.status === 'resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          Status: {selectedItem.status}
                        </span>
                      </div>

                      <div className="bg-cream p-4 rounded-xl border flex flex-col gap-2 leading-relaxed text-[11.5px]">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <p><strong>Sender:</strong> {selectedItem.name}</p>
                          <p><strong>Contact Email:</strong> <a href={`mailto:${selectedItem.email}`} className="text-sage hover:underline font-medium">{selectedItem.email}</a></p>
                          <p><strong>Phone:</strong> {selectedItem.phone || 'N/A'}</p>
                          <p><strong>Received:</strong> {new Date(selectedItem.createdAt).toLocaleString()}</p>
                        </div>

                        {selectedItem.paymentScreenshot && (
                          <div className="mt-2 pt-2 border-t flex flex-col gap-1.5">
                            <span className="font-bold text-charcoal-dark uppercase tracking-wider text-[10px]">
                              Uploaded Photo / Live Selfie:
                            </span>
                            <div className="flex items-center gap-3">
                              <a 
                                href={getImageUrl(selectedItem.paymentScreenshot)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="block rounded-lg overflow-hidden border border-gold/40 shadow-sm hover:opacity-90 transition-opacity"
                              >
                                <img 
                                  src={getImageUrl(selectedItem.paymentScreenshot)} 
                                  alt="Customer Aura Snapshot" 
                                  className="w-20 h-20 object-cover" 
                                />
                              </a>
                              <a 
                                href={getImageUrl(selectedItem.paymentScreenshot)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-[11px] text-sage font-bold hover:underline"
                              >
                                View Full Size Image ↗
                              </a>
                            </div>
                          </div>
                        )}

                        <div className="mt-2 border-t pt-2">
                          <span className="font-bold text-charcoal-dark uppercase tracking-wider text-[10px] block mb-1">
                            Request Content:
                          </span>
                          <p className="font-sans whitespace-pre-wrap bg-white/70 p-3 rounded-lg border border-cream-dark/50 text-charcoal text-[11px] leading-relaxed">
                            {selectedItem.message}
                          </p>
                        </div>
                      </div>

                      {/* Display previously sent crystal recommendation if resolved */}
                      {selectedItem.recommendedCrystal && (
                        <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 flex flex-col gap-2">
                          <div className="flex items-center gap-1.5 text-gold-dark font-bold text-xs uppercase tracking-wider">
                            <Sparkles className="w-4 h-4" />
                            <span>Recommendation Dispatched to User</span>
                          </div>
                          <div className="text-[11.5px] flex flex-col gap-1 text-charcoal">
                            <p><strong>Recommended Crystal:</strong> <span className="font-bold text-charcoal-dark">{selectedItem.recommendedCrystal}</span></p>
                            {selectedItem.crystalBenefits && (
                              <p><strong>Spiritual Benefits:</strong> {selectedItem.crystalBenefits}</p>
                            )}
                            {selectedItem.adminReplyMessage && (
                              <p><strong>Guidance / Note:</strong> <em>"{selectedItem.adminReplyMessage}"</em></p>
                            )}
                            {selectedItem.resolvedAt && (
                              <p className="text-[10px] text-charcoal-light mt-1">Dispatched on: {new Date(selectedItem.resolvedAt).toLocaleString()}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Interactive Form for Sending/Updating Crystal Recommendation */}
                      <div className="border border-gold/30 bg-white/90 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-sm">
                        <div className="flex flex-col gap-0.5 border-b border-cream-dark/50 pb-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-gold-dark flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5" />
                            Personalized Crystal Reply & Resolution
                          </span>
                          <h5 className="font-serif font-bold text-xs text-charcoal-dark">
                            Type Crystal Recommendation for {selectedItem.name}
                          </h5>
                          <p className="text-[10px] text-charcoal-light">
                            Submitting this will automatically email the customer at <strong>{selectedItem.email}</strong> with your personalized crystal recommendation and mark this query as resolved.
                          </p>
                        </div>

                        <div className="flex flex-col gap-2.5 text-[11px]">
                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-charcoal-dark text-[10px] uppercase tracking-wider">
                              Recommended Crystal / Stone Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 7 Chakra Pyrite & Tiger Eye Abundance Bracelet"
                              value={recommendedCrystal}
                              onChange={(e) => setRecommendedCrystal(e.target.value)}
                              className="bg-cream-light/60 border border-cream-dark rounded-xl py-2 px-3 focus:outline-none focus:border-gold text-xs"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-charcoal-dark text-[10px] uppercase tracking-wider">
                              Spiritual & Healing Benefits (Optional)
                            </label>
                            <textarea
                              rows="2"
                              placeholder="e.g. Harmonizes solar plexus energy, attracts financial abundance, and grounds emotional vibrations."
                              value={crystalBenefits}
                              onChange={(e) => setCrystalBenefits(e.target.value)}
                              className="bg-cream-light/60 border border-cream-dark rounded-xl py-2 px-3 focus:outline-none focus:border-gold text-xs"
                            />
                          </div>

                          <div className="flex flex-col gap-1">
                            <label className="font-bold text-charcoal-dark text-[10px] uppercase tracking-wider">
                              Personal Guidance / Note from Sonali (Optional)
                            </label>
                            <textarea
                              rows="2"
                              placeholder="e.g. Wear this on your right wrist after energizing under the morning sunlight..."
                              value={adminReplyMessage}
                              onChange={(e) => setAdminReplyMessage(e.target.value)}
                              className="bg-cream-light/60 border border-cream-dark rounded-xl py-2 px-3 focus:outline-none focus:border-gold text-xs"
                            />
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2 pt-1">
                            <button
                              type="button"
                              disabled={sendingRecommendation}
                              onClick={() => handleSendCrystalRecommendation(selectedItem._id)}
                              className="flex-1 bg-gold hover:bg-gold-dark text-charcoal-dark font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                            >
                              {sendingRecommendation ? (
                                <>
                                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-charcoal-dark border-t-transparent" />
                                  <span>Sending Email & Resolving...</span>
                                </>
                              ) : (
                                <>
                                  <Sparkles className="w-3.5 h-3.5" />
                                  <span>{selectedItem.status === 'resolved' ? 'Update & Resend Crystal Email' : 'Email Crystal Recommendation & Resolve'}</span>
                                </>
                              )}
                            </button>

                            {selectedItem.status === 'unread' && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleUpdateStatus(selectedItem._id, 'status', 'resolved');
                                  setShowModal(false);
                                }}
                                className="bg-cream hover:bg-cream-dark text-charcoal-light font-bold py-2.5 px-4 rounded-xl text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Mark Resolved Without Email
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
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
                            <option value="Energy Bottles">Energy Bottles</option>
                            <option value="Bath Salts">Bath Salts</option>
                            <option value="Healing Camphor">Healing Camphor</option>
                            <option value="Healing Oils">Healing Oils</option>
                            <option value="Candles">Candles</option>
                            <option value="Crystals">Crystals</option>
                            <option value="Pyramids">Pyramids</option>
                            <option value="Lamps">Lamps</option>
                            <option value="Crystal Trees">Crystal Trees</option>
                            <option value="Pendants">Pendants</option>
                            <option value="Bracelets">Bracelets</option>
                            <option value="Healing Stones">Healing Stones</option>
                            <option value="Selenite Products">Selenite Products</option>
                            <option value="Trays">Trays</option>
                            <option value="Decorative Pieces">Decorative Pieces</option>
                            <option value="Wax Melts">Wax Melts</option>
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
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">WhatsApp Group Link (Optional)</label>
                        <input type="url" placeholder="https://chat.whatsapp.com/..." value={webinarWhatsappLink} onChange={(e) => setWebinarWhatsappLink(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none font-mono" />
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
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">WhatsApp Community Group Link</label>
                        <input type="text" placeholder="e.g. https://chat.whatsapp.com/..." value={programWhatsappLink} onChange={(e) => setProgramWhatsappLink(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-bold text-charcoal-light uppercase text-[10px]">Live Zoom Meeting Link (Optional)</label>
                        <input type="text" placeholder="e.g. https://us06web.zoom.us/j/..." value={programZoomLink} onChange={(e) => setProgramZoomLink(e.target.value)} className="bg-cream-light border rounded-xl py-2 px-3 focus:outline-none" />
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

      {/* Screenshot Lightbox Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[100] bg-charcoal/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl flex flex-col gap-3 max-h-[90vh]">
            <div className="flex justify-between items-center border-b pb-2">
              <h4 className="font-bold text-charcoal-dark text-xs uppercase tracking-wider flex items-center gap-1.5">
                📷 Payment Receipt / Uploaded Proof
              </h4>
              <button 
                type="button" 
                onClick={() => setPreviewImage(null)} 
                className="p-1 text-charcoal/60 hover:text-red-600 rounded-lg hover:bg-cream transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-auto max-h-[65vh] flex items-center justify-center bg-cream/40 rounded-xl p-2 border border-cream-dark/50">
              <img 
                src={previewImage} 
                alt="Payment Proof Screenshot" 
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-sm" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=Screenshot+Not+Available';
                }}
              />
            </div>
            <div className="flex justify-between items-center pt-2 border-t text-xs">
              <a 
                href={previewImage} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sage font-bold hover:underline flex items-center gap-1"
              >
                Open in Full Tab ↗
              </a>
              <button 
                type="button" 
                onClick={() => setPreviewImage(null)} 
                className="bg-charcoal text-white font-bold py-1.5 px-4 rounded-xl text-xs hover:bg-charcoal-dark transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Full Profile & Activity Viewer Modal */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto text-left border border-cream-dark/60 animate-slide-up">
            
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-cream-dark pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-sage/20 text-sage-dark font-serif font-bold text-xl flex items-center justify-center border border-sage/30 uppercase shadow-inner">
                  {selectedUserDetail.name ? selectedUserDetail.name.charAt(0) : 'U'}
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-charcoal-dark flex items-center gap-2">
                    {selectedUserDetail.name}
                    {selectedUserDetail.isOnline ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        🟢 Online Now
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-charcoal-light bg-cream-dark px-2 py-0.5 rounded-full">
                        ⚪ Offline
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-charcoal-light">{selectedUserDetail.email}</p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedUserDetail(null)} 
                className="p-1.5 text-charcoal/60 hover:text-charcoal rounded-xl hover:bg-cream transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-cream/40 p-3 rounded-2xl border border-cream-dark/60 text-center">
                <span className="text-[10px] text-charcoal-light uppercase font-bold">Orders Placed</span>
                <p className="text-xl font-bold text-charcoal-dark mt-0.5">{selectedUserDetail.ordersCount || 0}</p>
              </div>
              <div className="bg-cream/40 p-3 rounded-2xl border border-cream-dark/60 text-center">
                <span className="text-[10px] text-charcoal-light uppercase font-bold">Enrolled Programs</span>
                <p className="text-xl font-bold text-charcoal-dark mt-0.5">{selectedUserDetail.registrationsCount || 0}</p>
              </div>
              <div className="bg-cream/40 p-3 rounded-2xl border border-cream-dark/60 text-center">
                <span className="text-[10px] text-charcoal-light uppercase font-bold">Gratitude Tasks</span>
                <p className="text-xl font-bold text-charcoal-dark mt-0.5">{selectedUserDetail.submissionsCount || 0}</p>
              </div>
            </div>

            {/* Account & Activity Details */}
            <div className="flex flex-col gap-2 bg-cream/20 p-4 rounded-2xl border border-cream-dark/50 text-xs">
              <div className="flex justify-between py-1 border-b border-cream-dark/40">
                <span className="text-charcoal-light font-medium">User ID:</span>
                <span className="font-mono text-charcoal-dark font-bold select-all">{selectedUserDetail._id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cream-dark/40">
                <span className="text-charcoal-light font-medium">Account Role:</span>
                <span className={`font-bold uppercase text-[10px] px-2 py-0.5 rounded ${
                  selectedUserDetail.role === 'admin' ? 'bg-gold/15 text-gold-dark' : 'bg-sage/15 text-sage-dark'
                }`}>
                  {selectedUserDetail.role}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-cream-dark/40">
                <span className="text-charcoal-light font-medium">Registered Date:</span>
                <span className="text-charcoal-dark font-semibold">{new Date(selectedUserDetail.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-cream-dark/40">
                <span className="text-charcoal-light font-medium">Last Login:</span>
                <span className="text-charcoal-dark font-semibold">
                  {selectedUserDetail.lastLogin ? new Date(selectedUserDetail.lastLogin).toLocaleString() : 'Never'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-cream-dark/40">
                <span className="text-charcoal-light font-medium">Last Active Time:</span>
                <span className="text-charcoal-dark font-semibold">
                  {selectedUserDetail.lastActive ? `${new Date(selectedUserDetail.lastActive).toLocaleString()} (${formatTimeAgo(selectedUserDetail.lastActive)})` : 'Never'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-cream-dark/40">
                <span className="text-charcoal-light font-medium">Total Logins Recorded:</span>
                <span className="text-charcoal-dark font-bold">{selectedUserDetail.loginCount || 0} times</span>
              </div>
              {selectedUserDetail.ipAddress && (
                <div className="flex justify-between py-1 border-b border-cream-dark/40">
                  <span className="text-charcoal-light font-medium">Last IP Address:</span>
                  <span className="font-mono text-charcoal-dark">{selectedUserDetail.ipAddress}</span>
                </div>
              )}
              {selectedUserDetail.userAgent && (
                <div className="flex flex-col gap-1 py-1">
                  <span className="text-charcoal-light font-medium">Device / User Agent:</span>
                  <span className="font-mono text-[10px] text-charcoal-dark bg-white p-2 rounded-xl border border-cream-dark/60 break-all">
                    {selectedUserDetail.userAgent}
                  </span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-cream-dark text-xs">
              {selectedUserDetail._id !== user._id ? (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      await handleUpdateUserRole(
                        selectedUserDetail._id, 
                        selectedUserDetail.role === 'admin' ? 'user' : 'admin'
                      );
                      setSelectedUserDetail(null);
                    }}
                    disabled={updatingUserRole}
                    className="bg-gold/20 hover:bg-gold/30 text-gold-dark font-bold px-3 py-2 rounded-xl transition-all text-xs"
                  >
                    Change to {selectedUserDetail.role === 'admin' ? 'User' : 'Admin'}
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await handleDelete(selectedUserDetail._id);
                      setSelectedUserDetail(null);
                    }}
                    className="bg-red-50 hover:bg-red-100 text-red-700 font-bold px-3 py-2 rounded-xl transition-all text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete User</span>
                  </button>
                </div>
              ) : (
                <span className="text-[11px] text-gold-dark font-bold italic">Your Active Admin Session</span>
              )}
              <button 
                type="button" 
                onClick={() => setSelectedUserDetail(null)} 
                className="bg-charcoal text-white font-bold py-2 px-4 rounded-xl text-xs hover:bg-charcoal-dark transition-colors ml-auto"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
