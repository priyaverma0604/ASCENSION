import React, { useState, useEffect, useContext } from 'react';
import { Compass, Calendar, CheckCircle, ArrowRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import EnrollProgramModal from '../components/EnrollProgramModal';

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiBase}${path}`;
};

const Programs = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const handleEnrollClick = (program) => {
    if (!user) {
      navigate('/login');
    } else {
      setSelectedProgram(program);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const { data } = await axios.get('/api/programs');
      if (data.success) {
        setPrograms(data.data);
      }
    } catch (err) {
      console.error('Error fetching programs:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-16 px-6 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col gap-16">
        
        {/* Title */}
        <div className="text-center flex flex-col gap-3">
          <span className="font-serif italic text-xs text-sage tracking-wider uppercase font-semibold">Transformative Pathways</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-charcoal-dark">
            Spiritual Programs & Coaching
          </h1>
          <p className="max-w-xl mx-auto text-xs text-charcoal-light leading-relaxed">
            Participate in structured, high-vibrational programs designed to support deep subconscious shifting, manifestation habits, and consistent emotional wellness over several weeks.
          </p>
        </div>

        {loading ? (
          /* Shimmer Loading */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(n => (
              <div key={n} className="shimmer h-96 rounded-2xl w-full"></div>
            ))}
          </div>
        ) : (
          /* Programs list */
          <div className="flex flex-col gap-12">
            {programs.map((program) => (
              <div 
                key={program._id}
                className="glass rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 md:grid-cols-2 border border-cream-dark/50 md:h-[340px]"
              >
                {/* Video Embed or Static Image */}
                <div className="h-72 md:h-full bg-cream min-h-[300px] relative overflow-hidden">
                  {program.youtubeUrl ? (
                    <iframe
                      src={program.youtubeUrl}
                      title={program.title}
                      className="w-full h-full border-0 absolute inset-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <img 
                      src={program.images && program.images[0] ? getImageUrl(program.images[0]) : "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"} 
                      alt={program.title} 
                      className="w-full h-full object-cover" 
                    />
                  )}
                </div>

                {/* Details */}
                <div className="p-8 flex flex-col justify-between text-left gap-6">
                  <div className="flex flex-col gap-3 min-h-0 overflow-hidden">
                    <div className="flex items-center gap-4">
                      <span className="bg-sage/10 text-sage font-bold py-1 px-3.5 rounded-full text-[10px] uppercase tracking-wider">
                        {program.duration}
                      </span>
                      <span className="text-[10px] text-charcoal-light flex items-center gap-1">
                        <UserCheck className="w-4 h-4 text-sage shrink-0" />
                        <span>{program.enrolledUsers?.length || 0} / {program.enrollmentCapacity} enrolled</span>
                      </span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-charcoal-dark leading-snug">
                      {program.title}
                    </h3>
                    
                    <p className="text-xs text-charcoal-light leading-relaxed line-clamp-4">
                      {program.description}
                    </p>
                  </div>

                  {/* Enrollment CTA */}
                  <div className="border-t border-cream-dark/65 pt-6 flex justify-between items-center font-sans mt-4">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-charcoal-light uppercase tracking-wider mb-1">Program Investment</span>
                      <div className="flex flex-col leading-tight">
                        <span className="line-through text-charcoal-light/60 text-xs">₹{new Intl.NumberFormat('en-IN').format(program.originalPrice !== undefined ? program.originalPrice : program.pricing)}</span>
                        <span className="font-serif font-bold text-base text-gold-dark mt-0.5">₹{new Intl.NumberFormat('en-IN').format(program.sellingPrice !== undefined ? program.sellingPrice : program.pricing)}</span>
                      </div>
                    </div>

                    {['guided meditations', '21 days mirror work for self love program', '21 days release work program'].includes(program.title.toLowerCase().trim()) ? (
                      <button
                        disabled
                        className="bg-charcoal-light/10 text-charcoal-light/40 border border-cream-dark/40 font-bold uppercase tracking-wider py-3 px-8 rounded-xl text-xs cursor-not-allowed font-sans"
                      >
                        Coming Soon
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnrollClick(program)}
                        className="bg-sage hover:bg-sage-dark text-white font-bold uppercase tracking-wider py-3 px-8 rounded-xl transition-all duration-300 text-xs shadow-sm flex items-center gap-1.5 group"
                      >
                        <span>Enroll Now</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Enroll Program Modal */}
      {selectedProgram && (
        <EnrollProgramModal 
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}
    </div>
  );
};

export default Programs;
