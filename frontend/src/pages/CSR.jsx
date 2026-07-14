import React, { useState } from 'react';
import { 
  GraduationCap, Apple, Flame, Sparkles, Shield, HeartPulse, Leaf, 
  Calendar, Cat, Users, ArrowRight, CheckCircle, ShieldCheck, Mail, 
  Phone, FileText, ChevronRight, MessageSquare, Award, BarChart
} from 'lucide-react';
import axios from 'axios';
import waterfallBg from '../assets/waterfall_bg.jpg';

const CSR = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
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
      desc: "Educational support, mentorship and learning resources for underprivileged children to build structural autonomy."
    },
    {
      icon: <Apple className="w-6 h-6 text-gold-dark" />,
      title: "Annadan & Jal Seva",
      desc: "Organizing food distribution and water seva drives throughout the year for vulnerable daily wage families."
    },
    {
      icon: <Flame className="w-6 h-6 text-gold-dark" />,
      title: "Mahabhoj Campaign",
      desc: "Serving and feeding more than 5,000 people during the sacred occasion of Mahashivratri Seva."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-gold-dark" />,
      title: "Shravan Shraddha Seva",
      desc: "Meals and community support reaching over 10,000 individuals during the holy month of Shravan."
    },
    {
      icon: <Shield className="w-6 h-6 text-gold-dark" />,
      title: "Women's Dignity & Menstrual Hygiene",
      desc: "Conducting hygiene awareness sessions and distributing sanity napkin kits to women and young girls."
    },
    {
      icon: <HeartPulse className="w-6 h-6 text-gold-dark" />,
      title: "Health & Community Wellness",
      desc: "Rebalancing stress, organizing wellness camps, and carrying out healthcare support drives."
    },
    {
      icon: <Leaf className="w-6 h-6 text-gold-dark" />,
      title: "Environmental Sustainability",
      desc: "Tree plantation drives, local cleanliness initiatives, and promoting green waste reduction models."
    },
    {
      icon: <Calendar className="w-6 h-6 text-gold-dark" />,
      title: "Festival Seva Campaigns",
      desc: "Conducting community service events during spiritually significant periods to share celebrations with all."
    },
    {
      icon: <Cat className="w-6 h-6 text-gold-dark" />,
      title: "Animal Welfare",
      desc: "Organizing food drives, sponsoring veterinary medical aid, and sheltering street animals."
    },
    {
      icon: <Users className="w-6 h-6 text-gold-dark" />,
      title: "Volunteer & Community Engagement",
      desc: "Direct corporate volunteering drives, matching employee hours with active community impact."
    }
  ];

  const whyPartner = [
    { title: "Transparent Fund Utilization", desc: "Clear tracking of every contribution to ensure integrity." },
    { title: "Detailed Impact Reports", desc: "Structured summaries highlighting metrics, pictures, and outcomes." },
    { title: "Campaign-wise Documentation", desc: "Granular photo and media folders for each social project." },
    { title: "Employee Volunteering Opportunities", desc: "Hands-on drives connecting corporate teams to human care." },
    { title: "Branding during CSR campaigns", desc: "Public co-branding and banner displays at all campaign locations." },
    { title: "Customized CSR projects", desc: "Project outlines tailored to match your company's core values." },
    { title: "Long-term measurable impact", desc: "Systematic, structural programs fostering community independence." }
  ];

  const engagementModes = [
    { title: "Employee Volunteering", desc: "Let your staff experience Seva firsthand by joining our drives." },
    { title: "CSR Campaigns", desc: "Fund designated programs under your corporate responsibility initiatives." },
    { title: "Community Outreach", desc: "Directly sponsor local child mentorship and food distribution programs." },
    { title: "Plantation Drives", desc: "Participate in greening local parks and urban communities." },
    { title: "Wellness Initiatives", desc: "Sponsor sound healing and mindfulness sessions for underserved groups." },
    { title: "Awareness Drives", desc: "Sponsor hygiene workshops and primary resource distribution." }
  ];

  return (
    <div className="min-h-screen py-16 px-6 font-sans relative overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col gap-24 relative z-10">

        {/* SECTION 1: HERO */}
        <section className="relative rounded-[32px] overflow-hidden border border-cream-dark/60 shadow-xl bg-white/40 backdrop-blur-xs min-h-[460px] flex items-center p-8 md:p-14">
          <div className="absolute inset-0 z-0 opacity-15 bg-cover bg-center" style={{ backgroundImage: `url(${waterfallBg})` }} />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-transparent z-0" />
          
          <div className="flex flex-col gap-6 text-left relative z-10 max-w-xl">
            <span className="font-cormorant text-sm sm:text-base text-gold-dark font-bold tracking-wider uppercase">
              Corporate Social Responsibility
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide text-charcoal-dark leading-tight">
              Corporate Social Responsibility Partnerships
            </h1>
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed font-sans">
              Together, we can transform compassion into meaningful action and create lasting impact across communities.
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
                <span>Download CSR Proposal</span>
              </a>
            </div>
          </div>
        </section>

        {/* SECTION 2: OUR MISSION */}
        <section className="glass rounded-[28px] p-8 md:p-12 border border-cream-dark/65 text-center flex flex-col gap-8">
          <div className="max-w-3xl mx-auto flex flex-col gap-4">
            <span className="font-cormorant text-sm text-gold-dark font-bold tracking-wider uppercase">Our Mission</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-dark">Social Transformation Through Action</h2>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-1" />
            
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed font-sans mt-3">
              Ascension Seva Foundation works towards creating measurable, long-term social impact through dedicated, on-the-ground campaigns. By aligning corporate resources with structural community initiatives, we foster growth across Delhi's underprivileged circles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mt-4 text-left">
            <div className="bg-cream/30 p-6 rounded-2xl border border-cream-dark/40 flex flex-col justify-center">
              <p className="font-cormorant text-sm sm:text-base text-charcoal-light italic leading-relaxed">
                "Somewhere tonight, a child will sleep hungry. Somewhere, a young girl will miss school because she does not have access to basic menstrual hygiene products. Somewhere, an elderly person will wait for a meal that may never come."
              </p>
            </div>
            <div className="flex flex-col justify-center gap-4">
              <p className="text-xs text-charcoal-light leading-relaxed font-sans">
                For many of us, food, education, dignity, and opportunity are a part of everyday life. For millions, they are still aspirations.
              </p>
              <p className="text-xs text-charcoal-light leading-relaxed font-sans">
                At <strong>Ascension Seva Foundation</strong>, we believe that real change begins when compassion is transformed into action. We believe that businesses have the power not only to build economies but also to build stronger communities, brighter futures, and a more equitable society.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: OUR FLAGSHIP CSR INITIATIVES */}
        <section className="flex flex-col gap-8 text-center">
          <div className="flex flex-col gap-2">
            <span className="font-cormorant text-sm text-gold-dark font-bold tracking-wider uppercase">Where We Serve</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-dark">Our Flagship CSR Initiatives</h2>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initiatives.map((ini, index) => (
              <div 
                key={index}
                className="glass p-6 rounded-[22px] border border-cream-dark/50 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex gap-4 text-left group"
              >
                <div className="bg-cream/80 p-3 rounded-xl border border-cream-dark/60 self-start shrink-0 group-hover:scale-105 transition-transform">
                  {ini.icon}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-charcoal-dark">{ini.title}</h4>
                  <p className="text-[11px] text-charcoal-light leading-relaxed font-light">{ini.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: HOW YOUR CSR CREATES IMPACT */}
        <section className="glass rounded-[28px] p-8 md:p-12 border border-cream-dark/65 text-center flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <span className="font-cormorant text-sm text-gold-dark font-bold tracking-wider uppercase">The Journey of Impact</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-dark">How Your CSR Creates Impact</h2>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-1" />
          </div>

          {/* Desktop horizontal flow */}
          <div className="hidden md:flex items-center justify-between gap-4 px-4 mt-4">
            {[
              { step: "Company Partnership", label: "Corporate onboarding & target setup" },
              { step: "CSR Contribution", label: "Designated fund allocation & tracking" },
              { step: "Community Programs", label: "Deployment of resources on the ground" },
              { step: "Lives Impacted", label: "Direct delivery to beneficiaries" },
              { step: "Transparency Reports", label: "Campaign audits & media releases" }
            ].map((node, index, arr) => (
              <React.Fragment key={index}>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gold text-charcoal-dark flex items-center justify-center font-bold text-xs shadow-sm">
                    {index + 1}
                  </div>
                  <span className="text-[11px] font-bold text-charcoal-dark tracking-wide uppercase mt-1">{node.step}</span>
                  <span className="text-[9px] text-charcoal-light text-center leading-normal max-w-[140px]">{node.label}</span>
                </div>
                {index < arr.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gold/45 shrink-0 self-center mb-8" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile vertical flow */}
          <div className="md:hidden flex flex-col gap-6 text-left px-2">
            {[
              { step: "Company Partnership", label: "Corporate onboarding & target setup" },
              { step: "CSR Contribution", label: "Designated fund allocation & tracking" },
              { step: "Community Programs", label: "Deployment of resources on the ground" },
              { step: "Lives Impacted", label: "Direct delivery to beneficiaries" },
              { step: "Transparency Reports", label: "Campaign audits & media releases" }
            ].map((node, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-gold text-charcoal-dark flex items-center justify-center font-bold text-xs shrink-0">
                  {index + 1}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] font-bold text-charcoal-dark tracking-wide uppercase">{node.step}</span>
                  <span className="text-[10px] text-charcoal-light">{node.label}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: WHY PARTNER WITH ASCENSION */}
        <section className="flex flex-col gap-8 text-center">
          <div className="flex flex-col gap-2">
            <span className="font-cormorant text-sm text-gold-dark font-bold tracking-wider uppercase">Transparency & Value</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-dark">Why Partner With Ascension</h2>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyPartner.map((item, index) => (
              <div 
                key={index}
                className="bg-white/80 p-6 rounded-2xl border border-cream-dark/70 shadow-xs flex flex-col text-left gap-2 group hover:shadow-md transition-shadow"
              >
                <div className="flex gap-2.5 items-center">
                  <span className="bg-gold/10 p-1.5 rounded-full inline-flex text-gold-dark group-hover:scale-105 transition-transform shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </span>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-charcoal-dark">{item.title}</h4>
                </div>
                <p className="text-[10px] sm:text-[11px] text-charcoal-light leading-relaxed font-light ml-8">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 6: OUR IMPACT (COUNTERS) */}
        <section className="bg-charcoal text-white rounded-[32px] p-10 md:p-14 border border-charcoal/20 shadow-2xl relative overflow-hidden flex flex-col items-center gap-8">
          <div className="absolute inset-0 z-0 opacity-5 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${waterfallBg})` }} />
          <div className="max-w-2xl text-center flex flex-col gap-2 relative z-10">
            <span className="font-cormorant text-sm text-gold-light font-bold tracking-wider uppercase">Our Footprint</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white">Our Impact at a Glance</h2>
            <div className="w-12 h-[1px] bg-gold/30 mx-auto mt-1" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full relative z-10 text-center mt-4">
            {[
              { val: "5,000+", label: "People Served During Mahashivratri" },
              { val: "10,000+", label: "Meals Served During Shravan Campaign" },
              { val: "Multiple", label: "Community Campaigns" },
              { val: "Growing", label: "Volunteer Network" }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col gap-1.5 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <span className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-gold-light">{stat.val}</span>
                <span className="text-[10px] sm:text-[11px] text-cream-dark leading-tight">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 7: EMPLOYEE ENGAGEMENT */}
        <section className="flex flex-col gap-8 text-center">
          <div className="flex flex-col gap-2">
            <span className="font-cormorant text-sm text-gold-dark font-bold tracking-wider uppercase">Corporate Participation</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-dark">Employee Engagement Pathways</h2>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {engagementModes.map((mode, index) => (
              <div 
                key={index}
                className="glass p-6 rounded-2xl border border-cream-dark/50 shadow-xs flex flex-col text-left gap-2 group hover:shadow-md transition-shadow"
              >
                <div className="flex gap-2.5 items-center">
                  <span className="bg-gold/10 p-1.5 rounded-full inline-flex text-gold-dark shrink-0">
                    <Award className="w-4 h-4" />
                  </span>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-charcoal-dark">{mode.title}</h4>
                </div>
                <p className="text-[10px] sm:text-[11px] text-charcoal-light leading-relaxed font-light ml-8">{mode.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 8: WHY CSR MATTERS */}
        <section className="glass rounded-[28px] p-8 md:p-12 border border-cream-dark/65 text-center flex flex-col items-center">
          <div className="max-w-2xl flex flex-col gap-4">
            <div className="text-3xl text-gold-dark font-serif h-3 select-none">“</div>
            <p className="font-cormorant text-base sm:text-lg md:text-xl text-charcoal-light leading-relaxed">
              Every meal served, every child educated, every woman empowered and every tree planted creates a ripple effect that extends far beyond a single act of kindness.
            </p>
            <div className="w-8 h-[1px] bg-gold/50 mx-auto mt-2" />
            <span className="text-[10px] uppercase font-bold tracking-wide text-gold-dark mt-1 font-sans">
              Ascension Seva Foundation Philosophy
            </span>
          </div>
        </section>

        {/* SECTION 9: CSR PARTNERSHIP PROCESS */}
        <section className="flex flex-col gap-8 text-center">
          <div className="flex flex-col gap-2">
            <span className="font-cormorant text-sm text-gold-dark font-bold tracking-wider uppercase">Onboarding Framework</span>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-charcoal-dark">CSR Partnership Process</h2>
            <div className="w-12 h-[1px] bg-gold/50 mx-auto mt-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-4 relative text-center">
            {[
              { step: "1. Contact Us", desc: "Submit the CSR form or email inquiry." },
              { step: "2. Discuss Goals", desc: "Define priority initiatives & key target metrics." },
              { step: "3. Design Project", desc: "Structure budget, timeframe, & co-branding plan." },
              { step: "4. Execute Jointly", desc: "Launch on-the-ground campaigns with volunteers." },
              { step: "5. Impact Audit", desc: "Release transparent beneficiary and audit reports." }
            ].map((proc, index) => (
              <div 
                key={index}
                className="bg-white/80 p-5 rounded-2xl border border-cream-dark/60 flex flex-col gap-2 group hover:border-gold-dark/30 transition-colors shadow-xs"
              >
                <span className="text-xs font-bold text-gold-dark tracking-wide uppercase">{proc.step}</span>
                <p className="text-[10px] sm:text-[11px] text-charcoal-light leading-normal font-light">{proc.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 10: FINAL CTA & CONTACT FORM */}
        <section id="partner-form" className="glass rounded-[32px] p-8 md:p-14 border border-cream-dark/70 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-6 text-left">
            <span className="font-cormorant text-sm text-gold-dark font-bold tracking-wider uppercase">Get In Touch</span>
            <h2 className="font-serif text-3xl font-bold text-charcoal-dark leading-tight">Let's Create Lasting Impact Together</h2>
            <div className="w-12 h-[1px] bg-gold/50 mt-1" />
            <p className="text-xs sm:text-sm text-charcoal-light leading-relaxed font-sans">
              Partner with Ascension Seva Foundation to build stronger communities through education, wellness, women empowerment, environmental sustainability, and humanitarian service.
            </p>

            <div className="flex flex-col gap-4 mt-2 text-xs text-charcoal-light font-sans">
              <div className="flex items-center gap-3">
                <span className="bg-gold/15 p-2 rounded-xl text-gold-dark shrink-0">
                  <Phone className="w-4 h-4" />
                </span>
                <a href="tel:+919818577751" className="hover:text-gold transition-colors font-medium">+91 98185 77751</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-gold/15 p-2 rounded-xl text-gold-dark shrink-0">
                  <Mail className="w-4 h-4" />
                </span>
                <a href="mailto:ascension.seva@gmail.com" className="hover:text-gold transition-colors font-medium">ascension.seva@gmail.com</a>
              </div>
            </div>
          </div>

          <div className="bg-white/90 p-6 rounded-[22px] border border-cream-dark/60 shadow-sm w-full">
            {success ? (
              <div className="flex flex-col items-center justify-center text-center gap-4 py-12">
                <CheckCircle className="w-12 h-12 text-gold animate-pulse" />
                <h4 className="font-serif text-lg font-bold text-charcoal-dark">Inquiry Submitted!</h4>
                <p className="text-xs text-charcoal-light leading-relaxed">
                  Thank you for reaching out, {name}. Our partnerships representative will review your company proposal and contact you back on WhatsApp/Email within 24 hours.
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
                    placeholder="Enter your name"
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
                    placeholder="Enter company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="bg-cream-light/60 border border-cream-dark rounded-xl py-3 px-4 focus:outline-none focus:border-gold transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-charcoal-light uppercase tracking-wider text-[10px]">CSR Goals & Query</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your company's CSR focus areas..."
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
                  {submitting ? 'Submitting...' : 'Send Inquiry'}
                </button>
              </form>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};

export default CSR;
