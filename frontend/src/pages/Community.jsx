import React, { useState, useEffect, useContext } from 'react';
import { Compass, MessageCircle, Calendar, PlusCircle, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

import meditationCircle from '../assets/gallery/meditation_circle_candlelight.png';
import kunzumSpeaker from '../assets/gallery/kunzum_event_speaker.jpg';
import healingBooth from '../assets/gallery/healing_booth_reading.jpg';
import kunzumCommunity from '../assets/gallery/kunzum_community_group.jpg';
import animalWelfareMoment from '../assets/gallery/animal_welfare_3.jpg';
import womenHygieneMoment from '../assets/gallery/women_hygiene_2.jpg';
import mahabhojMoment from '../assets/gallery/mahabhoj_2.png';
import shikshaKendraMoment from '../assets/gallery/shiksha_kendra_1.png';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase}${path}`;
};

const Community = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const communityMoments = [
    {
      img: kunzumCommunity,
      title: "Community Meet & Soul Circle",
      location: "Kunzum Book Cafe",
      description: "Gathering of conscious souls, celebrating spiritual growth, connection, and mindful conversations."
    },
    {
      img: shikshaKendraMoment,
      title: "Shiksha Kendra Child & Adult Education Drive",
      location: "Community Learning Center",
      description: "Empowering children and women with foundational literacy, drawing, textbooks, and mentoring."
    },
    {
      img: mahabhojMoment,
      title: "Mahabhoj Campaign – Mahashivratri Seva",
      location: "Community Annadan Grounds",
      description: "Feeding 5,000+ individuals and children with sacred hot meals, prasad, and joyous community love."
    },
    {
      img: animalWelfareMoment,
      title: "Animal Welfare & Gau Seva Drive",
      location: "Community Sanctuary",
      description: "Ascension Seva volunteers nourishing cows and community dogs with fresh meals, water, and care."
    },
    {
      img: womenHygieneMoment,
      title: "Women's Dignity & Hygiene Seva Drive",
      location: "Community Outreach",
      description: "Direct doorstep and community distribution of menstrual hygiene kits, breaking taboos and empowering women."
    },
    {
      img: meditationCircle,
      title: "Candlelight Meditation & Energy Circle",
      location: "Sacred Altar Space",
      description: "Group meditation, deep silence, and collective vibrational alignment in the presence of divine peace."
    },
    {
      img: healingBooth,
      title: "Ascension Healing & Intuitive Readings",
      location: "Healing Exhibition",
      description: "Sonali conducting live oracle card readings, energy assessments, and showcasing blessed ritual items."
    },
    {
      img: kunzumSpeaker,
      title: "Spiritual Laws & Consciousness Talk",
      location: "Interactive Keynote",
      description: "Empowering souls through practical spirituality, subconscious rewiring, and angelic connection techniques."
    }
  ];

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get('/api/community');
      if (data.success) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error('Error loading community updates:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeStyle = (type) => {
    if (type === 'announcement') return 'bg-gold/15 text-gold-dark';
    if (type === 'event') return 'bg-lavender text-charcoal-dark border border-lavender-dark';
    return 'bg-sage/10 text-sage';
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-5xl 2xl:max-w-6xl mx-auto flex flex-col gap-12">
        
        {/* Title */}
        <div className="text-center flex flex-col gap-3">
          <span className="font-sans text-[10px] sm:text-xs text-sage tracking-[0.25em] font-bold uppercase">Ascension Circle</span>
          <h1 className="font-serif text-3xl md:text-4xl 2xl:text-5xl font-bold tracking-wide text-charcoal-dark">
            Community Updates & Moments
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-charcoal-light leading-relaxed">
            Stay aligned with our collective energy. Explore community moments, read announcements, check upcoming spiritual events, and connect in our group dialogues.
          </p>
        </div>

        {/* WhatsApp Banner */}
        <div className="glass p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-left border border-sage/30">
          <div className="flex gap-3 items-start">
            <span className="bg-sage/10 p-2.5 rounded-full inline-block shrink-0 text-sage">
              <MessageCircle className="w-5 h-5" />
            </span>
            <div className="flex flex-col gap-0.5">
              <h4 className="font-serif font-bold text-sm text-charcoal-dark">Join our Live WhatsApp Community</h4>
              <p className="text-[11px] text-charcoal-light leading-relaxed">
                Connect with like-minded spiritual seekers. Receive daily affirmations, direct reminders, and notification updates on mobile.
              </p>
            </div>
          </div>
          <a
            href="https://chat.whatsapp.com/mockAscension"
            target="_blank"
            rel="noreferrer"
            className="bg-sage hover:bg-sage-dark text-white font-bold py-2.5 px-6 rounded-xl transition-all duration-300 text-xs shadow-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Join WhatsApp Circle</span>
          </a>
        </div>

        {/* Community Moments Gallery */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-dark" />
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-dark">Community Moments & Gatherings</h2>
            </div>
            <span className="text-[10px] text-sage font-bold uppercase tracking-widest font-sans">Live Circles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {communityMoments.map((moment, idx) => (
              <div 
                key={idx}
                onClick={() => setSelectedPhoto(moment)}
                className="glass rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 border border-cream-dark/50 flex flex-col group cursor-pointer"
              >
                <div className="h-48 overflow-hidden bg-cream relative">
                  <img 
                    src={moment.img} 
                    alt={moment.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute bottom-2 left-2 bg-charcoal-dark/75 backdrop-blur-xs text-white text-[9px] px-2.5 py-1 rounded-full font-medium">
                    {moment.location}
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-1.5 text-left flex-1">
                  <h3 className="font-serif font-bold text-sm text-charcoal-dark group-hover:text-gold-dark transition-colors">
                    {moment.title}
                  </h3>
                  <p className="text-[11px] text-charcoal-light leading-relaxed">
                    {moment.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Post Actions */}
        {user && user.role === 'admin' && (
          <div className="flex justify-end -mb-4">
            <Link
              to="/admin?tab=community"
              className="flex items-center gap-1 text-xs font-bold text-gold-dark hover:text-sage transition-colors border border-gold-dark/40 py-2 px-4 rounded-xl"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Community Post</span>
            </Link>
          </div>
        )}

        {/* Feed Timeline */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sage" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-dark">Announcements & Circle Feeds</h2>
          </div>

          {loading ? (
            <div className="flex flex-col gap-6">
              {[1, 2].map(n => (
                <div key={n} className="shimmer h-60 rounded-2xl"></div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="flex flex-col gap-8">
              {posts.map((post) => (
                <div key={post._id} className="glass p-6 rounded-2xl shadow-sm border border-cream-dark/50 flex flex-col gap-4 text-left">
                  
                  {/* Header */}
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider font-sans ${getBadgeStyle(post.type)}`}>
                        {post.type}
                      </span>
                      <span className="text-[10px] text-charcoal-light flex items-center gap-1 font-sans">
                        <Calendar className="w-3.5 h-3.5 text-sage" />
                        <span>{new Date(post.date || post.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-sage font-medium uppercase font-sans">
                      Posted by {post.author?.name || 'Sonali'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col gap-2">
                    <h3 className="font-serif text-lg font-bold text-charcoal-dark leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-charcoal-light leading-relaxed font-sans whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* Attached Image */}
                  {post.image && (
                    <div className="rounded-xl overflow-hidden bg-cream mt-2 border border-cream-dark/40 shadow-xs">
                      <img src={getImageUrl(post.image)} alt={post.title} className="w-full h-auto max-h-[420px] object-cover object-center" />
                    </div>
                  )}

                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center glass rounded-2xl">
              <AlertCircle className="w-8 h-8 text-sage/60 mx-auto mb-2" />
              <p className="text-xs text-charcoal-light">No community updates logged yet.</p>
            </div>
          )}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)} 
          className="fixed inset-0 z-50 bg-charcoal-dark/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="bg-white rounded-2xl overflow-hidden max-w-xl w-full shadow-2xl border border-cream-dark"
          >
            <div className="max-h-[70vh] bg-charcoal-dark overflow-hidden flex items-center justify-center">
              <img src={selectedPhoto.img} alt={selectedPhoto.title} className="max-h-[70vh] w-auto object-contain" />
            </div>
            <div className="p-5 flex flex-col gap-1 text-left">
              <span className="text-[10px] uppercase tracking-widest text-sage font-bold">{selectedPhoto.location}</span>
              <h3 className="font-serif font-bold text-base text-charcoal-dark">{selectedPhoto.title}</h3>
              <p className="text-xs text-charcoal-light leading-relaxed mt-1">{selectedPhoto.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;

