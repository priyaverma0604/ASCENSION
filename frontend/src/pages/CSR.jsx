import React, { useState } from 'react';
import { 
  GraduationCap, Apple, Flame, Sparkles, Shield, HeartPulse, Leaf, 
  Calendar, Cat, Users, ArrowRight, CheckCircle, ShieldCheck, Mail, 
  Phone, FileText, ChevronRight, MessageSquare, Award, BarChart, Heart
} from 'lucide-react';
import axios from 'axios';
import waterfallBg from '../assets/waterfall_bg.jpg';
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

const CSR = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedAnimalPhoto, setSelectedAnimalPhoto] = useState(null);

  const animalWelfarePhotos = [
    { src: animalWelfare1, title: "Community Dog Feeding", caption: "Nutritious daily meals served to stray dogs." },
    { src: animalWelfare2, title: "Stray Pack Care", caption: "Pack feeding and clean water bowls in community neighborhoods." },
    { src: animalWelfare3, title: "Gau Seva & Fodder Distribution", caption: "Volunteers serving fresh green fodder to cows." },
    { src: animalWelfare4, title: "Cow Protection & Sanctuary", caption: "Safe shelter and continuous nourishment for cows." },
    { src: animalWelfare5, title: "Rescued Stray Rehabilitation", caption: "Medical support and loving food for rescued strays." }
  ];

  const womenHygienePhotos = [
    { src: womenHygiene1, title: "Sanitary Napkin Kit Distribution", caption: "Distributing free sanitary kits & health kits to women in underserved areas." },
    { src: womenHygiene2, title: "Doorstep Health Outreach", caption: "Direct doorstep outreach ensuring safe menstrual hygiene with dignity." },
    { src: womenHygiene3, title: "Dignity & Menstrual Education", caption: "Awareness sessions breaking stigmas and promoting women's wellness." }
  ];

  const mahabhojPhotos = [
    { src: mahabhoj1, title: "Mahashivratri Prasad Seva", caption: "Joyfully distributing hot prasad and sweets during Mahabhoj." },
    { src: mahabhoj2, title: "Balkalyan Mahabhoj Feast", caption: "Serving hot, nutritious meals on eco-friendly plates to children." },
    { src: mahabhoj3, title: "Community Seva & Sweets", caption: "Distribution of snacks and prasad along community seva lines." },
    { src: mahabhoj4, title: "Live Annadan Kitchen Counter", caption: "Volunteer team managing live meal distribution serving 5,000+ people." }
  ];

  const healthCommunityPhotos = [
    { src: healthCommunity1, title: "Community Nutrition & Patient Care", caption: "Distributing protein supplements, nutritional care formulas, and medical kits." },
    { src: healthCommunity2, title: "Medical Outreach & Essential Supplies", caption: "Direct distribution of essential healthcare supplies, adult care kits, and medicines." }
  ];

  const shikshaKendraPhotos = [
    { src: shikshaKendra1, title: "Children's Creative Learning Circle", caption: "Early childhood education, drawing, and foundational literacy." },
    { src: shikshaKendra2, title: "Women's Literacy & Adult Education", caption: "Empowering mothers and rural women with functional literacy." },
    { src: shikshaKendra3, title: "Student Classroom Mentorship", caption: "Textbooks, mentorship, and quiet study spaces for underprivileged students." },
    { src: shikshaKendra4, title: "Digital Classroom & Value Mentorship", caption: "Interactive smart classroom learning and moral guidance." },
    { src: shikshaKendra5, title: "Strategic Minds", caption: "Strategic thinking, focus, analytical reasoning, and cognitive mind development." },
    { src: shikshaKendra6, title: "Self-Paced Reading & Academic Literacy", caption: "Curriculum textbooks and dedicated reading study support." }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name,
        email,
        phone,
        message: `[CSR PARTNERSHIP INQUIRY]\nCompany: ${company}\n\nMessage:\n${message}`
      };
      
      const { data } = await axios.post('/api/contacts', payload);
      if (data.success) {
        setSuccess(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit CSR inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const initiatives = [
    {
      icon: <GraduationCap className="w-6 h-6 text-gold-dark" />,
      title: "Shiksha Kendra Campaign",
      desc: "Providing educational support, learning resources, mentorship, and opportunities to underprivileged children because education remains the strongest tool for breaking the cycle of poverty."
    },
    {
      icon: <Apple className="w-6 h-6 text-gold-dark" />,
      title: "Annadan & Jal Seva Campaign",
      desc: "Organizing food distribution and water seva drives for vulnerable communities, daily wage workers, and families in need throughout the year."
    },
    {
      icon: <Flame className="w-6 h-6 text-gold-dark" />,
      title: "Mahabhoj Campaign – Mahashivratri Seva",
      desc: "One of our most impactful initiatives, where we served and fed 5,000+ individuals during Mahashivratri, celebrating the spirit of service through Annadan and community support."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-gold-dark" />,
      title: "Shravan Shraddha Seva Campaign",
      desc: "Embracing the philosophy of 'Serving Shiva by Serving His Creation.' Through this initiative, Ascension Seva successfully provided meals and support to 10,000+ individuals."
    },
    {
      icon: <Shield className="w-6 h-6 text-gold-dark" />,
      title: "Women's Dignity & Menstrual Hygiene Campaign",
      desc: "Conducting awareness sessions and sanitary napkin distribution drives to promote menstrual health, dignity, and education for women and young girls."
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-gold-dark" />,
      title: "Health & Community Wellness Campaign",
      desc: "Supporting underserved communities through awareness initiatives, wellness programs, and healthcare outreach activities."
    },
    {
      icon: <Leaf className="w-6 h-6 text-gold-dark" />,
      title: "Environmental Sustainability Campaign",
      desc: "Organizing plantation drives, cleanliness initiatives, and environmental awareness campaigns to create a greener and healthier future."
    },
    {
      icon: <Calendar className="w-6 h-6 text-gold-dark" />,
      title: "Festival Seva Campaigns",
      desc: "Conducting large-scale community service initiatives during festivals, Ekadashi observances, and other spiritually significant occasions, ensuring celebrations are shared with those in need."
    },
    {
      icon: <Cat className="w-6 h-6 text-gold-dark" />,
      title: "Animal Welfare & Compassion Campaign",
      desc: "Providing food and care for stray animals while promoting compassion and coexistence within communities."
    },
    {
      icon: <Users className="w-6 h-6 text-gold-dark" />,
      title: "Volunteer & Community Engagement Campaign",
      desc: "Creating opportunities for citizens and corporate teams to actively participate in community service and create tangible social impact."
    }
  ];

  const whatPartnershipCreates = [
    "The meal that allows a child to sleep without hunger.",
    "The notebook that helps a student continue their education.",
    "The sanitary kit that helps a young girl attend school with dignity.",
    "The tree that contributes to a healthier environment.",
    "The act of kindness that restores hope to a family in need."
  ];

  const supportContributesTowards = [
    "Feeding vulnerable communities across urban and rural belts",
    "Supporting quality education & supplies for underprivileged children",
    "Empowering women through menstrual health & dignity initiatives",
    "Organizing medical, wellness, and preventive healthcare camps",
    "Environmental sustainability, waste reduction & plantation drives",
    "Large-scale community welfare and disaster relief programs",
    "Employee volunteering, hands-on participation & team engagement"
  ];

  const whatWeOffer = [
    { title: "Detailed Impact Reports", desc: "Complete transparency in fund utilization with verified metrics." },
    { title: "Campaign-wise Documentation", desc: "Granular photo and beneficiary reports for every social project." },
    { title: "Branding & Visibility", desc: "Public co-branding and banner displays during campaigns and events." },
    { title: "Employee Volunteering", desc: "Structured engagement opportunities connecting corporate staff to human care." },
    { title: "Social Media Recognition", desc: "Highlighting joint collaborative initiatives across digital platforms." },
    { title: "Customized CSR Projects", desc: "Projects tailor-designed to align with your organization's vision and goals." }
  ];

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-6 md:px-8 font-sans relative overflow-hidden">
      <div className="max-w-5xl 2xl:max-w-6xl 3xl:max-w-7xl mx-auto flex flex-col gap-14 sm:gap-24 relative z-10">

        {/* SECTION 1: HERO */}
        <section className="relative rounded-[32px] overflow-hidden border border-cream-dark/60 shadow-xl bg-white/40 backdrop-blur-xs min-h-[420px] sm:min-h-[460px] flex items-center p-6 sm:p-8 md:p-14">
          <div className="absolute inset-0 z-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: `url(${waterfallBg})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-transparent z-0" />
          
          <div className="flex flex-col gap-4 sm:gap-6 text-left relative z-10 max-w-xl 2xl:max-w-2xl">
            <span className="font-cormorant text-sm sm:text-base text-gold-dark font-bold tracking-wider uppercase">
              Ascension Seva Foundation
            </span>
            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-bold tracking-wide text-charcoal-dark leading-tight">
              An Invitation to Create Impact Together
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed font-sans">
              Corporate Social Responsibility is no longer just about giving back—it is about creating measurable impact and building a legacy that communities remember for generations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <a 
                href="#partner-form" 
                className="bg-gold hover:bg-gold-dark text-charcoal-dark font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl shadow-md transition-all duration-300 text-center"
              >
                Become a CSR Partner
              </a>
              <a 
                href="/CSR_Proposal.pdf" 
                download="Ascension_Seva_CSR_Proposal.pdf"
                className="bg-white/80 hover:bg-cream-dark/40 border border-cream-dark/80 text-charcoal-dark font-bold text-xs uppercase tracking-wider py-3.5 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
              >
                <FileText className="w-4 h-4 text-gold-dark" />
                <span>Download Official CSR Proposal</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE VISION & OPENING LETTER */}
        <section className="glass rounded-[28px] p-8 md:p-12 border border-cream-dark/65 text-center flex flex-col gap-8">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            <span className="font-cormorant text-sm text-gold-dark font-bold tracking-wider uppercase">Our Purpose</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-dark">Transforming Compassion into Action</h2>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mt-4 text-left">
            <div className="bg-cream/40 p-6 sm:p-8 rounded-2xl border border-cream-dark/60 flex flex-col justify-center gap-3">
              <p className="font-cormorant text-base sm:text-lg text-charcoal-dark italic leading-relaxed">
                "Somewhere tonight, a child will sleep hungry. Somewhere, a young girl will miss school because she does not have access to basic menstrual hygiene products. Somewhere, an elderly person will wait for a meal that may never come."
              </p>
              <span className="text-[10px] uppercase font-bold text-gold-dark tracking-wider font-sans">
                — Why We Serve Every Day
              </span>
            </div>
            
            <div className="flex flex-col justify-center gap-4 text-xs sm:text-sm text-charcoal-light leading-relaxed font-sans">
              <p>
                For many of us, food, education, dignity, and opportunity are a part of everyday life. For millions, they are still aspirations.
              </p>
              <p>
                At <strong>Ascension Seva Foundation</strong>, we believe that real change begins when compassion is transformed into action. We believe that businesses have the power not only to build economies but also to build stronger communities, brighter futures, and a more equitable society.
              </p>
              <p className="font-medium text-charcoal-dark">
                Every meal served, every child educated, every tree planted, and every life touched creates a ripple effect that extends far beyond a single act of kindness.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: OUR FLAGSHIP CSR INITIATIVES */}
        <section className="flex flex-col gap-8 text-center">
          <div className="flex flex-col gap-2">
            <span className="font-cormorant text-sm text-gold-dark font-bold tracking-wider uppercase">Our Impact Footprint</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-dark">Flagship Campaigns & Impact Initiatives</h2>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {initiatives.map((ini, index) => {
              const isAnimalWelfare = ini.title.includes("Animal Welfare");
              const isWomenHygiene = ini.title.includes("Women's Dignity");
              const isMahabhoj = ini.title.includes("Mahabhoj");
              const isShikshaKendra = ini.title.includes("Shiksha Kendra");
              const isHealthCommunity = ini.title.includes("Health & Community");
              const isExpanded = isAnimalWelfare || isWomenHygiene || isMahabhoj || isShikshaKendra || isHealthCommunity;

              return (
                <div 
                  key={index}
                  className={`glass p-6 rounded-[22px] border border-cream-dark/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 text-left group ${isExpanded ? 'md:col-span-2 bg-gradient-to-br from-white/90 to-cream/40 border-gold/40' : ''}`}
                >
                  <div className="flex gap-4 items-start">
                    <div className="bg-cream/80 p-3.5 rounded-2xl border border-cream-dark/60 self-start shrink-0 group-hover:scale-105 transition-transform text-gold-dark">
                      {ini.icon}
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h4 className="font-serif text-sm sm:text-base font-bold text-charcoal-dark group-hover:text-gold-dark transition-colors">{ini.title}</h4>
                        {isShikshaKendra && (
                          <span className="text-[10px] bg-gold/15 text-gold-dark font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            6 Verified Drive Photos
                          </span>
                        )}
                        {isAnimalWelfare && (
                          <span className="text-[10px] bg-gold/15 text-gold-dark font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            5 Verified Drive Photos
                          </span>
                        )}
                        {isWomenHygiene && (
                          <span className="text-[10px] bg-gold/15 text-gold-dark font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            3 Verified Drive Photos
                          </span>
                        )}
                        {isMahabhoj && (
                          <span className="text-[10px] bg-gold/15 text-gold-dark font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            4 Verified Drive Photos
                          </span>
                        )}
                        {isHealthCommunity && (
                          <span className="text-[10px] bg-gold/15 text-gold-dark font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            2 Verified Drive Photos
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal-light leading-relaxed">{ini.desc}</p>
                    </div>
                  </div>

                  {/* Shiksha Kendra 6 Photos Strip */}
                  {isShikshaKendra && (
                    <div className="mt-1 pt-3 border-t border-cream-dark/50 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-gold-dark tracking-wider">Child Education, Strategic Minds & Mentorship Drive Photos</span>
                        <span className="text-[10px] text-charcoal-light">Click any photo to view full size</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                        {shikshaKendraPhotos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => setSelectedAnimalPhoto(photo)}
                            className="group/item relative h-28 sm:h-32 rounded-xl overflow-hidden cursor-pointer border border-cream-dark/70 shadow-2xs hover:shadow-md transition-all duration-300"
                          >
                            <img
                              src={photo.src}
                              alt={photo.title}
                              className="w-full h-full object-cover object-top group-hover/item:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex items-end p-2">
                              <span className="text-white text-[9px] font-medium leading-tight">{photo.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Animal Welfare 5 Photos Strip */}
                  {isAnimalWelfare && (
                    <div className="mt-1 pt-3 border-t border-cream-dark/50 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-gold-dark tracking-wider">Campaign Live Action Photos</span>
                        <span className="text-[10px] text-charcoal-light">Click any photo to view full size</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                        {animalWelfarePhotos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => setSelectedAnimalPhoto(photo)}
                            className="group/item relative h-28 sm:h-32 rounded-xl overflow-hidden cursor-pointer border border-cream-dark/70 shadow-2xs hover:shadow-md transition-all duration-300"
                          >
                            <img
                              src={photo.src}
                              alt={photo.title}
                              className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex items-end p-2">
                              <span className="text-white text-[9px] font-medium leading-tight">{photo.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Women's Hygiene 3 Photos Strip */}
                  {isWomenHygiene && (
                    <div className="mt-1 pt-3 border-t border-cream-dark/50 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-gold-dark tracking-wider">Women Hygiene & Dignity Drive Photos</span>
                        <span className="text-[10px] text-charcoal-light">Click any photo to view full size</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {womenHygienePhotos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => setSelectedAnimalPhoto(photo)}
                            className="group/item relative h-36 rounded-xl overflow-hidden cursor-pointer border border-cream-dark/70 shadow-2xs hover:shadow-md transition-all duration-300"
                          >
                            <img
                              src={photo.src}
                              alt={photo.title}
                              className="w-full h-full object-cover object-top group-hover/item:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex items-end p-2.5">
                              <span className="text-white text-[10px] font-medium leading-tight">{photo.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mahabhoj 4 Photos Strip */}
                  {isMahabhoj && (
                    <div className="mt-1 pt-3 border-t border-cream-dark/50 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-gold-dark tracking-wider">Mahabhoj Annadan & Shivratri Seva Photos</span>
                        <span className="text-[10px] text-charcoal-light">Click any photo to view full size</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {mahabhojPhotos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => setSelectedAnimalPhoto(photo)}
                            className="group/item relative h-32 sm:h-36 rounded-xl overflow-hidden cursor-pointer border border-cream-dark/70 shadow-2xs hover:shadow-md transition-all duration-300"
                          >
                            <img
                              src={photo.src}
                              alt={photo.title}
                              className="w-full h-full object-cover object-top group-hover/item:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex items-end p-2">
                              <span className="text-white text-[9px] font-medium leading-tight">{photo.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Health & Community Wellness 2 Photos Strip */}
                  {isHealthCommunity && (
                    <div className="mt-1 pt-3 border-t border-cream-dark/50 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold text-gold-dark tracking-wider">Health & Community Wellness Drive Photos</span>
                        <span className="text-[10px] text-charcoal-light">Click any photo to view full size</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {healthCommunityPhotos.map((photo, pIdx) => (
                          <div
                            key={pIdx}
                            onClick={() => setSelectedAnimalPhoto(photo)}
                            className="group/item relative h-36 sm:h-44 rounded-xl overflow-hidden cursor-pointer border border-cream-dark/70 shadow-2xs hover:shadow-md transition-all duration-300"
                          >
                            <img
                              src={photo.src}
                              alt={photo.title}
                              className="w-full h-full object-cover object-top group-hover/item:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-dark/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex items-end p-2.5">
                              <span className="text-white text-[10px] font-medium leading-tight">{photo.title}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 4: WHAT YOUR PARTNERSHIP CREATES */}
        <section className="bg-charcoal text-white rounded-[32px] p-8 md:p-14 border border-charcoal/20 shadow-2xl relative overflow-hidden flex flex-col gap-10">
          <div className="absolute inset-0 z-0 opacity-5 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${waterfallBg})` }} />
          
          <div className="max-w-2xl text-center mx-auto flex flex-col gap-2 relative z-10">
            <span className="font-cormorant text-sm text-gold-light font-bold tracking-wider uppercase">Direct Outcomes</span>
            <h2 className="font-serif text-2xl md:text-4xl font-bold text-white">What Your Partnership Creates</h2>
            <div className="w-12 h-[1px] bg-gold/30 mx-auto mt-1" />
            <p className="text-xs sm:text-sm text-cream-dark leading-relaxed font-sans mt-2">
              Your CSR contribution will not simply fund a project—it transforms into real, life-changing touchpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10 text-left">
            {whatPartnershipCreates.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <Heart className="w-5 h-5 text-gold-light shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-cream-light leading-relaxed">{item}</span>
              </div>
            ))}
          </div>

          <div className="relative z-10 bg-gold/10 border border-gold/30 rounded-2xl p-6 text-center max-w-2xl mx-auto">
            <p className="font-cormorant text-base sm:text-lg italic text-gold-light">
              "Behind every statistic is a person, and behind every contribution is a story waiting to be changed."
            </p>
          </div>
        </section>

        {/* SECTION 5: WHAT WE OFFER OUR CSR PARTNERS */}
        <section className="flex flex-col gap-8 text-center">
          <div className="flex flex-col gap-2">
            <span className="font-cormorant text-sm text-gold-dark font-bold tracking-wider uppercase">Value & Accountability</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-dark">What We Offer Our CSR Partners</h2>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whatWeOffer.map((item, index) => (
              <div 
                key={index}
                className="bg-white/80 p-6 rounded-2xl border border-cream-dark/70 shadow-xs flex flex-col text-left gap-2.5 group hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="flex gap-2.5 items-center">
                  <span className="bg-gold/15 p-2 rounded-xl inline-flex text-gold-dark group-hover:scale-105 transition-transform shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </span>
                  <h4 className="font-serif text-sm font-bold text-charcoal-dark">{item.title}</h4>
                </div>
                <p className="text-xs text-charcoal-light leading-relaxed font-light ml-9">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: CORE PHILOSOPHY & CLOSING CREED */}
        <section className="glass rounded-[28px] p-8 md:p-14 border border-cream-dark/65 text-center flex flex-col items-center gap-6">
          <div className="max-w-2xl flex flex-col gap-4">
            <span className="text-xs uppercase font-bold tracking-widest text-gold-dark font-sans">
              Ascension Seva Philosophy
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-dark leading-snug">
              "The greatest form of worship is service to humanity."
            </h3>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto" />
            <p className="font-cormorant text-base sm:text-lg text-charcoal-light italic leading-relaxed mt-2">
              "When we feed a hungry person, educate a child, empower a woman, or care for our environment, we are not simply helping communities—we are investing in humanity's future."
            </p>
          </div>
        </section>

        {/* SECTION 7: FINAL CTA & CONTACT FORM */}
        <section id="partner-form" className="glass rounded-[32px] p-8 md:p-14 border border-cream-dark/70 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-6 text-left">
            <span className="font-cormorant text-sm text-gold-dark font-bold tracking-wider uppercase">Join Hands</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-dark leading-tight">Let's Create Lasting Impact Together</h2>
            <div className="w-12 h-[1px] bg-gold/50 mt-1" />
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed font-sans">
              When organizations and communities come together with a shared purpose, impact multiplies and lives change. We would be honored to explore opportunities for collaboration with your esteemed organization.
            </p>

            <div className="flex flex-col gap-4 mt-2 text-xs text-charcoal-light font-sans bg-cream/40 p-5 rounded-2xl border border-cream-dark/60">
              <div className="flex flex-col">
                <span className="font-bold text-charcoal-dark text-sm">Sonali Bhasin Kumar</span>
                <span className="text-[11px] text-sage font-medium">Founder, Ascension Seva Foundation</span>
              </div>
              
              <div className="flex items-center gap-3 pt-2 border-t border-cream-dark/40">
                <span className="bg-gold/15 p-2 rounded-xl text-gold-dark shrink-0">
                  <Phone className="w-4 h-4" />
                </span>
                <a href="tel:+918929061557" className="hover:text-gold transition-colors font-semibold text-charcoal-dark">+91 89290 61557</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-gold/15 p-2 rounded-xl text-gold-dark shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <a href="mailto:ascensionseva@gmail.com" className="hover:text-gold transition-colors font-semibold text-charcoal-dark">ascensionseva@gmail.com</a>
              </div>
            </div>
          </div>

          <div className="bg-white/90 p-6 rounded-[22px] border border-cream-dark/60 shadow-sm w-full">
            {success ? (
              <div className="flex flex-col items-center justify-center text-center gap-4 py-12">
                <CheckCircle className="w-12 h-12 text-gold animate-pulse" />
                <h4 className="font-serif text-lg font-bold text-charcoal-dark">Inquiry Submitted!</h4>
                <p className="text-xs text-charcoal-light leading-relaxed">
                  Thank you for reaching out, {name}. Our partnerships team will review your organization's CSR inquiry and get in touch with you shortly.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-gold hover:bg-gold-dark text-charcoal-dark font-bold text-xs uppercase tracking-wider py-2.5 px-8 rounded-xl mt-4"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-sans text-xs text-charcoal text-left">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-cream-light/60 border border-cream-dark rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Corporate Email</label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-cream-light/60 border border-cream-dark rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Corporate Contact</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-cream-light/60 border border-cream-dark rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter company / organization name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-cream-light/60 border border-cream-dark rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">CSR Goals & Focus Areas</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your organization's CSR focus areas and goals..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-cream-light/60 border border-cream-dark rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold hover:bg-gold-dark text-charcoal-dark font-bold py-3 rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 uppercase tracking-wider mt-2 disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Send CSR Inquiry'}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Lightbox Modal */}
        {selectedAnimalPhoto && (
          <div
            onClick={() => setSelectedAnimalPhoto(null)}
            className="fixed inset-0 z-50 bg-charcoal-dark/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl overflow-hidden max-w-xl w-full shadow-2xl border border-cream-dark flex flex-col animate-scale-up"
            >
              <div className="max-h-[65vh] bg-charcoal-dark/95 overflow-hidden flex items-center justify-center p-2">
                <img
                  src={selectedAnimalPhoto.src}
                  alt={selectedAnimalPhoto.title}
                  className="max-h-[60vh] w-auto max-w-full object-contain rounded-xl"
                />
              </div>
              <div className="p-5 flex flex-col gap-1.5 text-left bg-white">
                <span className="text-[10px] uppercase tracking-widest text-gold-dark font-bold">
                  {selectedAnimalPhoto.title.includes("Strategic") || selectedAnimalPhoto.title.includes("Learning") || selectedAnimalPhoto.title.includes("Literacy") || selectedAnimalPhoto.title.includes("Mentorship") || selectedAnimalPhoto.title.includes("Classroom") || selectedAnimalPhoto.title.includes("Study") || selectedAnimalPhoto.title.includes("Reading")
                    ? "CSR Shiksha Kendra • Child Education & Mentorship"
                    : selectedAnimalPhoto.title.includes("Prasad") || selectedAnimalPhoto.title.includes("Mahabhoj") || selectedAnimalPhoto.title.includes("Kitchen") || selectedAnimalPhoto.title.includes("Feast")
                    ? "CSR Mahabhoj • Annadan & Hunger Relief"
                    : selectedAnimalPhoto.title.includes("Hygiene") || selectedAnimalPhoto.title.includes("Napkin") || selectedAnimalPhoto.title.includes("Dignity")
                    ? "CSR Women's Dignity & Hygiene Initiative"
                    : selectedAnimalPhoto.title.includes("Nutrition") || selectedAnimalPhoto.title.includes("Medical") || selectedAnimalPhoto.title.includes("Patient") || selectedAnimalPhoto.title.includes("Healthcare")
                    ? "CSR Health & Community Wellness Initiative"
                    : "CSR Animal Welfare & Compassion Initiative"}
                </span>
                <h4 className="font-serif font-bold text-base text-charcoal-dark">{selectedAnimalPhoto.title}</h4>
                <p className="text-xs text-charcoal-light leading-relaxed">{selectedAnimalPhoto.caption}</p>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => setSelectedAnimalPhoto(null)}
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

export default CSR;
