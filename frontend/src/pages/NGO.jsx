import React, { useState, useContext } from 'react';
import { Compass, CheckCircle, Heart, Users, BookOpen, Smile, ShieldAlert, GraduationCap, Apple, Flame, Sparkles, Shield, HeartPulse, Leaf, Calendar, Cat } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import founderImg from '../assets/founder.jpg';
import sevaLogo from '../assets/seva_logo.png';
import animalWelfare1 from '../assets/gallery/animal_welfare_1.jpg';
import animalWelfare2 from '../assets/gallery/animal_welfare_2.jpg';
import animalWelfare3 from '../assets/gallery/animal_welfare_3.jpg';
import animalWelfare4 from '../assets/gallery/animal_welfare_4.jpg';
import animalWelfare5 from '../assets/gallery/animal_welfare_5.jpg';
import womenHygiene1 from '../assets/gallery/women_hygiene_1.jpg';
import womenHygiene2 from '../assets/gallery/women_hygiene_2.jpg';
import womenHygiene3 from '../assets/gallery/women_hygiene_3.jpg';
import mahabhoj1 from '../assets/gallery/mahabhoj_1.png';
import mahabhoj2 from '../assets/gallery/mahabhoj_2.png';
import mahabhoj3 from '../assets/gallery/mahabhoj_3.png';
import mahabhoj4 from '../assets/gallery/mahabhoj_4.png';
import shikshaKendra1 from '../assets/gallery/shiksha_kendra_1.png';
import shikshaKendra2 from '../assets/gallery/shiksha_kendra_2.png';
import shikshaKendra3 from '../assets/gallery/shiksha_kendra_3.jpg';
import shikshaKendra4 from '../assets/gallery/shiksha_kendra_4.jpg';
import shikshaKendra5 from '../assets/gallery/shiksha_kendra_5.jpg';
import shikshaKendra6 from '../assets/gallery/shiksha_kendra_6.jpg';
import healthCommunity1 from '../assets/gallery/health_community_1.png';
import healthCommunity2 from '../assets/gallery/health_community_2.png';
import shikshaHeroBanner from '../assets/gallery/shiksha_hero_banner.jpg';

const NGO = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user ? user.name : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Food Seva');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const animalWelfareGallery = [
    {
      img: animalWelfare1,
      title: "Community Dog Feeding Drive",
      caption: "Distributing freshly cooked, nourishing meals to street dogs across neighborhood corners."
    },
    {
      img: animalWelfare2,
      title: "Stray Pack Daily Nourishment",
      caption: "Ensuring community dog packs receive safe daily meals and fresh clean water bowls."
    },
    {
      img: animalWelfare3,
      title: "Gau Seva & Fresh Fodder Seva",
      caption: "Ascension Seva volunteers serving nutrient-dense green fodder to sacred cows."
    },
    {
      img: animalWelfare4,
      title: "Sanctuary Care & Cow Protection",
      caption: "Providing peaceful shelter care, medical support, and food for resting cows."
    },
    {
      img: animalWelfare5,
      title: "Rescued Stray Pet Care & Rehabilitation",
      caption: "Loving nourishment, medical care, and gentle rehabilitation for elderly and rescued pets."
    }
  ];

  const womenHygieneGallery = [
    {
      img: womenHygiene1,
      title: "Menstrual Hygiene & Dignity Kits",
      caption: "Distributing free sanitary napkin kits to women and young girls in underserved communities."
    },
    {
      img: womenHygiene2,
      title: "Doorstep Health Outreach & Care",
      caption: "Direct doorstep distribution ensuring women receive essential hygiene supplies with safety and dignity."
    },
    {
      img: womenHygiene3,
      title: "Dignity Awareness & Community Sessions",
      caption: "Empowering women with menstrual hygiene education, breaking taboos, and supporting health."
    }
  ];

  const mahabhojGallery = [
    {
      img: mahabhoj1,
      title: "Mahashivratri Annadan & Prasad Distribution",
      caption: "Ascension Seva volunteers joyfully serving hot prasad, sweets, and meals to seated devotees and families during Mahashivratri."
    },
    {
      img: mahabhoj2,
      title: "Balkalyan Mahabhoj & Nutritious Feast",
      caption: "Underprivileged children being served wholesome, freshly cooked festive meals on traditional eco-friendly pattal plates."
    },
    {
      img: mahabhoj3,
      title: "Community Seva Line & Sweet Distribution",
      caption: "Reaching hundreds of community members and pilgrims with sweet distribution, snacks, and warm meals along seva pathways."
    },
    {
      img: mahabhoj4,
      title: "Live Food Seva Counter & Community Kitchen",
      caption: "Our dedicated volunteer team running live community Annadan stalls, serving 5,000+ hot meals and refreshments."
    }
  ];

  const shikshaKendraGallery = [
    {
      img: shikshaHeroBanner,
      title: "Shiksha Kendra Student & Volunteer Community",
      caption: "Our vibrant children and mentorship team celebrating milestones, learning together, and building brighter futures."
    },
    {
      img: shikshaKendra1,
      title: "Children's Creative Learning & Activity Circle",
      caption: "Underprivileged children engaging in collaborative drawing, writing, and early foundational learning sessions."
    },
    {
      img: shikshaKendra2,
      title: "Women's Literacy & Community Education Circle",
      caption: "Empowering mothers and rural women with basic literacy, numeracy, and life-skills learning circles."
    },
    {
      img: shikshaKendra3,
      title: "Dedicated Classroom Studies & Mentorship",
      caption: "Providing textbooks, study desks, quiet learning environments, and academic guidance for ambitious students."
    },
    {
      img: shikshaKendra4,
      title: "Interactive Digital Learning & Value Mentorship",
      caption: "Audio-visual smart classroom sessions and character-building mentorship guided by devoted educators."
    },
    {
      img: shikshaKendra5,
      title: "Strategic Minds",
      caption: "Cultivating focus, problem-solving, analytical reasoning, and strategic thinking through guided interactive learning."
    },
    {
      img: shikshaKendra6,
      title: "Self-Paced Study & Literacy Support",
      caption: "Dedicated syllabus reading practice, textbooks, and personalized academic guidance for young learners."
    }
  ];

  const healthCommunityGallery = [
    {
      img: healthCommunity1,
      title: "Community Nutrition & Patient Care",
      caption: "Distributing protein supplements, nutritional care formulas, and medical kits to patients and elder care centers."
    },
    {
      img: healthCommunity2,
      title: "Medical Outreach & Care Packages",
      caption: "Providing essential healthcare supplies, adult care kits, and wellness packages directly to vulnerable families."
    }
  ];

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

  const otherInitiatives = [
    {
      icon: <Apple className="w-5 h-5 text-gold-dark" />,
      title: "Annadan & Jal Seva Campaign",
      desc: "Organizing regular food distribution and clean drinking water seva drives for vulnerable communities, daily wage workers, and families in need throughout the year."
    },
    {
      icon: <Sparkles className="w-5 h-5 text-gold-dark" />,
      title: "Shravan Shraddha Seva Campaign",
      desc: "During the sacred month of Shravan, we embrace the philosophy of \"Serving Shiva by Serving His Creation.\" Through this initiative, Ascension Seva successfully provided meals and support to 10,000+ individuals, reinforcing the belief that humanity itself is the truest form of worship."
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
      icon: <Users className="w-5 h-5 text-gold-dark" />,
      title: "Volunteer & Community Engagement Campaign",
      desc: "Creating opportunities for citizens and corporate teams to actively participate in community service and create tangible social impact."
    }
  ];

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto flex flex-col gap-10 sm:gap-16">

        {/* Ascension Seva Hero Banner with Bright Background Photo */}
        <div className="relative rounded-[28px] sm:rounded-3xl overflow-hidden shadow-xl border border-gold/30 bg-[#FFFDF7] text-center p-6 sm:p-10 md:p-12 flex flex-col items-center justify-between min-h-[440px] sm:min-h-[500px]">
          {/* Background Photo in Full Natural Light */}
          <img 
            src={shikshaHeroBanner} 
            alt="Ascension Seva - Shiksha Kendra" 
            className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
          />

          {/* Light, delicate ambient overlay ensuring the background photo is 100% visible and bright */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/20 to-white/85"></div>
          <div className="absolute inset-0 bg-radial from-transparent via-white/10 to-white/40"></div>

          {/* Top Badge */}
          <div className="relative z-10">
            <span className="font-sans text-[10px] sm:text-xs text-sage-dark tracking-[0.25em] font-bold uppercase bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-gold/30 shadow-sm">
              ✨ Selfless Service & Social Impact
            </span>
          </div>

          {/* Center Logo Floating */}
          <div className="relative z-10 flex justify-center my-auto py-2 filter drop-shadow-[0_4px_12px_rgba(255,255,255,0.9)]">
            <img src={`${sevaLogo}?v=3`} alt="Ascension Seva" className="h-24 sm:h-32 md:h-36 w-auto object-contain" />
          </div>

          {/* Bottom Clean Glass Caption Pill */}
          <div className="relative z-10 max-w-2xl 2xl:max-w-3xl mx-auto bg-white/85 backdrop-blur-md px-6 py-3.5 rounded-2xl border border-gold/25 shadow-md">
            <p className="text-xs sm:text-sm text-charcoal font-sans font-medium leading-relaxed">
              At Ascension, we believe that true spirituality is reflected in service to humanity. Through Seva, we create ripples of healing, education, and compassion across Delhi's underprivileged communities.
            </p>
          </div>
        </div>

        {/* Flagship Seva Campaigns Spotlight (Rendered ONCE cleanly) */}
        <div className="flex flex-col gap-10 sm:gap-14">
          <div className="text-center">
            <span className="font-sans text-[10px] sm:text-xs text-sage tracking-[0.25em] font-bold uppercase">On-Ground Impact</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-dark mt-1">Our Flagship Campaigns & Live Seva Drives</h2>
          </div>

          {/* 1. Shiksha Kendra Campaign Dedicated Spotlight */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-blue-500/30 flex flex-col gap-6 text-left bg-gradient-to-br from-white/90 via-blue-50/20 to-white/90 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-700">Empowering Minds • Education Seva</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-dark mt-0.5">Shiksha Kendra Campaign</h3>
              </div>
              <p className="text-xs text-charcoal-light max-w-md leading-relaxed">
                Providing educational support, learning resources, mentorship, and opportunities to underprivileged children and women to break the cycle of poverty.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {shikshaKendraGallery.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(item)}
                  className="bg-white rounded-2xl overflow-hidden border border-cream-dark/50 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col group"
                >
                  <div className="h-52 overflow-hidden relative bg-cream">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-charcoal-dark/75 text-white text-[9px] px-2.5 py-0.5 rounded-full backdrop-blur-xs font-sans font-medium">
                      Drive Photo {idx + 1}/6
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-1.5 flex-1">
                    <h5 className="font-serif font-bold text-sm text-charcoal-dark group-hover:text-gold-dark transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-charcoal-light leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Mahabhoj Campaign Dedicated Spotlight */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-amber-500/30 flex flex-col gap-6 text-left bg-gradient-to-br from-white/90 via-amber-50/20 to-white/90 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700">Annadan Seva • 5,000+ Fed</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-dark mt-0.5">Mahabhoj Campaign – Mahashivratri Seva</h3>
              </div>
              <p className="text-xs text-charcoal-light max-w-md leading-relaxed">
                Celebrating the divine spirit of Annadan on Mahashivratri by serving hot wholesome meals, sweets, and nourishment to thousands of children, devotees, and families in need.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mahabhojGallery.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(item)}
                  className="bg-white rounded-2xl overflow-hidden border border-cream-dark/50 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col group"
                >
                  <div className="h-52 overflow-hidden relative bg-cream">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-charcoal-dark/75 text-white text-[9px] px-2.5 py-0.5 rounded-full backdrop-blur-xs font-sans font-medium">
                      Drive Photo {idx + 1}/4
                    </div>
                  </div>
                  <div className="p-3.5 flex flex-col gap-1 flex-1">
                    <h5 className="font-serif font-bold text-xs text-charcoal-dark group-hover:text-gold-dark transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-charcoal-light leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Animal Welfare Dedicated Spotlight */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-sage/30 flex flex-col gap-6 text-left bg-gradient-to-br from-white/90 via-emerald-50/20 to-white/90 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-sage">On-Ground Impact • Street Animal Care</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-dark mt-0.5">Animal Welfare & Compassion Drives</h3>
              </div>
              <p className="text-xs text-charcoal-light max-w-md leading-relaxed">
                Ascension Seva volunteers actively nourish street animals and sanctuary cows with daily meals, fresh green fodder, and loving medical care.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {animalWelfareGallery.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(item)}
                  className="bg-white rounded-2xl overflow-hidden border border-cream-dark/50 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col group"
                >
                  <div className="h-44 overflow-hidden relative bg-cream">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-charcoal-dark/75 text-white text-[9px] px-2 py-0.5 rounded-full backdrop-blur-xs font-sans font-medium">
                      Drive Photo {idx + 1}/5
                    </div>
                  </div>
                  <div className="p-3.5 flex flex-col gap-1 flex-1">
                    <h5 className="font-serif font-bold text-xs text-charcoal-dark group-hover:text-gold-dark transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-charcoal-light leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Women's Dignity & Menstrual Hygiene Dedicated Spotlight */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-gold/30 flex flex-col gap-6 text-left bg-gradient-to-br from-white/90 via-cream/20 to-white/90 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-dark">Empowering Health & Dignity</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-dark mt-0.5">Women's Dignity & Menstrual Hygiene Campaign</h3>
              </div>
              <p className="text-xs text-charcoal-light max-w-md leading-relaxed">
                Conducting awareness sessions, breaking stigmas, and distributing sanitary napkin dignity kits directly to women and young girls in underserved communities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {womenHygieneGallery.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(item)}
                  className="bg-white rounded-2xl overflow-hidden border border-cream-dark/50 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col group"
                >
                  <div className="h-52 overflow-hidden relative bg-cream">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-charcoal-dark/75 text-white text-[9px] px-2.5 py-0.5 rounded-full backdrop-blur-xs font-sans font-medium">
                      Drive Photo {idx + 1}/3
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-1.5 flex-1">
                    <h5 className="font-serif font-bold text-sm text-charcoal-dark group-hover:text-gold-dark transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-charcoal-light leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Health & Community Wellness Dedicated Spotlight */}
          <div className="glass p-6 sm:p-8 rounded-3xl border border-rose-400/40 flex flex-col gap-6 text-left bg-gradient-to-br from-white/90 via-rose-50/25 to-white/90 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-rose-700">Healthcare Seva • Community Care</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-dark mt-0.5">Health & Community Wellness Campaign</h3>
              </div>
              <p className="text-xs text-charcoal-light max-w-md leading-relaxed">
                Supporting underserved communities, patients, and families in need through healthcare outreach, nutritional care supplements, medical supplies, and wellness aid.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {healthCommunityGallery.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPhoto(item)}
                  className="bg-white rounded-2xl overflow-hidden border border-cream-dark/50 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col group"
                >
                  <div className="h-56 sm:h-64 overflow-hidden relative bg-cream">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5 bg-charcoal-dark/75 text-white text-[9px] px-2.5 py-0.5 rounded-full backdrop-blur-xs font-sans font-medium">
                      Drive Photo {idx + 1}/2
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-1.5 flex-1">
                    <h5 className="font-serif font-bold text-sm text-charcoal-dark group-hover:text-gold-dark transition-colors">
                      {item.title}
                    </h5>
                    <p className="text-[11px] text-charcoal-light leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* More Ongoing Seva Initiatives */}
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <span className="font-sans text-[10px] sm:text-xs text-sage tracking-[0.25em] font-bold uppercase">Expanding Our Reach</span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal-dark mt-1">Additional Ongoing Seva Initiatives</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherInitiatives.map((ini, index) => (
              <div key={index} className="glass p-5 rounded-2xl flex flex-col gap-3 text-left border border-cream-dark/50 shadow-xs hover:shadow-md transition-all bg-white/70">
                <div className="flex gap-3 items-start">
                  <div className="bg-cream p-2.5 rounded-xl border border-cream-dark/60 self-start shrink-0">
                    {ini.icon}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <h4 className="font-serif text-sm font-bold text-charcoal-dark">{ini.title}</h4>
                    <p className="text-[11px] text-charcoal-light leading-relaxed">{ini.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story & Founder Mission */}
        <div className="glass p-6 sm:p-10 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center border border-cream-dark/65 shadow-md bg-white/70">
          <div className="h-80 md:h-[460px] rounded-2xl overflow-hidden bg-cream shadow-sm group">
            <img
              src={founderImg}
              alt="Sonali Bhasin Kumar - Founder"
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col gap-3.5 text-left">
            <span className="font-sans text-[10px] text-sage tracking-[0.25em] font-bold uppercase">The Journey</span>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-dark uppercase tracking-wider">Our Story</h3>
            <span className="font-cormorant text-sm md:text-base text-gold-dark font-semibold -mt-2 block">
              From One Thought In 2022 To A Growing Movement Of Change
            </span>
            <p className="text-xs text-charcoal-light leading-relaxed font-sans mt-1">
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
            <div className="mt-2 border-l-2 border-gold pl-4 py-1.5 text-charcoal-light leading-relaxed bg-cream-light/40 rounded-r-xl">
              <p className="font-cormorant text-sm italic">
                "We don't just serve communities — we walk alongside them, empowering them to write their own stories of change."
              </p>
              <p className="text-[10px] uppercase font-bold text-gold-dark font-sans tracking-wide mt-1.5">
                — Sonali Bhasin Kumar, Ascension Seva
              </p>
            </div>
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

        {/* Lightbox Modal */}
        {selectedPhoto && (
          <div
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-charcoal-dark/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-xl w-full shadow-2xl border border-cream-dark flex flex-col animate-scale-up"
            >
              <div className="max-h-[65vh] bg-charcoal-dark/95 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={selectedPhoto.img}
                  alt={selectedPhoto.title}
                  className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl"
                />
              </div>
              <div className="p-5 flex flex-col gap-1.5 text-left bg-white">
                <span className="text-[10px] uppercase tracking-widest text-gold-dark font-bold">
                  {selectedPhoto.title.includes("Strategic") || selectedPhoto.title.includes("Learning") || selectedPhoto.title.includes("Literacy") || selectedPhoto.title.includes("Mentorship") || selectedPhoto.title.includes("Classroom") || selectedPhoto.title.includes("Study")
                    ? "Shiksha Kendra • Education & Mentorship Seva"
                    : selectedPhoto.title.includes("Prasad") || selectedPhoto.title.includes("Mahabhoj") || selectedPhoto.title.includes("Kitchen")
                    ? "Mahabhoj • Annadan & Festival Seva"
                    : selectedPhoto.title.includes("Hygiene") || selectedPhoto.title.includes("Napkin") || selectedPhoto.title.includes("Dignity")
                    ? "Women's Dignity & Hygiene Seva"
                    : selectedPhoto.title.includes("Nutrition") || selectedPhoto.title.includes("Medical") || selectedPhoto.title.includes("Patient") || selectedPhoto.title.includes("Healthcare")
                    ? "Health & Community Wellness Seva"
                    : "Animal Welfare & Compassion Seva"}
                </span>
                <h4 className="font-serif font-bold text-base text-charcoal-dark">{selectedPhoto.title}</h4>
                <p className="text-xs text-charcoal-light leading-relaxed">{selectedPhoto.caption}</p>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="bg-cream hover:bg-cream-dark/60 text-charcoal font-bold text-xs py-1.5 px-4 rounded-xl transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NGO;
