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
            AI Interview Agent
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl lg:text-6xl xl:text-7xl font-black text-[#0A1547] leading-[1.05] tracking-tight mb-4"
          >
            alphaScreen
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="text-2xl font-semibold mb-5"
            style={{ color: "#A380F6" }}
          >
            Providing a clearer picture of more candidates.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg text-[#0A1547]/60 leading-relaxed mb-4"
          >
            Freeing up your time to focus on what you do best.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-base text-[#0A1547]/50 leading-relaxed mb-8 max-w-2xl"
          >
            A subscription-based AI interview agent that lets you create job roles and conduct automated screening interviews with AI avatars. The platform leverages advanced AI to comprehensively evaluate candidates — with flexible scheduling so candidates can interview anytime, day or night.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a
              href="#request-demo"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white rounded-xl transition-all hover:opacity-90 hover:shadow-lg active:scale-95"
              style={{ backgroundColor: "#A380F6" }}
              data-testid="alphascreen-hero-cta"
            >
              Request a Demo
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

function SmartSection() {
  return (
    <section className="py-24 bg-[#0A1547]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-sm font-medium text-white mb-6">
              Smart
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
              Every Candidate Gets the Same Interview
            </h2>
            <p className="text-lg text-white/70 leading-relaxed mb-5">
              Through an AI interviewer that's consistent, thorough, and unbiased every single time.
            </p>
            <p className="text-base text-white/60 leading-relaxed">
              alphaScreen analyzes resumes, interview content, and non-verbal cues to give hiring managers a complete, unbiased read on every applicant.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            variants={fadeUp}
          >
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  icon: "🤖",
                  title: "AI Avatar Interviews",
                  description: "Every candidate gets a structured, professional interview through a consistent AI interviewer — no scheduling required.",
                  color: "#A380F6",
                },
                {
                  icon: "📄",
                  title: "Resume + Interview Analysis",
                  description: "alphaScreen evaluates both the candidate's submitted resume and their interview performance together for a complete picture.",
                  color: "#02D99D",
                },
                {
                  icon: "👁",
                  title: "Non-verbal Cue Detection",
                  description: "Advanced AI reads beyond words to give you the full context of every candidate interaction.",
                  color: "#02ABE0",
                },
              ].map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start gap-4"
                  data-testid={`smart-card-${i}`}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                    style={{ backgroundColor: `${card.color}20` }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{card.title}</h3>
                    <p className="text-xs text-white/60 leading-relaxed">{card.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AboutAlphaScreenSection() {
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
              About alphaScreen
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-[#0A1547] leading-tight mb-5">
              Evaluate Faster.
              <br />
              Hire with Confidence.
            </h2>
            <p className="text-lg text-[#0A1547]/60 leading-relaxed mb-5">
              alphaScreen helps hiring managers evaluate candidates faster and hire with confidence.
            </p>
            <p className="text-xl font-semibold text-[#0A1547] leading-relaxed mb-8">
              Less time screening. More time on the people who matter.
            </p>
            <div className="space-y-3">
              {[
                "Subscription-based — predictable, scalable pricing",
                "Create and configure roles to match your exact needs",
                "Candidates interview on their own schedule, 24/7",
                "Consistent evaluation across every single applicant",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-[#02D99D] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#0A1547]/70">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            variants={fadeUp}
          >
            {/* Visual card */}
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 0 0 1.5px rgba(163,128,246,0.2), 0 24px 64px rgba(10,21,71,0.1)" }}
            >
              <div className="bg-[#0A1547] px-6 py-5 flex items-center gap-3">
                <img src="/alpha-symbol.png" alt="Alpha" className="h-8 w-8" />
                <div>
                  <div className="text-sm font-bold text-white">alphaScreen</div>
                  <div className="text-xs text-white/50">Candidate Evaluation Report</div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <div className="text-xs text-[#0A1547]/40 mb-1 font-medium uppercase tracking-wider">Candidate</div>
                  <div className="text-base font-bold text-[#0A1547]">Sarah K.</div>
                </div>
                {[
                  { label: "Resume Match", score: 92, color: "#A380F6" },
                  { label: "Interview Performance", score: 87, color: "#02D99D" },
                  { label: "Communication", score: 94, color: "#02ABE0" },
                  { label: "Overall Fit", score: 90, color: "#A380F6" },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-medium text-[#0A1547]/70">{metric.label}</span>
                      <span className="text-xs font-bold" style={{ color: metric.color }}>{metric.score}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${metric.score}%`, backgroundColor: metric.color }}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#0A1547]/50">Recommendation</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#02D99D20", color: "#02D99D" }}>
                      Advance to Interview
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
      description: "Set up the job role in alphaScreen with your specific criteria — skills, experience level, and what good looks like for your team.",
      color: "#A380F6",
    },
    {
      number: "02",
      title: "Invite Candidates",
      description: "Applicants receive a link to complete their AI avatar interview on their own schedule — day or night, from any device.",
      color: "#02ABE0",
    },
    {
      number: "03",
      title: "AI Evaluates Comprehensively",
      description: "alphaScreen analyzes resumes, interview responses, and non-verbal cues to build a complete, unbiased picture of every candidate.",
      color: "#02D99D",
    },
    {
      number: "04",
      title: "Review and Decide",
      description: "Access clear candidate summaries and spend your time on the conversations that actually move people forward.",
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
            How It Works
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0A1547] leading-tight">
            Simple to Set Up.
            <br />
            <span style={{ color: "#A380F6" }}>Powerful in Practice.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
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
              <div className="text-4xl font-black mb-3 leading-none" style={{ color: `${step.color}25` }}>
                {step.number}
              </div>
              <h3 className="text-base font-bold text-[#0A1547] mb-2">{step.title}</h3>
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

function DemoSection() {
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
    <section id="request-demo" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A380F6]/10 text-sm font-medium text-[#A380F6] mb-5">
            Request a Demo
          </div>
          <h2 className="text-4xl font-black text-[#0A1547] mb-3">
            Ready to See What alphaScreen Can Do?
          </h2>
          <p className="text-lg text-[#0A1547]/60">
            Leave your info and we'll get a demo on the calendar.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          custom={1}
          variants={fadeUp}
          className="bg-white rounded-2xl border border-gray-100 shadow-md p-8"
        >
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 rounded-full bg-[#02D99D]/15 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-7 h-7 text-[#02D99D]" />
              </div>
              <h3 className="text-xl font-bold text-[#0A1547] mb-2">We'll be in touch!</h3>
              <p className="text-[#0A1547]/60 text-sm">
                Our team will reach out to schedule your alphaScreen demo.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="demo-form">
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
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default function AlphaScreenPage() {
  return (
    <div>
      <HeroSection />
      <SmartSection />
      <AboutAlphaScreenSection />
      <HowItWorksSection />
      <DemoSection />
    </div>
  );
}
