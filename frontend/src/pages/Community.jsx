import React, { useState, useEffect, useContext } from 'react';
import { Compass, MessageCircle, Calendar, PlusCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Community = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        
        {/* Title */}
        <div className="text-center flex flex-col gap-3">
          <span className="font-sans text-[10px] sm:text-xs text-sage tracking-[0.25em] font-bold uppercase">Ascension Circle</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-charcoal-dark">
            Community Updates & Events
          </h1>
          <p className="max-w-xl mx-auto text-xs text-charcoal-light leading-relaxed">
            Stay aligned with our collective energy. Read announcements, check upcoming spiritual events, discover volunteering resources, and participate in our group dialogues.
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
                  <div className="h-64 rounded-xl overflow-hidden bg-cream mt-2">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
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
  );
};

export default Community;
