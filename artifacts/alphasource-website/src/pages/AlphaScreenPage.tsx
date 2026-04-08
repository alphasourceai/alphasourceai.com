import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Zap, Brain, Users, Clock, Target, BarChart3, MessageSquare, Star } from "lucide-react";

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
    <section className="relative min-h-[75vh] flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 gradient-hero-bg" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(163,128,246,0.2) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#A380F6]/30 text-sm font-medium text-[#A380F6] mb-6 shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#02D99D] animate-pulse" />
            AlphaScreen — AI Screening
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl lg:text-6xl xl:text-7xl font-black text-[#0A1547] leading-[1.05] tracking-tight mb-6"
          >
            Screen Smarter.
            <br />
            <span className="text-gradient-lilac">Hire Faster.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-[#0A1547]/60 leading-relaxed mb-8 max-w-2xl"
          >
            AlphaScreen is your AI-powered talent screening agent. It conducts structured, conversational assessments of every applicant — at the speed of AI, with the nuance of your best interviewer. Ranked results, clear reasoning, zero manual review work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white rounded-xl transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
              style={{ backgroundColor: "#A380F6" }}
              data-testid="alphascreen-hero-cta"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-[#0A1547] bg-white border border-[#0A1547]/10 rounded-xl transition-all hover:border-[#A380F6] hover:text-[#A380F6] hover:shadow-md active:scale-95"
              data-testid="alphascreen-how-it-works"
            >
              See How It Works
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const stats = [
    { value: "10x", label: "Faster than manual screening" },
    { value: "85%", label: "Reduction in time-to-screen" },
    { value: "3x", label: "Improvement in hire quality" },
    { value: "100%", label: "Consistency in evaluation" },
  ];

  return (
    <section className="py-12 bg-[#0A1547]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
              data-testid={`stat-${i}`}
            >
              <div className="text-4xl font-black text-[#A380F6] mb-1">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Conversational AI Screening",
      description:
        "AlphaScreen conducts tailored, role-specific interviews with each candidate. It adapts questions based on responses, probing deeper where needed — just like your best interviewer would.",
      color: "#A380F6",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Ranked Candidate Summaries",
      description:
        "Every candidate gets a structured scorecard with ratings, reasoning, and highlights. Your team sees a ranked list, ready for next-step decisions — no raw notes, no guesswork.",
      color: "#02ABE0",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Role-Specific Configuration",
      description:
        "Define the criteria that matter for each role. AlphaScreen evaluates candidates against your exact requirements — technical skills, communication, culture fit, and beyond.",
      color: "#02D99D",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Instant, 24/7 Availability",
      description:
        "Candidates can screen at any time, from anywhere. No scheduling bottlenecks, no timezone friction. Applicants complete screening in minutes on their own time.",
      color: "#A380F6",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Candidate-First Experience",
      description:
        "A respectful, engaging screening experience that reflects well on your employer brand. Clear communication, reasonable questions, and instant confirmation — candidates appreciate the clarity.",
      color: "#02ABE0",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Bias-Aware Evaluation Framework",
      description:
        "Structured criteria applied consistently to every candidate. AlphaScreen helps your team evaluate on merit, reducing the impact of unconscious bias in early-stage screening.",
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
            Features
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0A1547] leading-tight">
            Everything Your Screening Process Needs
          </h2>
          <p className="text-lg text-[#0A1547]/60 mt-4 max-w-2xl mx-auto">
            AlphaScreen brings together AI precision and human-centered design to revolutionize how you evaluate talent.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              variants={fadeUp}
              className="group bg-[#F8F9FD] hover:bg-white hover:shadow-lg rounded-2xl p-6 border border-transparent hover:border-gray-100 transition-all duration-300"
              data-testid={`feature-card-${i}`}
            >
              <div
                className="inline-flex w-12 h-12 rounded-xl items-center justify-center text-white mb-5 transition-transform group-hover:scale-110 duration-200"
                style={{ backgroundColor: feature.color }}
              >
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-[#0A1547] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#0A1547]/60 leading-relaxed">{feature.description}</p>
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
      title: "Define Your Criteria",
      description:
        "Work with our team to configure AlphaScreen for your specific role — required skills, experience levels, cultural values, and any role-specific competencies.",
      icon: <Target className="w-5 h-5" />,
      color: "#A380F6",
    },
    {
      number: "02",
      title: "Candidates Self-Screen",
      description:
        "Applicants receive a branded link and complete the AI-powered screening conversation at their convenience — on mobile or desktop, any time of day.",
      icon: <MessageSquare className="w-5 h-5" />,
      color: "#02ABE0",
    },
    {
      number: "03",
      title: "AI Analyzes and Ranks",
      description:
        "AlphaScreen processes each conversation, evaluates against your criteria, and generates structured summaries with rankings and supporting evidence.",
      icon: <Brain className="w-5 h-5" />,
      color: "#02D99D",
    },
    {
      number: "04",
      title: "Your Team Decides",
      description:
        "Review clear, ranked candidate profiles. Advance, decline, or hold candidates in one click. Focus your energy on the interviews that really matter.",
      icon: <CheckCircle className="w-5 h-5" />,
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A1547]/8 text-sm font-medium text-[#0A1547] mb-5">
            How AlphaScreen Works
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0A1547] leading-tight">
            Screening That Works While You Sleep
          </h2>
          <p className="text-lg text-[#0A1547]/60 mt-4 max-w-2xl mx-auto">
            A simple four-step process that turns a pile of applications into a prioritized, ready-to-interview shortlist.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#A380F6] via-[#02ABE0] to-[#02D99D] opacity-20" />

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              variants={fadeUp}
              className="relative bg-white rounded-2xl p-6 border border-gray-100 text-center"
              data-testid={`how-it-works-step-${step.number}`}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white mx-auto mb-4"
                style={{ backgroundColor: step.color }}
              >
                {step.icon}
              </div>
              <div className="text-3xl font-black mb-3" style={{ color: `${step.color}25` }}>
                {step.number}
              </div>
              <h3 className="text-base font-bold text-[#0A1547] mb-2">{step.title}</h3>
              <p className="text-sm text-[#0A1547]/60 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      quote: "AlphaScreen cut our time-to-screen by 80%. We went from spending two weeks on initial screening to having a ranked shortlist within 48 hours of posting the role.",
      name: "Director of Talent Acquisition",
      company: "Series B Tech Company",
      rating: 5,
    },
    {
      quote: "The quality of candidates making it to first interviews improved dramatically. AlphaScreen surfaces context and nuance that keyword matching completely misses.",
      name: "Head of People",
      company: "Growth-Stage Startup",
      rating: 5,
    },
    {
      quote: "Our candidates love the experience. We get compliments on how clear and respectful the process is — which tells a lot about our employer brand before day one.",
      name: "VP of Human Resources",
      company: "Enterprise SaaS Company",
      rating: 5,
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
          className="text-center mb-14"
        >
          <h2 className="text-4xl font-black text-[#0A1547]">What Teams Are Saying</h2>
          <p className="text-lg text-[#0A1547]/60 mt-3">Results that speak for themselves.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              variants={fadeUp}
              className="bg-[#F8F9FD] rounded-2xl p-7 border border-gray-100"
              data-testid={`testimonial-${i}`}
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-[#A380F6] text-[#A380F6]" />
                ))}
              </div>
              <p className="text-sm text-[#0A1547]/70 leading-relaxed mb-5 italic">"{t.quote}"</p>
              <div>
                <div className="text-sm font-semibold text-[#0A1547]">{t.name}</div>
                <div className="text-xs text-[#0A1547]/50 mt-0.5">{t.company}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ComparisonSection() {
  const rows = [
    { feature: "Screening speed", before: "Days to weeks", after: "Hours" },
    { feature: "Consistency", before: "Varies by recruiter", after: "100% consistent" },
    { feature: "Availability", before: "Business hours only", after: "24/7, any timezone" },
    { feature: "Candidate volume", before: "Limited by capacity", after: "Unlimited" },
    { feature: "Evaluation depth", before: "Surface-level keywords", after: "Conversational nuance" },
    { feature: "Time per candidate", before: "15–30 minutes", after: "~2 minutes review" },
  ];

  return (
    <section className="py-24 bg-[#F8F9FD]">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-black text-[#0A1547]">AlphaScreen vs. Traditional Screening</h2>
          <p className="text-lg text-[#0A1547]/60 mt-3">The numbers don't lie.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
          custom={1}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
          data-testid="comparison-table"
        >
          <div className="grid grid-cols-3 bg-[#0A1547] text-white text-sm font-semibold px-6 py-4">
            <div>Feature</div>
            <div className="text-center">Traditional Screening</div>
            <div className="text-center text-[#A380F6]">AlphaScreen</div>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 px-6 py-4 border-t border-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAFD]"}`}
              data-testid={`comparison-row-${i}`}
            >
              <div className="text-sm font-medium text-[#0A1547]">{row.feature}</div>
              <div className="text-center text-sm text-[#0A1547]/50">{row.before}</div>
              <div className="text-center text-sm font-semibold text-[#02D99D] flex items-center justify-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {row.after}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-24 bg-[#0A1547]">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8" style={{ backgroundColor: "#A380F620" }}>
            <img src="/alpha-symbol.png" alt="Alpha" className="w-10 h-10" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
            Ready to See AlphaScreen in Action?
          </h2>
          <p className="text-lg text-white/60 mb-8">
            Get a personalized demo and see how AlphaScreen transforms your talent pipeline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl transition-all hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: "#A380F6" }}
              data-testid="alphascreen-bottom-cta"
            >
              Request a Demo
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/#agents"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border border-white/20 rounded-xl transition-all hover:border-white/40 hover:bg-white/5"
            >
              Explore All Agents
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function AlphaScreenPage() {
  return (
    <div>
      <HeroSection />
      <StatsBar />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <ComparisonSection />
      <CTASection />
    </div>
  );
}
