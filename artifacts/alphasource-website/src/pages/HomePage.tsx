import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" },
  }),
};

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 gradient-hero-bg" />
      <div className="absolute inset-0 gradient-lilac-glow" />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(163,128,246,0.15) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial="hidden"
              animate="visible"
              custom={0}
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#A380F6]/30 text-sm font-medium text-[#A380F6] mb-6 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#02D99D] animate-pulse" />
              AI-Powered Talent Solutions
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="text-5xl lg:text-6xl xl:text-7xl font-black text-[#0A1547] leading-[1.05] tracking-tight mb-3"
            >
              Unleash Your
              <br />
              Talent
            </motion.h1>

            <motion.h2
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="text-2xl lg:text-3xl font-bold mb-5"
              style={{ color: "#A380F6" }}
            >
              Amplify What Matters
            </motion.h2>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="text-lg text-[#0A1547]/60 leading-relaxed mb-3 max-w-lg"
            >
              AI-powered solutions that amplify human talent.
            </motion.p>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={3.5}
              variants={fadeUp}
              className="text-base text-[#0A1547]/50 leading-relaxed mb-8 max-w-lg"
            >
              We don't replace judgment. We enhance it. Give your team hours back to focus on what matters most.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={4}
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white rounded-xl transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
                style={{ backgroundColor: "#A380F6" }}
                data-testid="hero-cta-primary"
              >
                Get in Touch
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/alphascreen"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-[#0A1547] bg-white border border-[#0A1547]/10 rounded-xl transition-all hover:border-[#A380F6] hover:text-[#A380F6] hover:shadow-md active:scale-95"
                data-testid="hero-cta-secondary"
              >
                Explore alphaScreen
              </a>
            </motion.div>
          </div>

          {/* Right — UI Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 30, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div
              className="relative bg-white rounded-2xl shadow-2xl overflow-hidden"
              style={{ boxShadow: "0 0 0 1.5px rgba(2,171,224,0.3), 0 24px 64px rgba(10,21,71,0.15)" }}
            >
              {/* Panel header */}
              <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3">
                <img src="/alpha-symbol.png" alt="Alpha" className="h-8 w-8" />
                <div>
                  <div className="text-sm font-semibold text-[#0A1547]">alphaScreen</div>
                  <div className="text-xs text-gray-400">AI Interview Agent</div>
                </div>
              </div>

              {/* Panel body */}
              <div className="p-5 space-y-3">
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-[#0A1547] text-center border border-gray-100">
                  Candidate Interview in Progress
                </div>

                {[
                  {
                    icon: "🎙",
                    title: "AI Avatar Interview",
                    sub: "Consistent. Unbiased. Thorough.",
                    color: "#A380F6",
                  },
                  {
                    icon: "📊",
                    title: "Resume + Interview Analysis",
                    sub: "Complete candidate picture",
                    color: "#02D99D",
                  },
                  {
                    icon: "👁",
                    title: "Non-verbal cue detection",
                    sub: "Deeper insight, faster decisions",
                    color: "#02ABE0",
                  },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                    className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-[#A380F6]/30 transition-colors"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#0A1547]">{item.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.sub}</div>
                    </div>
                    <div
                      className="text-xs font-medium px-2 py-1 rounded-lg"
                      style={{ backgroundColor: `${item.color}18`, color: item.color }}
                    >
                      Live
                    </div>
                  </motion.div>
                ))}

                <div className="flex justify-end">
                  <div
                    className="text-sm font-semibold px-4 py-2 rounded-lg text-white"
                    style={{ backgroundColor: "#02D99D" }}
                  >
                    Analyzing &rsaquo;
                  </div>
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 border border-gray-100"
            >
              <div className="w-2 h-2 rounded-full bg-[#02D99D] animate-pulse" />
              <span className="text-xs font-semibold text-[#0A1547]">Interview Active</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-100"
            >
              <div className="text-xs font-semibold text-[#0A1547]">Anytime. Anywhere.</div>
              <div className="text-[10px] text-gray-400 mt-0.5">Candidates interview on their schedule</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PeopleDrivenSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A380F6]/10 text-sm font-medium text-[#A380F6] mb-5">
              People-Driven
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#0A1547] leading-tight mb-6">
              Obsessed with People. Powered by AI.
            </h2>
            <p className="text-lg text-[#0A1547]/70 leading-relaxed mb-4">
              We're obsessed with people. Their grit, their gifts, what they're capable of when nobody's wasting their time.
            </p>
            <p className="text-base text-[#0A1547]/60 leading-relaxed mb-4">
              AI takes on the repetitive work so recruiters, coaches, and leaders can do what actually matters. Find the right fit. Develop raw talent. Give overlooked candidates a real shot.
            </p>
            <p className="text-base font-semibold text-[#0A1547] leading-relaxed">
              Fair shots and lasting impact aren't features. They're the point.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            variants={fadeUp}
          >
            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  icon: "🎯",
                  title: "Find the Right Fit",
                  description: "Surface candidates who align with your role and culture — not just keywords on a page.",
                  color: "#A380F6",
                },
                {
                  icon: "🌱",
                  title: "Develop Raw Talent",
                  description: "Give overlooked candidates the chance to show what they're truly capable of.",
                  color: "#02D99D",
                },
                {
                  icon: "⏱",
                  title: "Reclaim Your Time",
                  description: "AI handles the screening grind so your team can focus on relationships and decisions.",
                  color: "#02ABE0",
                },
                {
                  icon: "⚖️",
                  title: "Fair for Everyone",
                  description: "Every candidate gets the same interview. Consistent, unbiased, and respectful.",
                  color: "#A380F6",
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-[#F8F9FD] rounded-2xl p-5 border border-gray-100"
                  data-testid={`pillar-card-${i}`}
                >
                  <div className="text-2xl mb-3">{card.icon}</div>
                  <h3 className="text-sm font-bold text-[#0A1547] mb-1.5">{card.title}</h3>
                  <p className="text-xs text-[#0A1547]/60 leading-relaxed">{card.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AlphaScreenFeatureSection() {
  return (
    <section id="agents" className="py-24 bg-[#F8F9FD]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            variants={fadeUp}
            className="order-2 lg:order-1"
          >
            {/* alphaScreen card */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#A380F620" }}>
                  <img src="/alpha-symbol.png" alt="alpha" className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-base font-bold text-[#0A1547]">alphaScreen</div>
                  <div className="text-xs text-gray-400">AI Interview Agent</div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "AI Avatar Interviews",
                    detail: "Structured, consistent conversations with every applicant",
                    color: "#A380F6",
                  },
                  {
                    label: "Resume + Interview Analysis",
                    detail: "Deep evaluation of experience and fit",
                    color: "#02ABE0",
                  },
                  {
                    label: "Non-verbal Cue Detection",
                    detail: "A complete, unbiased read on every candidate",
                    color: "#02D99D",
                  },
                  {
                    label: "Flexible Scheduling",
                    detail: "Candidates interview anytime, day or night",
                    color: "#A380F6",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="text-sm font-semibold text-[#0A1547]">{item.label}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/alphascreen"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
                style={{ color: "#A380F6" }}
                data-testid="alphascreen-feature-link"
              >
                Learn about alphaScreen <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A380F6]/10 text-sm font-medium text-[#A380F6] mb-5">
              Our Product
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#0A1547] leading-tight mb-5">
              Meet alphaScreen
            </h2>
            <p className="text-lg text-[#0A1547]/60 leading-relaxed mb-5">
              A subscription-based AI interview agent that lets you create job roles and conduct automated screening interviews with AI avatars.
            </p>
            <p className="text-base text-[#0A1547]/60 leading-relaxed mb-5">
              Providing a clearer picture of more candidates — freeing up your time to focus on what you do best.
            </p>
            <p className="text-base text-[#0A1547]/70 leading-relaxed mb-8">
              Less time screening. More time on the people who matter.
            </p>
            <a
              href="/alphascreen"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white rounded-xl transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
              style={{ backgroundColor: "#A380F6" }}
              data-testid="alphascreen-section-cta"
            >
              See alphaScreen
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Create Your Role",
      description: "Set up the job role in alphaScreen — configure criteria so the AI knows exactly what to look for.",
      color: "#A380F6",
    },
    {
      number: "02",
      title: "Candidates Self-Interview",
      description: "Applicants complete an AI avatar interview on their own schedule, day or night, from any device.",
      color: "#02ABE0",
    },
    {
      number: "03",
      title: "AI Evaluates Comprehensively",
      description: "alphaScreen analyzes resumes, interview content, and non-verbal cues to give you a complete picture of every applicant.",
      color: "#02D99D",
    },
    {
      number: "04",
      title: "You Focus on People",
      description: "Review clear candidate summaries and spend your energy on the conversations that actually lead to great hires.",
      color: "#A380F6",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A1547]/8 text-sm font-medium text-[#0A1547] mb-5">
            How It Works
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0A1547] leading-tight">
            From Application to Insight,
            <br />
            <span style={{ color: "#A380F6" }}>Without the Grind</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              variants={fadeUp}
              className="relative bg-[#F8F9FD] rounded-2xl p-6 border border-gray-100"
              data-testid={`step-card-${step.number}`}
            >
              <div className="text-4xl font-black mb-4 leading-none" style={{ color: `${step.color}30` }}>
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-[#0A1547] mb-2">{step.title}</h3>
              <p className="text-sm text-[#0A1547]/60 leading-relaxed">{step.description}</p>
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-50"
                style={{ backgroundColor: step.color }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutSnippetSection() {
  return (
    <section className="py-24 bg-[#0A1547]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm font-medium text-white mb-5">
              About Us
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6">
              Born from a Shared Frustration with Wasted Time
            </h2>
            <p className="text-white/70 leading-relaxed mb-4">
              Founded by hands-on leaders with decades in dental operations, alphaSource was born from a shared frustration with wasted time.
            </p>
            <p className="text-white/70 leading-relaxed mb-4">
              We build AI tools and deliver consulting that give leaders their hours back. Spot talent. Develop people. Sharpen strategy.
            </p>
            <p className="text-white font-semibold leading-relaxed mb-8">
              Create lasting impact. We're here to make work feel human again.
            </p>
            <a
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-semibold"
              style={{ color: "#A380F6" }}
              data-testid="about-snippet-link"
            >
              Meet the team <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            variants={fadeUp}
          >
            {/* Testimonial */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex gap-0.5 mb-5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4" viewBox="0 0 20 20" fill="#A380F6">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <blockquote className="text-xl text-white font-medium leading-relaxed mb-6 italic">
                "alphaSource cut our screening time in half and uncovered candidates we'd have missed — people with real spark. They overdeliver every time."
              </blockquote>
              <div className="border-t border-white/10 pt-5">
                <div className="text-sm font-semibold text-white/80">alphaSource Client</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-[#F8F9FD]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A380F6]/10 text-sm font-medium text-[#A380F6] mb-5">
              Get in Touch
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#0A1547] leading-tight mb-5">
              Want to See It in Action?
            </h2>
            <p className="text-lg text-[#0A1547]/60 leading-relaxed mb-8">
              Drop your details and we'll be in touch to schedule a personalized demo.
            </p>

            <div className="space-y-3">
              {[
                "Personalized demo at your convenience",
                "See alphaScreen evaluate real candidates",
                "No commitment required",
                "Backed by real-world experience",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[#02D99D] flex-shrink-0" />
                  <span className="text-[#0A1547]/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            variants={fadeUp}
            className="bg-white rounded-2xl p-8 border border-gray-100 shadow-md"
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-[#02D99D]/15 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-[#02D99D]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1547] mb-2">Thanks! We'll be in touch.</h3>
                <p className="text-[#0A1547]/60 text-sm">
                  Our team will reach out to schedule a demo with you.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-[#0A1547] mb-6">Request a Demo</h3>
                <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-[#0A1547] mb-1.5">First Name</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Jane"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0A1547] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/40 focus:border-[#A380F6] transition-all"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#0A1547] mb-1.5">Last Name</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Smith"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0A1547] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/40 focus:border-[#A380F6] transition-all"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0A1547] mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0A1547] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/40 focus:border-[#A380F6] transition-all"
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0A1547] mb-1.5">Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0A1547] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/40 focus:border-[#A380F6] transition-all"
                      data-testid="input-phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0A1547] mb-1.5">How can we help?</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      placeholder="Let us know how we can help..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0A1547] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/40 focus:border-[#A380F6] transition-all resize-none"
                      data-testid="input-message"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 hover:shadow-md active:scale-[0.99]"
                    style={{ backgroundColor: "#A380F6" }}
                    data-testid="button-submit"
                  >
                    Submit
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <PeopleDrivenSection />
      <AlphaScreenFeatureSection />
      <HowItWorksSection />
      <AboutSnippetSection />
      <CTASection />
    </div>
  );
}
