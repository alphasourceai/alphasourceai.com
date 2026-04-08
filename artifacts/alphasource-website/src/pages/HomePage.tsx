import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Target, Brain, Clock, Users, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.55, ease: "easeOut" },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero-bg" />
      <div className="absolute inset-0 gradient-lilac-glow" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-30"
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
              Agentic AI for Talent
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              custom={1}
              variants={fadeUp}
              className="text-5xl lg:text-6xl xl:text-7xl font-black text-[#0A1547] leading-[1.05] tracking-tight mb-6"
            >
              Unleash Your Talent
              <br />
              <span className="text-[#0A1547]">with Agentic AI</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              custom={2}
              variants={fadeUp}
              className="text-lg text-[#0A1547]/60 leading-relaxed mb-8 max-w-lg"
            >
              Human judgment enhanced &bull; AI agents that reclaim your time and spot potential at every stage of the talent journey.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={3}
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#agents"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white rounded-xl transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
                style={{ backgroundColor: "#A380F6" }}
                data-testid="hero-cta-primary"
              >
                See AI in Action
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/alphascreen"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-[#0A1547] bg-white border border-[#0A1547]/10 rounded-xl transition-all hover:border-[#A380F6] hover:text-[#A380F6] hover:shadow-md active:scale-95"
                data-testid="hero-cta-secondary"
              >
                Explore AlphaScreen
              </a>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              custom={4}
              variants={fadeUp}
              className="flex items-center gap-6 mt-10 pt-8 border-t border-[#0A1547]/10"
            >
              {[
                { value: "10x", label: "Faster Screening" },
                { value: "85%", label: "Time Saved" },
                { value: "3x", label: "Better Matches" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-black text-[#0A1547]">{stat.value}</div>
                  <div className="text-xs text-[#0A1547]/50 mt-0.5">{stat.label}</div>
                </div>
              ))}
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
              className="relative bg-white rounded-2xl shadow-2xl border border-[#02ABE0]/30 overflow-hidden"
              style={{ boxShadow: "0 0 0 1.5px rgba(2,171,224,0.3), 0 24px 64px rgba(10,21,71,0.15)" }}
            >
              {/* Panel header */}
              <div className="bg-white border-b border-gray-100 px-5 py-4 flex items-center gap-3">
                <img src="/alpha-symbol.png" alt="Alpha" className="h-8 w-8" />
                <div>
                  <div className="text-sm font-semibold text-[#0A1547]">Alpha</div>
                </div>
              </div>

              {/* Panel body */}
              <div className="p-5 space-y-3">
                <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm font-medium text-[#0A1547] text-center border border-gray-100">
                  Alpha AI Agent Panel
                </div>

                {[
                  {
                    icon: "🗂",
                    title: "Task automation",
                    sub: "FA2661 Person+gear",
                    color: "#A380F6",
                  },
                  {
                    icon: "✨",
                    title: "Talent spotting",
                    sub: "Spark Development",
                    color: "#02D99D",
                  },
                  {
                    icon: "📋",
                    title: "Resume analysis",
                    sub: "Deep evaluation",
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
                      Active
                    </div>
                  </motion.div>
                ))}

                <div className="flex justify-end">
                  <button
                    className="text-sm font-semibold px-4 py-2 rounded-lg text-white transition-all hover:opacity-90"
                    style={{ backgroundColor: "#02D99D" }}
                  >
                    Spark &rsaquo;
                  </button>
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
              <span className="text-xs font-semibold text-[#0A1547]">Live Analysis</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-3 py-2 border border-gray-100"
            >
              <div className="text-xs font-semibold text-[#0A1547]">+42 candidates scored</div>
              <div className="text-[10px] text-gray-400 mt-0.5">in the last hour</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const agents = [
  {
    icon: <Target className="w-6 h-6" />,
    title: "AlphaScreen",
    tagline: "Intelligent Candidate Screening",
    description:
      "AI-powered screening that evaluates candidates at superhuman speed without sacrificing the nuance that separates a great hire from a good one. AlphaScreen asks the right questions, listens for what matters, and delivers ranked, reasoned summaries.",
    color: "#A380F6",
    href: "/alphascreen",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Task Automation",
    tagline: "Reclaim Your Calendar",
    description:
      "From scheduling interviews to sending follow-ups, your AI agents handle the operational overhead so your team can focus on relationships and decisions that require real human expertise.",
    color: "#02ABE0",
    href: "#contact",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Talent Intelligence",
    tagline: "Insight at Every Stage",
    description:
      "Continuous analysis of your talent pipeline, surfacing patterns and predictions that help you identify high-potential candidates before your competitors do.",
    color: "#02D99D",
    href: "#contact",
  },
];

function AgentsSection() {
  return (
    <section id="agents" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A380F6]/10 text-sm font-medium text-[#A380F6] mb-5">
            AI Agents
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0A1547] leading-tight">
            Agents Built for Talent Teams
          </h2>
          <p className="text-lg text-[#0A1547]/60 mt-4 max-w-2xl mx-auto">
            Every agent is designed to handle a specific part of your workflow — together they create a seamlessly intelligent talent operation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              variants={fadeUp}
              className="group relative bg-white border border-gray-100 rounded-2xl p-7 hover:border-[#A380F6]/30 hover:shadow-xl transition-all duration-300"
              data-testid={`agent-card-${agent.title.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div
                className="inline-flex w-12 h-12 rounded-xl items-center justify-center text-white mb-5 transition-transform group-hover:scale-110 duration-200"
                style={{ backgroundColor: agent.color }}
              >
                {agent.icon}
              </div>

              <div
                className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-2"
                style={{ backgroundColor: `${agent.color}15`, color: agent.color }}
              >
                {agent.tagline}
              </div>

              <h3 className="text-xl font-bold text-[#0A1547] mb-3">{agent.title}</h3>
              <p className="text-sm text-[#0A1547]/60 leading-relaxed mb-5">{agent.description}</p>

              <a
                href={agent.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                style={{ color: agent.color }}
              >
                Learn more <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Connect Your Workflow",
      description: "Integrate with your existing ATS or HR tools in minutes. AlphaSource works alongside your current process, not against it.",
      color: "#A380F6",
    },
    {
      number: "02",
      title: "Deploy Your AI Agents",
      description: "Configure agents for your specific hiring needs — whether that's screening hundreds of applicants or nurturing a passive talent pool.",
      color: "#02ABE0",
    },
    {
      number: "03",
      title: "Review & Decide",
      description: "Receive clear, ranked summaries with supporting rationale. Make faster, better-informed decisions backed by AI-powered insight.",
      color: "#02D99D",
    },
    {
      number: "04",
      title: "Continuously Improve",
      description: "Every interaction makes the system smarter. AlphaSource learns your organization's patterns to surface better candidates over time.",
      color: "#A380F6",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#F8F9FD]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A1547]/8 text-sm font-medium text-[#0A1547]  mb-5">
            How It Works
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0A1547] leading-tight">
            From Chaos to Clarity in Four Steps
          </h2>
          <p className="text-lg text-[#0A1547]/60 mt-4 max-w-2xl mx-auto">
            AlphaSource AI integrates seamlessly with your hiring workflow — no disruption, just amplification.
          </p>
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
              className="relative bg-white rounded-2xl p-6 border border-gray-100"
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

function ValueSection() {
  const values = [
    {
      icon: <Clock className="w-5 h-5" />,
      title: "10x Faster Screening",
      description: "Screen hundreds of candidates in the time it used to take to review ten. Never miss a great hire because of volume.",
      color: "#A380F6",
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: "Precision Matching",
      description: "AI that understands your specific role requirements and team culture — not just keywords on a resume.",
      color: "#02ABE0",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Human + AI Partnership",
      description: "We amplify your team's expertise, not replace it. Every recommendation comes with clear reasoning for your review.",
      color: "#02D99D",
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Bias-Aware Evaluation",
      description: "Structured, consistent evaluation criteria applied equally to every candidate — helping build fairer, stronger teams.",
      color: "#A380F6",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Instant Time-to-Value",
      description: "Get up and running in hours, not months. No complex implementation or team retraining required.",
      color: "#02ABE0",
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Enterprise Grade Security",
      description: "SOC 2 compliant infrastructure with data isolation and full audit trails for every interaction.",
      color: "#02D99D",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A380F6]/10 text-sm font-medium text-[#A380F6] mb-5">
            Why AlphaSource
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0A1547] leading-tight">
            Built for the Way Talent Teams Actually Work
          </h2>
          <p className="text-lg text-[#0A1547]/60 mt-4 max-w-2xl mx-auto">
            We designed AlphaSource AI around the real challenges of modern talent acquisition — speed, quality, and fairness.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {values.map((val, i) => (
            <motion.div
              key={val.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              variants={fadeUp}
              className="flex gap-4 p-6 rounded-2xl bg-[#F8F9FD] hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all duration-200"
              data-testid={`value-card-${i}`}
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: val.color }}
              >
                {val.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0A1547] mb-1">{val.title}</h3>
                <p className="text-sm text-[#0A1547]/60 leading-relaxed">{val.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "How quickly can we get started with AlphaSource AI?",
      a: "Most teams are up and running within a single business day. We provide guided onboarding, and our system integrates with your existing ATS or workflow without requiring any complex configuration.",
    },
    {
      q: "Does AlphaSource AI replace human recruiters?",
      a: "No — and that's by design. AlphaSource AI is built to amplify your team's capabilities, not replace them. It handles time-consuming operational tasks so your recruiters can focus on relationships, culture fit, and high-judgment decisions.",
    },
    {
      q: "How does AlphaScreen differ from traditional ATS screening?",
      a: "Traditional ATS screening relies on keyword matching — a blunt instrument that misses great candidates and surfaces poor ones. AlphaScreen uses conversational AI to understand context, nuance, and potential, providing ranked summaries with clear reasoning for each candidate.",
    },
    {
      q: "Is candidate data secure and compliant?",
      a: "Absolutely. We maintain SOC 2 compliance with isolated data environments per client. All candidate interactions are encrypted at rest and in transit, with full audit trails and configurable data retention policies.",
    },
    {
      q: "Can AlphaSource AI integrate with our existing HR tech stack?",
      a: "Yes. AlphaSource AI is designed to integrate with major ATS platforms, HRIS systems, and communication tools. We support both native integrations and API-based connections for custom workflows.",
    },
  ];

  return (
    <section className="py-24 bg-[#F8F9FD]">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-[#0A1547]">Frequently Asked Questions</h2>
          <p className="text-lg text-[#0A1547]/60 mt-3">Everything you need to know about AlphaSource AI.</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i * 0.5}
              variants={fadeUp}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              data-testid={`faq-item-${i}`}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
                data-testid={`faq-toggle-${i}`}
              >
                <span className="text-sm font-semibold text-[#0A1547] pr-4">{faq.q}</span>
                {open === i ? (
                  <ChevronUp className="w-4 h-4 text-[#A380F6] flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {open === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm text-[#0A1547]/60 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 bg-[#0A1547]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm font-medium text-white mb-6">
              Get in Touch
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
              Ready to Transform Your Talent Process?
            </h2>
            <p className="text-lg text-white/60 leading-relaxed mb-8">
              Join the forward-thinking teams using AlphaSource AI to hire smarter and faster. Request a personalized demo today.
            </p>

            <div className="space-y-4">
              {[
                "Personalized demo in under 30 minutes",
                "No commitment required",
                "Dedicated onboarding support",
                "See results from day one",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-[#02D99D] flex-shrink-0" />
                  <span className="text-white/80 text-sm">{item}</span>
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
            className="bg-white rounded-2xl p-8"
          >
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-[#02D99D]/15 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-[#02D99D]" />
                </div>
                <h3 className="text-xl font-bold text-[#0A1547] mb-2">You're on the list!</h3>
                <p className="text-[#0A1547]/60 text-sm">
                  We'll reach out within one business day to schedule your demo.
                </p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-[#0A1547] mb-6">Request a Demo</h3>
                <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
                  <div>
                    <label className="block text-sm font-medium text-[#0A1547] mb-1.5">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Smith"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0A1547] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/40 focus:border-[#A380F6] transition-all"
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0A1547] mb-1.5">Work Email</label>
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
                    <label className="block text-sm font-medium text-[#0A1547] mb-1.5">Company</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Corp"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-[#0A1547] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/40 focus:border-[#A380F6] transition-all"
                      data-testid="input-company"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 text-sm font-semibold text-white rounded-xl transition-all hover:opacity-90 hover:shadow-md active:scale-[0.99]"
                    style={{ backgroundColor: "#A380F6" }}
                    data-testid="button-submit"
                  >
                    Request My Demo
                  </button>
                  <p className="text-center text-xs text-gray-400">
                    We respect your privacy. No spam, ever.
                  </p>
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
      <AgentsSection />
      <HowItWorksSection />
      <ValueSection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
