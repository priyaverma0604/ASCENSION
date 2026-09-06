import React, { useState, useEffect, useContext } from 'react';
import { Calendar, ArrowRight, UserCheck } from 'lucide-react';
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
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-6xl 2xl:max-w-7xl 3xl:max-w-screen-2xl mx-auto flex flex-col gap-10 sm:gap-16">
        
        {/* Title */}
        <div className="text-center flex flex-col gap-3">
          <span className="font-sans text-[10px] sm:text-xs text-sage tracking-[0.25em] font-bold uppercase">Transformative Pathways</span>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl 2xl:text-5xl font-bold tracking-wide text-charcoal-dark">
            Spiritual Programs & Coaching
          </h1>
          <p className="max-w-xl 2xl:max-w-2xl mx-auto text-xs sm:text-sm text-charcoal-light leading-relaxed">
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
          <div className="flex flex-col gap-8 sm:gap-12">
            {programs.map((program) => {
              const isUserEnrolled = user && program.enrolledUsers && (
                program.enrolledUsers.includes(user._id) || 
                program.enrolledUsers.some(eu => eu === user._id || (eu && eu._id === user._id))
              );

              const isAncestral = program.title && program.title.toLowerCase().includes('ancestral');

              return (
                <div 
                  key={program._id}
                  className="glass rounded-2xl overflow-hidden shadow-xs sm:shadow-sm hover:shadow-md transition-all duration-300 grid grid-cols-1 md:grid-cols-2 border border-cream-dark/50 md:min-h-[350px]"
                >
                  {/* Video Embed or Static Image */}
                  <div className="h-60 sm:h-72 md:h-full bg-cream min-h-[240px] sm:min-h-[300px] relative overflow-hidden">
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
                  <div className="p-5 sm:p-8 flex flex-col justify-between text-left gap-4 sm:gap-5">
                    <div className="flex flex-col gap-2.5 sm:gap-3 min-h-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-sage/10 text-sage font-bold py-1 px-3 rounded-full text-[10px] uppercase tracking-wider">
                          {isAncestral ? '10 Sessions' : (program.duration || '10 Sessions')}
                        </span>
                        {(program.startDate || isAncestral) && (
                          <span className="bg-gold/15 text-gold-dark font-bold py-1 px-3 rounded-full text-[10px] tracking-wider flex items-center gap-1 border border-gold/30">
                            <Calendar className="w-3.5 h-3.5 text-gold-dark" />
                            <span>Starts {program.startDate || '24 September'}</span>
                          </span>
                        )}
                        <span className="text-[10px] text-charcoal-light flex items-center gap-1 font-medium bg-cream/70 py-1 px-2.5 rounded-full border border-cream-dark/40">
                          <UserCheck className="w-3.5 h-3.5 text-sage shrink-0" />
                          <span>
                            {program.enrolledCount !== undefined && program.enrolledCount > 0 
                              ? program.enrolledCount 
                              : (isAncestral ? 10 : (program.enrolledUsers?.length || 0))} / {program.enrollmentCapacity} enrolled
                          </span>
                        </span>
                      </div>

                      <h3 className="font-serif text-lg sm:text-xl font-bold text-charcoal-dark leading-snug">
                        {program.title}
                      </h3>
                      
                      <p className="text-xs text-charcoal-light leading-relaxed line-clamp-3">
                        {program.description}
                      </p>
                    </div>

                    {/* Enrollment CTA */}
                    <div className="border-t border-cream-dark/65 pt-4 sm:pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 font-sans mt-2">
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] text-charcoal-light uppercase tracking-wider mb-0.5 font-semibold">Program Investment</span>
                        <div className="flex items-baseline gap-2.5 mt-0.5 flex-wrap">
                          <span className="font-serif font-bold text-xl sm:text-2xl md:text-3xl text-gold-dark leading-none">
                            ₹{new Intl.NumberFormat('en-IN').format(program.sellingPrice !== undefined ? program.sellingPrice : program.pricing)}
                          </span>
                          {program.originalPrice !== undefined && program.originalPrice > (program.sellingPrice !== undefined ? program.sellingPrice : program.pricing) && (
                            <>
                              <span className="relative inline-block font-serif font-bold text-base sm:text-lg md:text-xl text-rose-500 leading-none select-none tracking-tight px-1">
                                ₹{new Intl.NumberFormat('en-IN').format(program.originalPrice)}
                                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <span className="w-full h-[2px] bg-rose-500/90 transform -rotate-12 rounded-full"></span>
                                </span>
                              </span>
                              <span className="text-emerald-700 bg-emerald-100/90 border border-emerald-300 font-sans font-extrabold text-[10px] sm:text-xs px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg leading-none shrink-0 tracking-wide uppercase shadow-xs">
                                {Math.round(((program.originalPrice - (program.sellingPrice !== undefined ? program.sellingPrice : program.pricing)) / program.originalPrice) * 100)}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {isUserEnrolled ? (
                        <button
                          onClick={() => navigate(`/programs/${program._id}/dashboard`)}
                          className="w-full sm:w-auto bg-gold hover:bg-gold-dark text-charcoal-dark font-bold uppercase tracking-wider py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 text-xs shadow-xs flex items-center justify-center gap-1.5 group"
                        >
                          <span>Go to Dashboard</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ) : ['guided meditations', '21 days mirror work for self love program', '21 days release work program'].includes(program.title.toLowerCase().trim()) ? (
                        <button
                          disabled
                          className="w-full sm:w-auto bg-charcoal-light/10 text-charcoal-light/40 border border-cream-dark/40 font-bold uppercase tracking-wider py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl text-xs cursor-not-allowed font-sans text-center"
                        >
                          Coming Soon
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEnrollClick(program)}
                          className="w-full sm:w-auto bg-sage hover:bg-sage-dark text-white font-bold uppercase tracking-wider py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 text-xs shadow-xs flex items-center justify-center gap-1.5 group"
                        >
                          <span>Enroll Now</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              );
            })}
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

