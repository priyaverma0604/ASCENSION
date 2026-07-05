import React from 'react';
import { Compass, ShieldCheck, HeartHandshake, Eye, Flame } from 'lucide-react';
import founderImg from '../assets/founder.jpg';

const About = () => {
  const philosophies = [
    {
      icon: <Flame className="w-5 h-5 text-gold-dark" />,
      title: "Subconscious Alignment",
      description: "True healing begins by identifying and rewriting the limiting patterns, fears, and scripts stored in the subconscious mind."
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-gold-dark" />,
      title: "Cellular Vibration",
      description: "Using sound frequencies (singing bowls) to reset chaotic cellular structures and calm the active nervous system."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-gold-dark" />,
      title: "Angelic Guidance",
      description: "Inviting divine universal guidance to navigate personal blockages, retrieve clarity, and realign with your higher self."
    }
  ];

  return (
    <div className="min-h-screen py-16 px-6 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        
        {/* Title */}
        <div className="text-center flex flex-col gap-3">
          <span className="font-serif italic text-xs text-sage tracking-wider uppercase font-semibold">About Ascension</span>
          <h1 className="font-serif text-3xl md:text-4xl font-bold tracking-wide text-charcoal-dark leading-tight">
            A Journey of Healing, Light & <br />
            <span className="text-gold-dark italic">Spiritual Awakening</span>
          </h1>
          <p className="max-w-xl mx-auto text-xs text-charcoal-light leading-relaxed mt-2">
            Providing a sacred, supportive sanctuary where souls can release ancestral blockages and manifest their divine purpose.
          </p>
        </div>

        {/* Section 1: Founder Story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="w-full h-80 rounded-2xl overflow-hidden shadow-sm bg-cream">
            <img 
              src={founderImg} 
              alt="Sonali Bhasin Kumar" 
              className="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col gap-4 text-left">
            <h3 className="font-serif text-lg font-bold text-charcoal-dark uppercase tracking-wider">Meet the Founder</h3>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Ascension was created to offer a sacred, supportive space where individuals can reconnect, heal, and awaken spiritually. Founded by **Sonali Bhasin Kumar**, Ascension is not just a healing center—it is a community, a sanctuary, and a path to self-discovery.
            </p>
            <p className="text-xs text-charcoal-light leading-relaxed">
              Sonali Bhasin Kumar is a spiritual healer, manifestation coach, and energy therapist. Her mission is to empower individuals to release emotional blocks, embrace self-love, and manifest the life they truly desire. Combining intuition, compassion, energy healing, angelic guidance, and manifestation practices, Sonali creates a safe, nurturing space for transformation.
            </p>
          </div>
        </section>

        {/* Section 2: Mission & Vision Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {/* Mission */}
          <div className="glass p-6 rounded-2xl flex gap-4 text-left shadow-sm">
            <span className="gold-gradient p-2.5 rounded-xl inline-block self-start shrink-0 text-white">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider mb-2">Our Mission</h3>
              <p className="text-xs text-charcoal-light leading-relaxed">
                To spread love, compassion, and healing through humanitarian initiatives, empowering individuals and communities to thrive emotionally, spiritually, and socially. We aim to help souls align their mind, body, and spirit so they experience clarity and inner peace.
              </p>
            </div>
          </div>

          {/* Vision */}
          <div className="glass p-6 rounded-2xl flex gap-4 text-left shadow-sm">
            <span className="gold-gradient p-2.5 rounded-xl inline-block self-start shrink-0 text-white">
              <Eye className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-serif text-base font-bold text-charcoal-dark uppercase tracking-wider mb-2">Our Vision</h3>
              <p className="text-xs text-charcoal-light leading-relaxed">
                To serve as a catalyst for collective spiritual evolution. We envision a society where compassion converges with action, where every act of service uplifts other lives, raising the planetary vibration.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Healing Philosophy */}
        <section className="bg-cream/30 border border-cream-dark/60 p-8 rounded-2xl text-center">
          <span className="font-serif italic text-xs text-sage tracking-wider uppercase font-semibold">Underlying Wisdom</span>
          <h3 className="font-serif text-xl font-bold text-charcoal-dark mt-1 mb-8">Our Healing Philosophy</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {philosophies.map((ph, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3 text-center">
                <div className="bg-cream p-3 rounded-full border border-cream-dark/60">
                  {ph.icon}
                </div>
                <h4 className="font-serif text-sm font-bold text-charcoal-dark">{ph.title}</h4>
                <p className="text-[11px] text-charcoal-light leading-relaxed px-2">{ph.description}</p>
              </div>
            ))}
          </div>
          
          <p className="text-xs text-sage font-serif italic mt-10 leading-relaxed border-t border-cream-dark/60 pt-6">
            "Healing at Ascension is not just about temporary relief—it is about lasting energetic transformation, self-empowerment, and reconnecting with your highest self."
          </p>
        </section>

      </div>
    </div>
  );
};

export default About;
