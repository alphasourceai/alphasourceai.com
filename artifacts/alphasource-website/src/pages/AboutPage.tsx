import { motion } from "framer-motion";
import { ArrowRight, Heart, Lightbulb, Shield, Zap } from "lucide-react";

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
    <section className="relative pt-28 pb-20 overflow-hidden">
      <div className="absolute inset-0 gradient-hero-bg" />
      <div className="absolute inset-0 gradient-lilac-glow" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#A380F6]/30 text-sm font-medium text-[#A380F6] mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A380F6]" />
            About AlphaSource AI
          </div>
          <h1 className="text-5xl lg:text-6xl font-black text-[#0A1547] leading-[1.05] tracking-tight mb-6">
            We Believe the Best Hires Come from Better Conversations
          </h1>
          <p className="text-xl text-[#0A1547]/60 leading-relaxed">
            AlphaSource AI was founded on a simple belief: talent acquisition deserves better tools. Not just faster tools — smarter ones that amplify human judgment rather than bypass it.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function MissionSection() {
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
              Our Mission
            </div>
            <h2 className="text-4xl font-black text-[#0A1547] leading-tight mb-5">
              Putting the Human Back in Human Resources
            </h2>
            <p className="text-[#0A1547]/60 leading-relaxed mb-5">
              The irony of modern talent acquisition is that the humans tasked with evaluating other humans spend most of their time doing work that isn't human at all — sorting resumes, sending templated emails, scheduling calls, and reviewing the same information over and over.
            </p>
            <p className="text-[#0A1547]/60 leading-relaxed mb-5">
              AlphaSource AI was built to change that. Our agentic AI handles the operational overhead so that talent professionals can spend their time on what only they can do: building relationships, making judgment calls, and creating the kind of candidate experience that builds lasting employer brands.
            </p>
            <p className="text-[#0A1547]/60 leading-relaxed">
              We're not here to replace recruiters. We're here to make them extraordinarily effective.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            custom={1}
            variants={fadeUp}
            className="relative"
          >
            {/* Mission visual */}
            <div className="bg-[#0A1547] rounded-3xl p-10 text-white">
              <div className="mb-8">
                <img src="/alpha-symbol.png" alt="AlphaSource" className="h-14 w-auto mb-4" />
                <div className="text-3xl font-black leading-tight">
                  Agentic AI for
                  <br />
                  <span className="text-[#A380F6]">Human Potential</span>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: "Talent professionals freed from admin", value: "85%" },
                  { label: "Faster candidate evaluation", value: "10x" },
                  { label: "Reduction in screening bias", value: "Significant" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-sm text-white/60">{item.label}</span>
                    <span className="text-sm font-black text-[#02D99D]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Human-First, Always",
      description:
        "Every feature we build starts with a question: does this make talent professionals more effective, or does it diminish their role? AI should amplify human judgment, not replace it. We hold this line firmly.",
      color: "#A380F6",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Insight Over Information",
      description:
        "Recruiters are drowning in data and starving for insight. We don't add to the noise — we translate raw information into clear, reasoned, actionable intelligence that helps teams make better decisions faster.",
      color: "#02ABE0",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Fairness by Design",
      description:
        "Bias in hiring has real consequences for real people. We design our systems with structured, consistent evaluation frameworks that help teams assess on merit — and we continuously audit our tools for fairness.",
      color: "#02D99D",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Speed Without Sacrifice",
      description:
        "Moving faster should not mean cutting corners on quality or candidate experience. AlphaSource AI is built to compress timelines while elevating the quality of every interaction, for teams and candidates alike.",
      color: "#A380F6",
    },
  ];

  return (
    <section className="py-24 bg-[#F8F9FD]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A380F6]/10 text-sm font-medium text-[#A380F6] mb-5">
            Our Values
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0A1547] leading-tight">
            What We Stand For
          </h2>
          <p className="text-lg text-[#0A1547]/60 mt-4 max-w-2xl mx-auto">
            These aren't just words on a wall — they're the principles that shape every product decision we make.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {values.map((val, i) => (
            <motion.div
              key={val.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              variants={fadeUp}
              className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#A380F6]/20 hover:shadow-lg transition-all duration-300"
              data-testid={`value-card-${i}`}
            >
              <div
                className="inline-flex w-12 h-12 rounded-xl items-center justify-center text-white mb-5 transition-transform group-hover:scale-110 duration-200"
                style={{ backgroundColor: val.color }}
              >
                {val.icon}
              </div>
              <h3 className="text-xl font-bold text-[#0A1547] mb-3">{val.title}</h3>
              <p className="text-sm text-[#0A1547]/60 leading-relaxed">{val.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StorySection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A1547]/8 text-sm font-medium text-[#0A1547] mb-5">
            Our Story
          </div>
          <h2 className="text-4xl font-black text-[#0A1547]">Why We Built This</h2>
        </motion.div>

        <div className="space-y-8">
          {[
            {
              text: "AlphaSource AI grew out of a frustration shared by everyone who's worked in or alongside a talent team: too much time spent doing work that doesn't require human judgment, and not enough time spent on work that does.",
            },
            {
              text: "Our founders came from backgrounds in AI research, enterprise software, and talent acquisition. They saw how companies were failing to capture the full value of their recruiters — brilliant, relationship-driven professionals stuck in a cycle of resume review and inbox management.",
            },
            {
              text: "The breakthrough insight was simple: agentic AI — AI that can take autonomous, multi-step action — could handle most of the operational burden of recruiting, freeing humans to focus on the high-judgment work that actually determines whether a hire succeeds.",
            },
            {
              text: "We built AlphaScreen first because screening is the highest-volume, lowest-leverage task in most talent pipelines. It's also where the most good candidates get lost — buried under volume, filtered by keyword matching, or simply never reviewed before a role closes.",
            },
            {
              text: "Today, AlphaSource AI is used by talent teams across industries to screen faster, hire smarter, and deliver better experiences for both candidates and hiring managers. We're just getting started.",
            },
          ].map((para, i) => (
            <motion.p
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i * 0.3}
              variants={fadeUp}
              className="text-lg text-[#0A1547]/70 leading-relaxed"
            >
              {para.text}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  const team = [
    {
      name: "Alex Chen",
      role: "Co-Founder & CEO",
      bio: "Former VP of Engineering at a Series C HR tech startup. Built AI-powered recruitment tools for 6 years before co-founding AlphaSource.",
      initials: "AC",
      color: "#A380F6",
    },
    {
      name: "Jordan Taylor",
      role: "Co-Founder & CPO",
      bio: "Led talent acquisition at two unicorn startups. Experienced firsthand the operational weight holding great recruiters back.",
      initials: "JT",
      color: "#02ABE0",
    },
    {
      name: "Morgan Kim",
      role: "Head of AI Research",
      bio: "PhD in NLP. Previously led conversational AI research at a top-10 technology company. Obsessed with making AI feel genuinely human.",
      initials: "MK",
      color: "#02D99D",
    },
    {
      name: "Casey Rivera",
      role: "Head of Customer Success",
      bio: "10 years in enterprise HR consulting. Ensures every AlphaSource customer achieves measurable impact within their first 30 days.",
      initials: "CR",
      color: "#A380F6",
    },
  ];

  return (
    <section className="py-24 bg-[#F8F9FD]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#A380F6]/10 text-sm font-medium text-[#A380F6] mb-5">
            The Team
          </div>
          <h2 className="text-4xl font-black text-[#0A1547]">Built by People Who've Been There</h2>
          <p className="text-lg text-[#0A1547]/60 mt-4 max-w-2xl mx-auto">
            Our team brings together expertise in AI research, talent acquisition, and enterprise software — all united by the same frustration with the status quo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={i}
              variants={fadeUp}
              className="bg-white rounded-2xl p-6 border border-gray-100 text-center"
              data-testid={`team-member-${i}`}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black mx-auto mb-4"
                style={{ backgroundColor: member.color }}
              >
                {member.initials}
              </div>
              <h3 className="text-base font-bold text-[#0A1547] mb-0.5">{member.name}</h3>
              <div
                className="text-xs font-semibold mb-3"
                style={{ color: member.color }}
              >
                {member.role}
              </div>
              <p className="text-xs text-[#0A1547]/60 leading-relaxed">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function JoinSection() {
  return (
    <section className="py-24 bg-[#0A1547]">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-5">
            Join the Teams Hiring Smarter
          </h2>
          <p className="text-lg text-white/60 mb-8">
            Ready to see what AlphaSource AI can do for your talent operation? We'd love to show you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white rounded-xl transition-all hover:opacity-90 hover:shadow-lg"
              style={{ backgroundColor: "#A380F6" }}
              data-testid="about-cta-demo"
            >
              Request a Demo
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/alphascreen"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-semibold text-white border border-white/20 rounded-xl transition-all hover:border-white/40 hover:bg-white/5"
              data-testid="about-cta-alphascreen"
            >
              Explore AlphaScreen
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div>
      <HeroSection />
      <MissionSection />
      <ValuesSection />
      <StorySection />
      <TeamSection />
      <JoinSection />
    </div>
  );
}
