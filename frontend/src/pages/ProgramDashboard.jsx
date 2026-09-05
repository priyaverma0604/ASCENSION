import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Lock, CheckCircle, UploadCloud, Image as ImageIcon, 
  ArrowRight, Sparkles, Compass, AlertCircle, Eye,
  Calendar, Clock, Video, MessageSquare, Star, ExternalLink, ShieldCheck, BookOpen, UserCheck
} from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase}${path}`;
};

const DEFAULT_ANCESTRAL_SESSIONS = [
  { sessionNumber: 1, date: '24 September', title: 'Introduction to Ancestral Healing', description: 'Foundations of intergenerational trauma, understanding family karma, and initiating the connection to your ancestral lineage.', time: '9:00 PM - 11:00 PM IST' },
  { sessionNumber: 2, date: '26 September', title: 'Belief Work', description: 'Identifying and transforming core subconscious belief systems passed down across generations.', time: '9:00 PM - 11:00 PM IST' },
  { sessionNumber: 3, date: '30 September', title: 'Shadow Work', description: 'Uncovering and integrating the hidden, repressed ancestral shadow patterns and emotional imprints.', time: '9:00 PM - 11:00 PM IST' },
  { sessionNumber: 4, date: '1 October', title: 'Intuitive Method for AH', description: 'Developing intuitive faculties, channel connection, and spiritual perception for deep ancestral healing.', time: '9:00 PM - 11:00 PM IST' },
  { sessionNumber: 5, date: '5 October', title: 'Healing Family Line', description: 'Releasing generational burdens and harmonizing energies across the maternal and paternal bloodlines.', time: '9:00 PM - 11:00 PM IST' },
  { sessionNumber: 6, date: '6 October', title: 'Healing for Mother Ancestors', description: 'Dedicated deep-dive healing for the maternal ancestral lineage, clearing womb trauma and sacred feminine wounds.', time: '9:00 PM - 11:00 PM IST' },
  { sessionNumber: 7, date: '7 October', title: 'Replacing Family Beliefs', description: 'Installing empowering, high-vibrational soul affirmations and liberating ancestral belief structures.', time: '9:00 PM - 11:00 PM IST' },
  { sessionNumber: 8, date: '8 October', title: 'Healing for Family Tree', description: 'Comprehensive clearing of Pitrudosh and harmonizing roots, branches, and future generations of your family tree.', time: '9:00 PM - 11:00 PM IST' },
  { sessionNumber: 9, date: '10 October', title: 'Celebrating Family Karma', description: 'Honoring ancestral wisdom, anchoring divine blessings, gratitude integration, and celebrating ancestral peace.', time: '9:00 PM - 11:00 PM IST' },
  { sessionNumber: 10, date: 'Interactive Session', title: 'Live Interactive Session with Sonali Ma\'am', description: 'Exclusive interactive communication with Sonali Ma\'am for personal guidance, live Q&A, and energetic integration.', time: '9:00 PM - 11:00 PM IST', isBonus: true }
];

const ProgramDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [program, setProgram] = useState(null);
  const [progress, setProgress] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Submit form state
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  // Lightbox modal state
  const [lightboxImage, setLightboxImage] = useState(null);

  useEffect(() => {
    fetchProgramAndProgress();
  }, [id]);

  const fetchProgramAndProgress = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch program info
      const programRes = await axios.get(`/api/programs/${id}`);
      if (programRes.data.success) {
        const progData = programRes.data.data;
        setProgram(progData);
        
        // If sessions exist or ancestral program, default to session 1
        const isAncestral = progData.title && progData.title.toLowerCase().includes('ancestral');
        const sessList = (progData.sessions && progData.sessions.length > 0) ? progData.sessions : (isAncestral ? DEFAULT_ANCESTRAL_SESSIONS : []);
        if (sessList.length > 0) {
          setSelectedSession(sessList[0]);
        }
      }

      // Fetch user progress
      const progressRes = await axios.get(`/api/programs/${id}/progress`);
      if (progressRes.data.success) {
        setProgress(progressRes.data.data);
      }

      // Fetch assignments list (user view - locks/completed flags)
      const assignmentsRes = await axios.get(`/api/programs/${id}/assignments`);
      if (assignmentsRes.data.success) {
        setAssignments(assignmentsRes.data.data);
      }

      // Fetch details of active day assignment
      const activeRes = await axios.get(`/api/programs/${id}/assignments/current`);
      if (activeRes.data.success && activeRes.data.data) {
        setActiveAssignment(activeRes.data.data);
        setSelectedAssignment(activeRes.data.data);
      } else {
        setActiveAssignment(null);
        setSelectedAssignment(null);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load program dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssignmentDetails = async (dayNum) => {
    try {
      const res = await axios.get(`/api/programs/${id}/assignments/day/${dayNum}`);
      if (res.data.success) {
        setSelectedAssignment(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load assignment details.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file (PNG, JPG, JPEG, WEBP).');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    const isPhotoRequired = program && (program.title.toLowerCase().includes('gratitude') || program._id === '6a4963f49e941f93f91f5abf');

    if (isPhotoRequired && !selectedFile) {
      alert('Please select a photo of your work to upload.');
      return;
    }

    if (!activeAssignment) {
      alert('No active assignment loaded.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('photo', selectedFile);
      }

      const { data } = await axios.post(`/api/programs/assignments/${activeAssignment._id}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (data.success) {
        setSelectedFile(null);
        setPreviewUrl('');
        alert(data.message || 'Great job! Completed successfully. 🎉');
        await fetchProgramAndProgress();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-16 px-6 font-sans flex flex-col items-center justify-center gap-4">
        <div className="shimmer h-12 w-64 rounded-xl"></div>
        <div className="shimmer h-8 w-96 rounded-xl mt-4"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-5xl mt-8">
          <div className="lg:col-span-2 shimmer h-96 rounded-2xl"></div>
          <div className="shimmer h-96 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    const isExpired = error && error.toLowerCase().includes('expired');
    return (
      <div className="min-h-screen py-16 px-6 font-sans flex flex-col items-center justify-center text-center gap-4 bg-[#FFFDF7]">
        {isExpired ? (
          <div className="glass p-8 rounded-3xl border-2 border-red-500/20 text-center flex flex-col items-center justify-center gap-5 py-16 bg-red-500/5 max-w-md shadow-sm">
            <div className="bg-red-500/10 p-4 rounded-full text-red-500">
              <Calendar className="w-10 h-10 animate-pulse" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-charcoal-dark">Program Access Expired</h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Your 35-day access period to this program has expired. Please contact the administrator or re-enroll to gain access!
            </p>
          </div>
        ) : (
          <>
            <AlertCircle className="w-12 h-12 text-red-500" />
            <h2 className="font-serif text-2xl font-bold text-charcoal-dark">Something went wrong</h2>
            <p className="text-xs text-charcoal-light max-w-md">{error || 'Program details could not be found.'}</p>
          </>
        )}
        <button 
          onClick={() => navigate('/profile')}
          className="mt-4 bg-sage hover:bg-sage-dark text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all"
        >
          Back to Profile
        </button>
      </div>
    );
  }

  const isAncestral = program.title && program.title.toLowerCase().includes('ancestral');
  const hasSessions = (program.sessions && program.sessions.length > 0) || isAncestral;
  const sessionsList = (program.sessions && program.sessions.length > 0) ? program.sessions : (isAncestral ? DEFAULT_ANCESTRAL_SESSIONS : []);

  // Compute progress percentage
  const totalDays = program && program.duration ? (parseInt(program.duration, 10) || 30) : 30;
  const completedDaysCount = progress ? progress.submissions.length : 0;
  const progressPercent = Math.round((completedDaysCount / totalDays) * 100);

  const isPendingApproval = progress?.currentSubmission && progress.currentSubmission.status === 'pending';
  const isRejected = progress?.currentSubmission && progress.currentSubmission.status === 'rejected';

  const isPhotoRequired = program && (program.title.toLowerCase().includes('gratitude') || program._id === '6a4963f49e941f93f91f5abf');
  const isPrayerProgram = program && (program.title.toLowerCase().includes('prayer') || program._id === '6a4963f49e941f93f91f5ac1');

  const getEmbedVideoUrl = (contentString) => {
    if (!contentString) return null;
    const match = contentString.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const getWelcomeVideoUrl = () => {
    if (!program) return null;
    const title = program.title.toLowerCase();
    const progId = program._id.toString();
    
    if (title.includes('ancestral')) {
      return program.youtubeUrl || "https://www.youtube.com/embed/jIs3IH-brtg";
    }
    if (title.includes('gratitude') || progId === '6a4963f49e941f93f91f5abf') {
      return "https://www.youtube.com/embed/KeUipjriX50";
    }
    if (title.includes('affirmation') || progId === '6a4963f49e941f93f91f5abe') {
      return "https://www.youtube.com/embed/c97Tg9DfPNA";
    }
    if (title.includes('prayer') || progId === '6a4963f49e941f93f91f5ac1') {
      return "https://www.youtube.com/embed/YcvoQIqX6_U";
    }
    return program.youtubeUrl || null;
  };

  const getRemainingDaysText = () => {
    if (!progress || !progress.createdAt) return '';
    const startDate = new Date(progress.createdAt);
    const expirationDate = new Date(startDate.getTime() + 35 * 24 * 60 * 60 * 1000);
    const today = new Date();
    const diffTime = expirationDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const formattedExpiryDate = expirationDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });

    if (diffDays <= 0) {
      return `Expired on ${formattedExpiryDate}`;
    } else if (diffDays === 1) {
      return `Expires tomorrow (Expiry: ${formattedExpiryDate})`;
    } else {
      return `${diffDays} days remaining (Expiry: ${formattedExpiryDate})`;
    }
  };

  const isSelectedCompleted = selectedAssignment && progress && progress.submissions.some(sub => sub.day === selectedAssignment.dayNumber);
  const isSelectedActive = selectedAssignment && progress && selectedAssignment.dayNumber === progress.currentDay && !progress.completed;

  // Render Live Session Workshop Dashboard (e.g. Ancestral Healing Workshop 10 Sessions)
  if (hasSessions) {
    const currentSession = selectedSession || sessionsList[0] || {};
    const zoomUrl = program.zoomLink || "https://zoom.us/j/1234567890";

    return (
      <div className="min-h-screen py-12 px-4 md:px-8 font-sans bg-[#FFFDF7] relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          
          {/* Header Block */}
          <div className="text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cream-dark/60 pb-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[10px] text-sage tracking-[0.2em] uppercase bg-sage/10 px-2.5 py-0.5 rounded-full">
                  Enrolled Portal
                </span>
                <span className="font-bold text-[10px] text-gold-dark tracking-[0.2em] uppercase bg-gold/15 px-2.5 py-0.5 rounded-full border border-gold/30">
                  {program.duration || '10 Sessions'}
                </span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-dark">
                {program.title}
              </h1>
              <p className="text-xs text-charcoal-light max-w-2xl leading-relaxed">
                Welcome to your enrolled workshop portal. All sessions happen live from 9:00 PM to 11:00 PM IST. Access your Zoom classroom link, view the full session schedule, and join the exclusive interactive session with Sonali Ma'am.
              </p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="bg-cream hover:bg-cream-dark border border-cream-dark text-charcoal font-bold py-2.5 px-6 rounded-xl transition-all text-xs uppercase tracking-wider shrink-0"
            >
              Back to Profile
            </button>
          </div>

          {/* Live Zoom Access Bar */}
          <div className="glass p-6 rounded-3xl border-2 border-gold/30 bg-gradient-to-r from-cream-light via-[#FFFBF2] to-cream/60 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div className="flex items-start gap-4 text-left">
              <div className="p-3.5 bg-gold/15 border border-gold/30 rounded-2xl text-gold-dark shrink-0">
                <Video className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Live Classes on Zoom
                  </span>
                  <span className="text-[11px] font-bold text-charcoal-dark flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gold-dark" />
                    9:00 PM – 11:00 PM IST
                  </span>
                  <span className="text-[11px] font-bold text-charcoal-light flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-sage" />
                    Starts {program.startDate || '24 September'}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-charcoal-dark">
                  Live Classroom & Meeting Access
                </h3>
                <p className="text-xs text-charcoal-light max-w-xl">
                  Connect live with Sonali Ma'am and your fellow cohort members. Please join 5 minutes before scheduled start time.
                </p>
              </div>
            </div>

            <a
              href={zoomUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold hover:bg-gold-dark text-charcoal-dark font-bold uppercase tracking-wider py-3.5 px-8 rounded-xl transition-all duration-300 text-xs shadow-md flex items-center gap-2 shrink-0 border border-gold-dark/20 group"
            >
              <Video className="w-4 h-4 text-charcoal-dark group-hover:scale-110 transition-transform" />
              <span>Join Live Zoom Class</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Session 10 Special Interactive Highlight */}
          <div className="glass p-5 rounded-2xl border border-gold/40 bg-gold/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gold/20 text-gold-dark rounded-xl shrink-0">
                <Star className="w-5 h-5 fill-gold-dark text-gold-dark" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gold-dark font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3 h-3 animate-pulse" /> Exclusive 10th Session
                </span>
                <span className="font-serif text-sm font-bold text-charcoal-dark">
                  Live Interactive Session with Sonali Ma'am
                </span>
                <span className="text-xs text-charcoal-light">
                  Direct personal communication, live Q&A, and lineage integration directly with Sonali Ma'am.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                const s10 = sessionsList.find(s => s.sessionNumber === 10 || s.isBonus);
                if (s10) setSelectedSession(s10);
              }}
              className="text-xs font-bold text-gold-dark hover:text-charcoal-dark uppercase tracking-wider py-2 px-4 rounded-lg bg-gold/10 hover:bg-gold/20 transition-all border border-gold/30 shrink-0"
            >
              View Session 10 Details →
            </button>
          </div>

          {/* Main 2-Column Schedule Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: Selected Session Detail Card & Welcome Video */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Welcome/Intro Video Card */}
              {getWelcomeVideoUrl() && (
                <div className="glass p-5 md:p-6 rounded-3xl border border-cream-dark/50 flex flex-col gap-4 text-left relative overflow-hidden">
                  <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-gold/10 text-gold-dark font-bold py-1 px-3 rounded-full text-[9px] uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 animate-pulse" /> Workshop Orientation
                      </span>
                      <span className="font-serif text-sm font-bold text-charcoal-dark">
                        Welcome to {program.title}
                      </span>
                    </div>
                  </div>
                  <div className="w-full aspect-video rounded-2xl overflow-hidden border border-cream-dark/40 shadow-sm bg-black">
                    <iframe 
                      src={getWelcomeVideoUrl()} 
                      title={`Welcome to ${program.title}`}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen
                    />
                  </div>
                  <p className="text-[11px] text-charcoal-light leading-relaxed">
                    Watch this orientation to understand the transformative energy of this 10-session journey and how each session builds toward complete ancestral peace.
                  </p>
                </div>
              )}

              {/* Selected Session Deep Dive */}
              {currentSession && (
                <div className="glass p-6 md:p-8 rounded-3xl border border-cream-dark/50 flex flex-col gap-6 text-left relative overflow-hidden">
                  
                  {/* Session Header Ribbon */}
                  <div className="flex items-center justify-between border-b border-cream-dark/60 pb-4 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold py-1 px-3.5 rounded-full text-[10px] uppercase tracking-wider ${
                        currentSession.isBonus || currentSession.sessionNumber === 10
                          ? 'bg-gold/20 text-gold-dark border border-gold/40'
                          : 'bg-sage/10 text-sage border border-sage/20'
                      }`}>
                        {currentSession.isBonus || currentSession.sessionNumber === 10 ? 'Interactive Q&A Session' : `Session ${currentSession.sessionNumber}`}
                      </span>
                      <span className="font-serif text-base font-bold text-charcoal-dark">
                        {currentSession.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-charcoal-light font-semibold bg-cream/70 py-1 px-3 rounded-full border border-cream-dark/40">
                      <Clock className="w-3.5 h-3.5 text-gold-dark" />
                      <span>{currentSession.time || '9:00 PM - 11:00 PM IST'}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <h2 className="font-serif text-2xl font-bold text-charcoal-dark">
                      {currentSession.title}
                    </h2>

                    {currentSession.isBonus || currentSession.sessionNumber === 10 ? (
                      <div className="bg-gold/10 border border-gold/30 p-5 rounded-2xl flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-gold-dark font-bold text-xs uppercase tracking-wider">
                          <MessageSquare className="w-4 h-4" />
                          <span>Direct Interaction with Sonali Ma'am</span>
                        </div>
                        <p className="text-xs text-charcoal-light leading-relaxed">
                          In this special concluding session, participants will have an open floor to speak directly with Sonali Ma'am, share insights, clear personal doubts regarding lineage blockages, and anchor high-frequency ancestral blessings.
                        </p>
                      </div>
                    ) : null}

                    {/* Session Syllabus / Description */}
                    <div className="bg-cream/40 border border-cream-dark/40 p-5 rounded-2xl leading-relaxed">
                      <span className="text-[10px] font-bold text-charcoal-dark uppercase tracking-wider block mb-2">
                        Session Overview & Spiritual Objectives
                      </span>
                      <p className="text-xs text-charcoal text-justify leading-relaxed whitespace-pre-wrap font-medium">
                        {currentSession.description}
                      </p>
                    </div>

                    {/* Live Zoom Access for this session */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-cream-dark/60 mt-2">
                      <div className="flex items-center gap-2 text-xs text-charcoal-light">
                        <ShieldCheck className="w-4 h-4 text-sage" />
                        <span>Enrolled access verified • Live Zoom link active</span>
                      </div>
                      <a
                        href={zoomUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto bg-sage hover:bg-sage-dark text-white font-bold uppercase tracking-wider py-3 px-6 rounded-xl transition-all duration-300 text-xs shadow-sm flex items-center justify-center gap-2 group"
                      >
                        <Video className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Join Live Session (9-11 PM)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                  </div>
                </div>
              )}

            </div>

            {/* RIGHT: Complete 10-Session Curriculum Tracker */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-charcoal-dark uppercase tracking-wider text-left">
                  10 Sessions Schedule
                </h3>
                <span className="text-[10px] text-sage font-bold uppercase tracking-wider">
                  Live 9-11 PM
                </span>
              </div>
              
              <div className="glass border border-cream-dark/50 rounded-3xl p-3.5 max-h-[78vh] overflow-y-auto flex flex-col gap-2.5">
                {sessionsList.map((sess, idx) => {
                  const sNum = sess.sessionNumber || (idx + 1);
                  const isSelected = selectedSession && (selectedSession.sessionNumber === sNum || selectedSession.title === sess.title);
                  const isS10 = sNum === 10 || sess.isBonus;

                  let cardClasses = isSelected
                    ? 'ring-2 ring-gold border-gold/70 bg-gold/10 shadow-sm'
                    : isS10
                      ? 'bg-gold/5 hover:bg-gold/10 border-gold/30'
                      : 'bg-white/60 hover:bg-cream border-cream-dark/50';

                  return (
                    <div 
                      key={idx}
                      onClick={() => setSelectedSession(sess)}
                      className={`border p-3.5 rounded-2xl flex flex-col gap-1.5 text-left cursor-pointer transition-all duration-200 ${cardClasses}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {isS10 ? (
                            <Star className="w-4 h-4 text-gold-dark fill-gold-dark shrink-0" />
                          ) : (
                            <span className="w-5 h-5 rounded-full bg-sage/10 text-sage font-bold text-[10px] flex items-center justify-center shrink-0">
                              {sNum}
                            </span>
                          )}
                          <span className="font-serif font-bold text-xs text-charcoal-dark">
                            {isS10 ? 'Session 10 (Interactive)' : `Session ${sNum}`}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-gold-dark bg-gold/10 px-2 py-0.5 rounded-full">
                          {sess.date}
                        </span>
                      </div>

                      <div className="text-[11px] font-semibold text-charcoal leading-snug line-clamp-1">
                        {sess.title}
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-charcoal-light font-medium pt-1 border-t border-cream-dark/30">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gold-dark" />
                          {sess.time || '9:00 PM - 11:00 PM IST'}
                        </span>
                        {isS10 ? (
                          <span className="text-gold-dark font-extrabold uppercase">Interactive Q&A</span>
                        ) : (
                          <span className="text-sage font-bold uppercase">Live Class</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // Otherwise, render standard Daily Progress Dashboard (e.g. 30 Days Gratitude Program)
  const currentDayNum = progress ? progress.currentDay : 1;
  const isCompleted = progress ? progress.completed : false;

  return (
    <div className="min-h-screen py-12 px-4 md:px-8 font-sans bg-[#FFFDF7] relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Header Block */}
        <div className="text-left flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cream-dark/60 pb-6">
          <div className="flex flex-col gap-1.5">
            <span className="font-bold text-[10px] text-sage tracking-[0.2em] uppercase">Daily Program Dashboard</span>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-dark">
              {program.title}
            </h1>
            <p className="text-xs text-charcoal-light max-w-xl">
              Consistency creates subconscious shifting. Complete your task, journal your reflections, upload a photo, and unlock the next day step by step.
            </p>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="bg-cream hover:bg-cream-dark border border-cream-dark text-charcoal font-bold py-2 px-5 rounded-xl transition-all text-xs uppercase tracking-wider"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="glass p-5 rounded-2xl border border-cream-dark/50 flex flex-col sm:flex-row items-center gap-5 justify-between">
          <div className="flex flex-col text-left items-start gap-1">
            <span className="text-[10px] text-charcoal-light font-bold uppercase tracking-wider">Your Progression</span>
            <span className="font-serif text-lg font-bold text-charcoal-dark">
              {completedDaysCount} of {totalDays} Days Completed ({progressPercent}%)
            </span>
            {program && (program.title.toLowerCase().includes('gratitude') || program._id === '6a4963f49e941f93f91f5abf') && (
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider mt-0.5 flex items-center gap-1 font-sans">
                ⏳ {getRemainingDaysText()}
              </span>
            )}
          </div>
          <div className="w-full sm:w-2/3 flex flex-col gap-1.5">
            <div className="w-full h-3 bg-cream-dark/40 rounded-full overflow-hidden">
              <div 
                className="h-full gold-gradient rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {isCompleted && (
              <span className="text-[10px] text-sage font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Program completed! Amazing job keeping up the practice.
              </span>
            )}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Active Assignment Card */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Intro Welcome Video Card */}
            {getWelcomeVideoUrl() && (
              <div className="glass p-5 md:p-6 rounded-3xl border border-cream-dark/50 flex flex-col gap-4 text-left relative overflow-hidden">
                <div className="flex items-center justify-between border-b border-cream-dark/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-gold/10 text-gold-dark font-bold py-1 px-3 rounded-full text-[9px] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3 animate-pulse" /> Welcome Video
                    </span>
                    <span className="font-serif text-sm font-bold text-charcoal-dark">
                      Introduction to {program.title}
                    </span>
                  </div>
                </div>
                <div className="w-full aspect-video rounded-2xl overflow-hidden border border-cream-dark/40 shadow-sm bg-black">
                  <iframe 
                    src={getWelcomeVideoUrl()} 
                    title={`Introduction to ${program.title}`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                  />
                </div>
                <p className="text-[11px] text-charcoal-light leading-relaxed">
                  Before you begin your practice, watch this welcome video from Sonali Bhasin to understand the power of this journey and how to get the most out of it!
                </p>
              </div>
            )}
            
            {isCompleted ? (
              /* Success / Completed state */
              <div className="glass p-8 rounded-3xl border-2 border-gold/30 text-center flex flex-col items-center justify-center gap-5 py-16 bg-gold/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="w-48 h-48 text-gold" />
                </div>
                <div className="bg-gold-light/25 p-4 rounded-full text-gold">
                  <Sparkles className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-dark">Congratulations, {user?.name}!</h3>
                <p className="text-xs text-charcoal-light max-w-md leading-relaxed">
                  🎉 Congratulations! You have successfully completed the {program.title}.<br/><br/>
                  One beautiful spiritual journey completed ❤️
                </p>
                <button
                  onClick={() => navigate('/profile')}
                  className="bg-gold hover:bg-gold-dark text-charcoal-dark font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-wider transition-all duration-300 border border-gold-dark/20 shadow-md"
                >
                  Return to Profile Dashboard
                </button>
              </div>
            ) : selectedAssignment ? (
              /* Current day assignment information */
              <div className="glass p-6 md:p-8 rounded-3xl border border-cream-dark/50 flex flex-col gap-6 text-left relative overflow-hidden">
                
                {/* Active Day Ribbon */}
                <div className="flex items-center justify-between border-b border-cream-dark/60 pb-4">
                  <div className="flex items-center gap-3">
                    <span className={`font-bold py-1 px-3.5 rounded-full text-[10px] uppercase tracking-wider ${
                      isSelectedActive 
                        ? 'bg-gold/10 text-gold-dark'
                        : isSelectedCompleted
                          ? 'bg-sage/10 text-sage'
                          : 'bg-charcoal/5 text-charcoal'
                    }`}>
                      {isSelectedActive ? 'Active Task' : isSelectedCompleted ? 'Completed Task' : 'Task'}
                    </span>
                    <span className="font-serif text-base font-bold text-charcoal-dark">
                      Day {selectedAssignment.dayNumber}
                    </span>
                  </div>
                  <span className="text-[10px] text-charcoal-light flex items-center gap-1 font-semibold">
                    <Compass className="w-4 h-4 text-sage animate-spin-slow" />
                    {isSelectedCompleted ? 'Completed' : 'Pending Completion'}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  <h3 className="font-serif text-xl font-bold text-charcoal-dark flex items-center gap-2">
                    {selectedAssignment.title}
                  </h3>

                  {selectedAssignment.estimatedDuration && (
                    <div className="flex items-center gap-1.5 text-xs text-sage font-semibold uppercase tracking-wider">
                      <span>Estimated Time: {selectedAssignment.estimatedDuration}</span>
                    </div>
                  )}

                  {selectedAssignment.image && (
                    <div className="w-full max-h-80 rounded-2xl overflow-hidden border border-cream-dark/40 mb-2 bg-cream-light flex items-center justify-center">
                      <img src={getImageUrl(selectedAssignment.image)} alt={selectedAssignment.title} className="max-w-full max-h-80 object-contain" />
                    </div>
                  )}

                  {getEmbedVideoUrl(selectedAssignment.content) && (
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-cream-dark/45 shadow-sm mb-4 bg-black">
                      <iframe 
                        src={getEmbedVideoUrl(selectedAssignment.content)}
                        title={selectedAssignment.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                      />
                    </div>
                  )}
                  
                  {/* Task Content */}
                  <div className="bg-cream/40 border border-cream-dark/40 p-5 rounded-xl leading-relaxed">
                    <div className="text-xs text-charcoal text-justify whitespace-pre-wrap font-medium">
                      {selectedAssignment.content}
                    </div>
                  </div>
                </div>

                {/* Upload Form / Completion Status (Show if the selected day is the active day and we haven't completed the program) */}
                {isSelectedActive ? (
                  <form onSubmit={handleUploadSubmit} className="border-t border-cream-dark/65 pt-6 flex flex-col gap-4">
                    {!isPhotoRequired ? (
                      <>
                        <h4 className="text-[10px] text-charcoal-dark font-bold uppercase tracking-wider">Practice Progress</h4>
                        <p className="text-[11px] text-charcoal-light leading-relaxed">
                          Click below once you have completed today's practice session to mark this day as complete and unlock the next day!
                        </p>
                      </>
                    ) : (
                      <>
                        <h4 className="text-[10px] text-charcoal-dark font-bold uppercase tracking-wider">Complete Assignment</h4>
                        <p className="text-[11px] text-charcoal-light leading-relaxed">
                          Read the instructions above. Once you complete the task, select and upload a photo of your work, then click complete to immediately unlock the next day!
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 items-center">
                          {/* File chooser */}
                          <label className="w-full md:flex-1 flex flex-col items-center justify-center border-2 border-dashed border-cream-dark/60 rounded-xl py-6 px-4 bg-cream-light hover:bg-cream cursor-pointer transition-colors duration-200">
                            <UploadCloud className="w-7 h-7 text-sage mb-2" />
                            <span className="text-xs font-bold text-charcoal-dark">
                              {selectedFile ? 'Change Photo' : 'Select Photo from Device'}
                            </span>
                            <span className="text-[9px] text-charcoal-light mt-1">
                              {selectedFile ? selectedFile.name : 'PNG, JPG, JPEG or WEBP (Max 5MB)'}
                            </span>
                            <input 
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                          </label>

                          {/* Preview box */}
                          {previewUrl && (
                            <div className="w-32 h-32 rounded-xl overflow-hidden border border-cream-dark shrink-0 relative group">
                              <img src={previewUrl} alt="Journal entry preview" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                <span className="text-[9px] text-white font-bold uppercase">Ready</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    <button
                      type="submit"
                      disabled={uploading || (isPhotoRequired && !selectedFile)}
                      className={`w-full font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 text-xs shadow-sm flex items-center justify-center gap-1.5 font-sans mt-2 ${
                        uploading || (isPhotoRequired && !selectedFile)
                          ? 'bg-charcoal-light/10 text-charcoal-light/40 cursor-not-allowed' 
                          : 'bg-sage hover:bg-sage-dark text-white'
                      }`}
                    >
                      {uploading ? (
                        <>
                          <Compass className="w-4 h-4 animate-spin text-white" />
                          <span>Saving Progress...</span>
                        </>
                      ) : (
                        <>
                          <span>{isPrayerProgram ? "Mark as Read & Unlock Next Day" : "Complete Assignment & Unlock Next Day"}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                ) : isSelectedCompleted ? (
                  <div className="border-t border-cream-dark/65 pt-6 flex flex-col gap-4">
                    <div className="bg-sage/10 border border-sage/30 p-5 rounded-2xl flex flex-col gap-3 text-left">
                      <div className="flex items-center gap-2 text-sage-dark font-bold text-xs uppercase tracking-wider">
                        <CheckCircle className="w-5 h-5 text-sage" />
                        <span>Day Completed!</span>
                      </div>
                      <p className="text-xs text-charcoal-light leading-relaxed">
                        {isPrayerProgram 
                          ? `Great work keeping up the practice. You have read and completed the prayer for Day ${selectedAssignment.dayNumber}!`
                          : `Great work keeping up the practice. You have completed the reflections and tasks for Day ${selectedAssignment.dayNumber}!`}
                      </p>
                      {/* If they uploaded a photo, display it here */}
                      {progress.submissions.find(s => s.day === selectedAssignment.dayNumber)?.photo && (
                        <div className="flex flex-col gap-2 mt-1">
                          <span className="text-[9px] text-charcoal-light uppercase font-bold tracking-wider">Your Submitted Reflection Work:</span>
                          <div 
                            className="w-32 h-32 rounded-xl overflow-hidden border border-cream-dark/60 cursor-pointer relative group"
                            onClick={() => {
                              const p = progress.submissions.find(s => s.day === selectedAssignment.dayNumber);
                              if (p) setLightboxImage({ url: getImageUrl(p.photo), title: `Day ${selectedAssignment.dayNumber} Reflection` });
                            }}
                          >
                            <img 
                              src={getImageUrl(progress.submissions.find(s => s.day === selectedAssignment.dayNumber).photo)} 
                              alt="Day Submission" 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-charcoal/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Eye className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

              </div>
            ) : (
              <div className="glass p-8 rounded-3xl text-center flex flex-col items-center justify-center gap-4 py-16 border border-cream-dark/50">
                <AlertCircle className="w-10 h-10 text-sage" />
                <h3 className="font-serif text-lg font-bold text-charcoal-dark">This assignment is not available yet.</h3>
                <p className="text-xs text-charcoal-light max-w-sm">
                  Please check back soon. The program coordinator is publishing the next days' materials!
                </p>
              </div>
            )}

            {/* Submissions History Grid */}
            {progress && progress.submissions.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-serif text-lg font-bold text-charcoal-dark uppercase tracking-wider text-left">
                  My Completed Submissions
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {progress.submissions.map((sub, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setLightboxImage({ url: getImageUrl(sub.photo), title: `Day ${sub.day} Submission` })}
                      className="glass border border-cream-dark/50 rounded-2xl overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-300 text-left"
                    >
                      <div className="h-28 bg-cream relative overflow-hidden">
                        <img 
                          src={getImageUrl(sub.photo)} 
                          alt={`Day ${sub.day}`} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="p-2.5 flex flex-col gap-0.5">
                        <span className="font-bold text-[10px] text-charcoal-dark">Day {sub.day}</span>
                        <span className="text-[8px] text-charcoal-light">{new Date(sub.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT: locked/unlocked 30-day index tracker */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-charcoal-dark uppercase tracking-wider text-left">
              Program Calendar
            </h3>
            
            <div className="glass border border-cream-dark/50 rounded-3xl p-4 max-h-[70vh] overflow-y-auto flex flex-col gap-2.5">
              {assignments.map((assignment) => {
                const dayNum = assignment.dayNumber;
                const isDayCompleted = assignment.isCompleted;
                const isDayActive = dayNum === currentDayNum && !isCompleted;
                const isDayLocked = assignment.isLocked;

                let stateClasses = "";
                let icon = null;

                if (isDayCompleted) {
                  stateClasses = "bg-sage/5 border-sage/20 text-sage hover:bg-sage/10";
                  icon = <CheckCircle className="w-4 h-4 text-sage shrink-0" />;
                } else if (isDayActive) {
                  if (isPendingApproval) {
                    stateClasses = "bg-gold/5 border-gold/20 text-gold-dark font-medium";
                    icon = <Compass className="w-4 h-4 text-gold-dark shrink-0 animate-pulse" />;
                  } else if (isRejected) {
                    stateClasses = "bg-red-500/5 border-red-500/20 text-red-600 font-medium";
                    icon = <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />;
                  } else {
                    stateClasses = "bg-gold/10 border-gold/40 text-gold-dark font-bold animate-pulse";
                    icon = <Compass className="w-4 h-4 text-gold-dark shrink-0 animate-pulse" />;
                  }
                } else {
                  // Locked
                  stateClasses = "opacity-55 border-cream-dark bg-cream-light/30 cursor-not-allowed select-none text-charcoal-light";
                  icon = <Lock className="w-3.5 h-3.5 text-charcoal-light shrink-0" />;
                }

                const isSelected = selectedAssignment && selectedAssignment.dayNumber === dayNum;
                const activeClickableClass = !isDayLocked ? "cursor-pointer hover:shadow-sm" : "";
                const selectedClass = isSelected ? "ring-2 ring-sage/55 border-sage/60 font-bold" : "";

                return (
                  <div 
                    key={dayNum}
                    onClick={() => {
                      if (!isDayLocked) {
                        fetchAssignmentDetails(dayNum);
                      }
                    }}
                    className={`border p-3 rounded-xl flex items-center justify-between gap-3 text-xs transition-all ${stateClasses} ${activeClickableClass} ${selectedClass}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {icon}
                      <span className="font-serif font-bold text-[11px]">Day {dayNum}</span>
                      <span className="text-[10px] line-clamp-1 text-left font-medium">
                        {assignment.title.replace(`Gratitude Task Day ${dayNum}`, '').replace(`Gratitude Day ${dayNum}`, '').replace(`Day ${dayNum}`, '').replace(': ', '') || 'Daily Practice'}
                      </span>
                    </div>
                    {isDayCompleted && (
                      <span className="text-[8px] bg-sage/10 text-sage font-bold uppercase tracking-wider py-0.5 px-1.5 rounded">
                        Done
                      </span>
                    )}
                    {isDayActive && (
                      <span className={`text-[8px] font-bold uppercase tracking-wider py-0.5 px-1.5 rounded ${
                        isPendingApproval 
                          ? 'bg-gold/10 text-gold-dark'
                          : isRejected
                            ? 'bg-red-500/10 text-red-600'
                            : 'bg-gold/20 text-gold-dark'
                      }`}>
                        {isPendingApproval ? 'Reviewing' : isRejected ? 'Rejected' : 'Active'}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center gap-3">
            <button 
              className="absolute top-0 right-0 -mt-10 text-white font-bold text-xs uppercase bg-charcoal p-2 rounded-lg"
              onClick={() => setLightboxImage(null)}
            >
              Close [X]
            </button>
            <img 
              src={lightboxImage.url} 
              alt={lightboxImage.title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-white/25 bg-cream"
            />
            <span className="text-white text-xs font-serif font-bold">{lightboxImage.title}</span>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProgramDashboard;
