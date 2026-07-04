import React, { useState, useContext } from 'react';
import { Compass, CheckCircle, Heart, Users, BookOpen, Smile, ShieldAlert } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const NGO = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Food Seva');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name,
        email,
        phone,
        message: `[VOLUNTEER APPLICATION]\nSelected Area: ${interest}\nMessage: ${message}`
      };
      
      const { data } = await axios.post('/api/contacts', payload);
      if (data.success) {
        setSuccess(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit volunteer form');
    } finally {
      setSubmitting(false);
    }
  };

  const initiatives = [
    {
      icon: <Heart className="w-5 h-5 text-gold-dark" />,
      title: "1. Food Seva & Health Welfare",
      desc: "Nourishment drives providing daily meals and basic healthcare aid to underserved local families, ensuring physical wellness is coupled with energetic compassion."
    },
    {
      icon: <Users className="w-5 h-5 text-gold-dark" />,
      title: "2. Women Empowerment Programs",
      desc: "Counseling and skill-building workshops designed to support underprivileged women to build financial autonomy, inner confidence, and emotional boundaries."
    },
    {
      icon: <BookOpen className="w-5 h-5 text-gold-dark" />,
      title: "3. Shiksha Kendra & Child Welfare",
      desc: "Educating and mentoring underprivileged children in creative arts, basic academics, and mindfulness practices, nurturing future conscious minds."
    },
    {
      icon: <Smile className="w-5 h-5 text-gold-dark" />,
      title: "4. Community Welfare & Support",
      desc: "Self-help support circles and emotional counseling sessions organized to help families navigate personal stress, relationship conflicts, and domestic loads."
    },
    {
      icon: <Compass className="w-5 h-5 text-gold-dark" />,
      title: "5. Animal Welfare & Environment",
      desc: "Feeding and caring for stray street animals in Delhi, sponsoring adoptions, and running waste reduction and cleaning drives in the local neighborhood."
    }
  ];

  return (
    <div className="min-h-screen py-16 px-6 font-sans">
      <div className="max-w-5xl mx-auto flex flex-col gap-16">
        
        {/* Title */}
        <div className="text-center flex flex-col gap-3">
          <span className="font-serif italic text-xs text-sage tracking-wider uppercase font-semibold">Selfless Service</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-charcoal-dark leading-tight">
            Ascension Seva NGO
          </h1>
          <p className="max-w-xl mx-auto text-xs text-charcoal-light leading-relaxed">
            At Ascension, we believe that true spirituality is reflected in service to humanity. Through Seva, we create ripples of healing and compassion across Delhi's underprivileged communities.
          </p>
        </div>

        {/* NGO Banner and Mission */}
        <div className="glass p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-10 items-center border border-cream-dark/65">
          <div className="h-64 rounded-xl overflow-hidden bg-cream shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80" 
              alt="Seva" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="flex flex-col gap-4 text-left">
            <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider">Our Healing Mission</h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Founded from the vision of Sonali Bhasin Kumar, the Ascension NGO acts as a conduit where spirituality, active care, and human upliftment merge. Every act of service is conducted with clean intentions, positive energy, and love.
            </p>
            <p className="text-xs text-charcoal-light leading-relaxed">
              By supporting our NGO, you participate in feeding local children, training women for financial self-reliance, and caring for voiceless animals, elevating the collective planetary consciousness.
            </p>
          </div>
        </div>

        {/* Key Initiatives */}
        <div className="flex flex-col gap-6">
          <h3 className="font-serif text-xl font-bold text-charcoal-dark text-center mb-4">Key Humanitarian Initiatives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initiatives.map((ini, index) => (
              <div key={index} className="glass p-6 rounded-2xl flex gap-4 text-left border border-cream-dark/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-cream p-3 rounded-xl border border-cream-dark/60 self-start shrink-0">
                  {ini.icon}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-serif text-sm font-bold text-charcoal-dark">{ini.title}</h4>
                  <p className="text-[11px] text-charcoal-light leading-relaxed">{ini.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Application Form */}
        <div className="glass max-w-xl mx-auto w-full rounded-2xl border border-cream-dark/60 p-6 md:p-8">
          <h3 className="font-serif text-lg font-bold text-charcoal-dark text-center uppercase tracking-wider mb-2">
            Volunteer Application Form
          </h3>
          <p className="text-center text-[10px] text-sage font-medium tracking-wide uppercase mb-6">
            Join the Seva Circle
          </p>

          {success ? (
            <div className="flex flex-col items-center justify-center text-center gap-4 py-8">
              <CheckCircle className="w-12 h-12 text-sage animate-pulse" />
              <h4 className="font-serif text-lg font-bold text-charcoal-dark">Application Submitted!</h4>
              <p className="text-xs text-charcoal-light leading-relaxed px-6">
                Blessings! Thank you, {name}, for registering your interest to volunteer with Ascension Seva. We will reach out to you on WhatsApp/Email once we schedule our next drive.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-sage hover:bg-sage-dark text-white font-bold py-2.5 px-8 rounded-xl text-xs uppercase tracking-wider mt-4"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-xs text-charcoal">
              
              {/* Name */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">WhatsApp Phone Number</label>
                <input
                  type="tel"
                  required
                  placeholder="Enter WhatsApp mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                />
              </div>

              {/* Skill Interest */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Preferred Area of Service</label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2.5 px-3.5 focus:outline-none focus:border-sage transition-all"
                >
                  <option value="Food Seva">Food Seva Drives</option>
                  <option value="Women Skill-Building">Women Skill-Building Help</option>
                  <option value="Shiksha Kendra Child Help">Shiksha Kendra Children Tutoring</option>
                  <option value="Animal Welfare">Animal Feeding & Rescue Help</option>
                  <option value="Environmental Cleanliness">Environmental Cleaning Campaigns</option>
                </select>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Tell us about your background / skills</label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="3"
                  placeholder="Why would you like to join us, and if you have previous volunteering experience..."
                  className="w-full bg-cream-light border border-cream-dark/60 rounded-xl py-2 px-3 focus:outline-none focus:border-sage transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-sage hover:bg-sage-dark text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center uppercase tracking-wider mt-2"
              >
                {submitting ? 'Submitting Form...' : 'Submit Application'}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default NGO;
