import React, { useState, useContext } from 'react';
import { Compass, CheckCircle, Heart, Users, BookOpen, Smile, ShieldAlert, GraduationCap, Apple, Flame, Sparkles, Shield, HeartPulse, Leaf, Calendar, Cat } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import founderImg from '../assets/founder.jpg';

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
      icon: <GraduationCap className="w-5 h-5 text-gold-dark" />,
      title: "Shiksha Kendra Campaign",
      desc: "Providing educational support, learning resources, mentorship, and opportunities to underprivileged children because education remains the strongest tool for breaking the cycle of poverty."
    },
    {
      icon: <Apple className="w-5 h-5 text-gold-dark" />,
      title: "Annadan & Jal Seva Campaign",
      desc: "Organizing food distribution and water seva drives for vulnerable communities, daily wage workers, and families in need throughout the year."
    },
    {
      icon: <Flame className="w-5 h-5 text-gold-dark" />,
      title: "Mahabhoj Campaign – Mahashivratri Seva",
      desc: "One of our most impactful initiatives, where we served and fed 5,000+ individuals during Mahashivratri, celebrating the spirit of service through Annadan and community support."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-gold-dark" />,
      title: "Shravan Shraddha Seva Campaign",
      desc: "During the sacred month of Shravan, we embrace the philosophy of \"Serving Shiva by Serving His Creation.\" Through this initiative, Ascension Seva successfully provided meals and support to 10,000+ individuals, reinforcing the belief that humanity itself is the truest form of worship."
    },
    {
      icon: <Shield className="w-5 h-5 text-gold-dark" />,
      title: "Women's Dignity & Menstrual Hygiene Campaign",
      desc: "Conducting awareness sessions and sanitary napkin distribution drives to promote menstrual health, dignity, and education for women and young girls."
    },
    {
      icon: <HeartPulse className="w-5 h-5 text-gold-dark" />,
      title: "Health & Community Wellness Campaign",
      desc: "Supporting underserved communities through awareness initiatives, wellness programs, and healthcare outreach activities."
    },
    {
      icon: <Leaf className="w-5 h-5 text-gold-dark" />,
      title: "Environmental Sustainability Campaign",
      desc: "Organizing plantation drives, cleanliness initiatives, and environmental awareness campaigns to create a greener and healthier future."
    },
    {
      icon: <Calendar className="w-5 h-5 text-gold-dark" />,
      title: "Festival Seva Campaigns",
      desc: "Conducting large-scale community service initiatives during festivals, Ekadashi observances, and other spiritually significant occasions, ensuring that celebrations are shared with those who need support the most."
    },
    {
      icon: <Cat className="w-5 h-5 text-gold-dark" />,
      title: "Animal Welfare & Compassion Campaign",
      desc: "Providing food and care for stray animals while promoting compassion and coexistence within communities."
    },
    {
      icon: <Users className="w-5 h-5 text-gold-dark" />,
      title: "Volunteer & Community Engagement Campaign",
      desc: "Creating opportunities for citizens and corporate teams to actively participate in community service and create tangible social impact."
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
        <div className="glass p-8 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-10 items-start border border-cream-dark/65">
          <div className="h-96 md:h-full md:min-h-[480px] rounded-2xl overflow-hidden bg-cream shadow-sm group">
            <img 
              src={founderImg} 
              alt="Sonali Bhasin Kumar - Founder" 
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
            />
          </div>
          <div className="flex flex-col gap-4 text-left">
            <h3 className="font-serif text-lg font-bold text-charcoal-dark uppercase tracking-wider">Our Story</h3>
            <span className="font-cormorant italic text-[13px] text-gold-dark font-medium -mt-2 block">
              From One Thought In 2022 To A Growing Movement Of Change
            </span>
            <p className="text-xs text-charcoal-light leading-relaxed font-sans mt-2">
              Ascension Seva began in 2022 with a simple belief — that meaningful change does not always begin with large resources; it begins with people who care enough to act.
            </p>
            <p className="text-xs text-charcoal-light leading-relaxed font-sans">
              What started as a vision to serve communities with dignity has transformed into a journey of impact, compassion, and responsibility. With every initiative, every drive, every volunteer, and every life touched, we discovered that true change happens when kindness is converted into action.
            </p>
            <p className="text-xs text-charcoal-light leading-relaxed font-sans">
              Over the years, Ascension Seva has evolved—not only in scale, but in purpose, systems, and reach. We have learned, adapted, grown, and continuously transformed ourselves to create deeper and more sustainable impact.
            </p>
            <p className="text-xs text-charcoal-light leading-relaxed font-sans">
              Today, we are building more than campaigns. We are building trust, opportunity, dignity, and communities that can grow stronger together.
            </p>
            <p className="text-xs text-charcoal-light leading-relaxed font-sans">
              This journey has only been possible because of people and partners who chose to believe that impact is created collectively.
            </p>
            <p className="text-xs text-charcoal-light leading-relaxed font-sans">
              We invite organisations and CSR leaders to become a part of the next chapter—where purpose meets measurable change and every contribution becomes a story of transformation.
            </p>
            <p className="text-xs text-charcoal-light font-bold leading-relaxed font-sans">
              Together, we don’t just support communities. We help shape futures.
            </p>

            {/* Quote block */}
            <div className="mt-4 border-l-2 border-gold pl-4 py-1 italic text-charcoal-light leading-relaxed bg-cream-light/30 rounded-r-xl">
              <p className="font-cormorant text-sm">
                "We don't just serve communities — we walk alongside them, empowering them to write their own stories of change."
              </p>
              <p className="text-[10px] uppercase font-bold text-gold-dark font-sans tracking-wide mt-2">
                — Sonali Bhasin Kumar, Ascension Seva
              </p>
            </div>
          </div>
        </div>

        {/* Key Initiatives */}
        <div className="flex flex-col gap-6">
          <h3 className="font-serif text-xl font-bold text-charcoal-dark text-center mb-4">Our Flagship Campaigns & Impact Initiatives</h3>
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
