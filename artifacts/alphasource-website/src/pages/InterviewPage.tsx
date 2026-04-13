import { useState, useRef, useEffect } from "react";
import { Upload, FileText, Trash2, RotateCcw } from "lucide-react";

/* ── Checklist verbatim from splash screen ─────────────────────── */
const CHECKLIST = [
  "Current resume in PDF or DOCX format",
  "Stable internet connection",
  "3 uninterrupted minutes to complete the interview",
  "Quiet environment free of background conversations and distractions",
  "The interviewer is not mobile optimized yet; please complete this interview on a computer.",
  "You may complete only one interview per role. Once submitted, the interview cannot be retaken.",
];

type Step = "info" | "otp" | "ready" | "live";

/* ── Bokeh decoration elements ─────────────────────────────────── */
function Bokeh() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <div className="absolute top-[12%] left-[6%] w-40 h-40 rounded-full bg-white/[0.07] blur-3xl" />
      <div className="absolute top-[35%] left-[14%] w-20 h-20 rounded-full bg-white/[0.06] blur-2xl" />
      <div className="absolute top-[8%] right-[8%] w-32 h-32 rounded-full bg-white/[0.06] blur-3xl" />
      <div className="absolute top-[28%] right-[12%] w-12 h-12 rounded-full bg-white/[0.05] blur-xl" />
      <div className="absolute bottom-[20%] left-[5%] w-24 h-24 rounded-full bg-white/[0.04] blur-2xl" />
      <div
        className="absolute top-[48%] right-[7%] w-9 h-9 rounded-full border-2"
        style={{ borderColor: "rgba(163,128,246,0.55)" }}
      />
      <div
        className="absolute top-[22%] left-[38%] text-[#A380F6] font-black select-none"
        style={{ fontSize: "26px", opacity: 0.7 }}
      >
        +
      </div>
    </div>
  );
}

export default function InterviewPage() {
  /* ── Splash state ────────────────────────────────────────────── */
  const [splashDone, setSplashDone] = useState(false);
  const [understood, setUnderstood] = useState(false);

  /* ── Multi-step state ────────────────────────────────────────── */
  const [step, setStep] = useState<Step>("info");

  /* ── Step 1 fields ───────────────────────────────────────────── */
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [email, setEmail]           = useState("");
  const [phone, setPhone]           = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragging, setDragging]     = useState(false);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Step 2 fields ───────────────────────────────────────────── */
  const [otp, setOtp]           = useState("");
  const [otpError, setOtpError] = useState("");

  /* ── Interview container (for fullscreen on mobile) ──────────── */
  const interviewRef   = useRef<HTMLDivElement>(null);
  const [isPortrait, setIsPortrait] = useState(false);

  /* Track orientation when live ─────────────────────────────────── */
  useEffect(() => {
    if (step !== "live") return;
    const check = () => setIsPortrait(window.innerHeight > window.innerWidth);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [step]);

  /* ── Helpers ─────────────────────────────────────────────────── */
  function handleFile(file: File) {
    if (!/\.(pdf|doc|docx)$/i.test(file.name)) return;
    setResumeFile(file);
    setErrors((e) => ({ ...e, resume: "" }));
  }

  function validateStep1() {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Required";
    if (!lastName.trim())  e.lastName  = "Required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "Required";
    if (!phone.trim())     e.phone     = "Required";
    if (!resumeFile)       e.resume    = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validateStep1()) return;
    setStep("otp");
  }

  function handleVerify() {
    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Please enter a valid 6-digit code.");
      return;
    }
    setOtpError("");
    setStep("ready");
  }

  async function handleStartInterview() {
    setStep("live");
    // Attempt fullscreen + landscape lock on mobile
    try {
      const el = interviewRef.current as any;
      const reqFs = el?.requestFullscreen ?? el?.webkitRequestFullscreen ?? el?.mozRequestFullScreen;
      if (reqFs) await reqFs.call(el);
      const orientation = (screen as any).orientation;
      if (orientation?.lock) await orientation.lock("landscape").catch(() => {});
    } catch {
      // Fullscreen/orientation lock not supported — graceful fallback
    }
  }

  const baseInput =
    "w-full px-3 py-2.5 rounded-lg bg-white/10 border border-white/20 text-white text-sm " +
    "placeholder-white/35 focus:outline-none focus:border-[#A380F6] transition-colors";

  const disabledInput = "opacity-50 cursor-not-allowed";

  /* ═══════════════════════════════════════════════════════════════
     SPLASH SCREEN
  ═══════════════════════════════════════════════════════════════ */
  if (!splashDone) {
    return (
      <div
        className="min-h-screen bg-[#0B1554] flex items-center justify-center p-6 sm:p-10"
        style={{ fontFamily: "'Raleway', sans-serif" }}
      >
        <div className="max-w-lg w-full">
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight">
            Before you start your interview
          </h1>

          <p className="text-white/65 text-sm mb-4">
            Please review this quick checklist before you begin:
          </p>

          <ul className="list-disc pl-5 mb-5 space-y-2">
            {CHECKLIST.map((item) => (
              <li key={item} className="text-white/80 text-sm leading-snug">
                {item}
              </li>
            ))}
          </ul>

          <p className="text-white/65 text-sm mb-6 leading-relaxed">
            Background conversations and noise can be picked up during the interview and may
            interfere with your responses.
          </p>

          <label className="flex items-center gap-3 cursor-pointer mb-6 group select-none">
            <input
              type="checkbox"
              checked={understood}
              onChange={(e) => setUnderstood(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer accent-[#A380F6]"
            />
            <span className="text-white/80 text-sm">I understand and I am in a quiet place.</span>
          </label>

          <button
            disabled={!understood}
            onClick={() => setSplashDone(true)}
            className="px-7 py-2.5 rounded-full text-sm font-bold text-white transition-all"
            style={{
              backgroundColor: understood ? "#A380F6" : "rgba(163,128,246,0.30)",
              cursor: understood ? "pointer" : "not-allowed",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     LIVE INTERVIEW — FULLSCREEN
  ═══════════════════════════════════════════════════════════════ */
  if (step === "live") {
    return (
      <div
        ref={interviewRef}
        className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50"
        style={{ fontFamily: "'Raleway', sans-serif" }}
      >
        {/* Portrait warning overlay on mobile */}
        {isPortrait && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-10 p-6 text-center">
            <RotateCcw className="w-10 h-10 text-[#A380F6] mb-4 animate-spin-slow" />
            <p className="text-white font-bold text-lg mb-2">Please rotate your device</p>
            <p className="text-white/60 text-sm">Turn your phone to landscape for the best interview experience.</p>
          </div>
        )}

        {/* Daily.co iframe placeholder */}
        <div className="w-full h-full flex flex-col items-center justify-center text-white/30 text-sm gap-3">
          <div className="w-16 h-16 rounded-full border-2 border-white/15 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-white/15" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-white/40">Daily.co interview room</p>
            <p className="text-xs mt-1 text-white/20">
              Replace this container with your Daily.co &lt;iframe&gt;
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     MAIN INTERVIEW PAGE
  ═══════════════════════════════════════════════════════════════ */
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "#0B1554", fontFamily: "'Raleway', sans-serif" }}
    >
      <Bokeh />

      {/* Logo */}
      <header className="relative z-10 flex items-center gap-2.5 px-6 py-4 flex-shrink-0">
        <img src="/alpha-symbol.png" alt="" className="w-8 h-8 object-contain" />
        <span className="text-white font-black tracking-widest text-sm">ALPHASOURCE</span>
      </header>

      {/* ── Interview window placeholder ─────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center px-4 pb-10 flex-1">
        <div
          className="w-full max-w-2xl bg-black rounded-xl flex items-center justify-center"
          style={{ aspectRatio: "16/9" }}
        >
          <p className="text-white/25 text-sm text-center px-6">
            Your interview room will appear here after verification.
          </p>
        </div>

        {/* ── Form panel ──────────────────────────────────────────── */}
        <div className="w-full max-w-2xl mt-7 space-y-5">

          {/* ── STEP 1 ─────────────────────────────────────────────── */}
          <div>
            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-3">
              Step 1 — Enter your information
            </p>

            {/* Row 1: names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-1">
              <div>
                <input
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setErrors((er) => ({ ...er, firstName: "" })); }}
                  placeholder="First name *"
                  disabled={step !== "info"}
                  className={`${baseInput} ${step !== "info" ? disabledInput : ""}`}
                />
                <p className={`text-[10px] mt-1 font-semibold h-3 ${errors.firstName ? "text-red-400" : "text-white/25"}`}>
                  {errors.firstName || "Required"}
                </p>
              </div>
              <div>
                <input
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setErrors((er) => ({ ...er, lastName: "" })); }}
                  placeholder="Last name *"
                  disabled={step !== "info"}
                  className={`${baseInput} ${step !== "info" ? disabledInput : ""}`}
                />
                <p className={`text-[10px] mt-1 font-semibold h-3 ${errors.lastName ? "text-red-400" : "text-white/25"}`}>
                  {errors.lastName || "Required"}
                </p>
              </div>
            </div>

            {/* Row 2: email + phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-1">
              <div>
                <input
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((er) => ({ ...er, email: "" })); }}
                  placeholder="Email *  e.g. name@example.com"
                  type="email"
                  disabled={step !== "info"}
                  className={`${baseInput} ${step !== "info" ? disabledInput : ""}`}
                />
                <p className={`text-[10px] mt-1 font-semibold h-3 ${errors.email ? "text-red-400" : "text-white/25"}`}>
                  {errors.email || "Required"}
                </p>
              </div>
              <div>
                <input
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors((er) => ({ ...er, phone: "" })); }}
                  placeholder="Phone *  e.g. (555) 123-4567"
                  type="tel"
                  disabled={step !== "info"}
                  className={`${baseInput} ${step !== "info" ? disabledInput : ""}`}
                />
                <p className={`text-[10px] mt-1 font-semibold h-3 ${errors.phone ? "text-red-400" : "text-white/25"}`}>
                  {errors.phone || "Required"}
                </p>
              </div>
            </div>

            {/* Row 3: resume + submit button */}
            <div className="flex items-start gap-3 mt-1">
              <div className="flex-1 min-w-0">
                <div
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border transition-colors text-sm
                    ${step !== "info"
                      ? "opacity-50 cursor-default border-white/15 bg-white/[0.06]"
                      : dragging
                        ? "border-[#A380F6] bg-[#A380F6]/10 cursor-pointer"
                        : "border-white/20 bg-white/10 hover:border-[#A380F6]/50 cursor-pointer"
                    }`}
                  onClick={() => step === "info" && fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); if (step === "info") setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    if (step === "info" && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                  }}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                  />
                  {resumeFile ? (
                    <>
                      <FileText className="w-4 h-4 text-[#A380F6] flex-shrink-0" />
                      <span className="text-white text-xs truncate flex-1">{resumeFile.name}</span>
                      {step === "info" && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                          className="text-white/35 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-white/30 flex-shrink-0" />
                      <span className="text-white/30 text-xs">
                        Drag resume here or click to browse — PDF, DOCX, or DOC
                      </span>
                    </>
                  )}
                </div>
                <p className={`text-[10px] mt-1 font-semibold h-3 ${errors.resume ? "text-red-400" : "text-white/25"}`}>
                  {errors.resume || "Required"}
                </p>
              </div>

              {step === "info" && (
                <button
                  onClick={handleSubmit}
                  className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
                  style={{ backgroundColor: "#A380F6" }}
                >
                  Submit &amp; Get OTP
                </button>
              )}
            </div>

            {/* Accommodation link */}
            <div className="mt-2">
              <a href="#" className="text-[#A380F6]/80 text-xs hover:text-[#A380F6] hover:underline transition-colors">
                Need an accommodation?
              </a>
            </div>
          </div>

          {/* ── STEP 2 ─────────────────────────────────────────────── */}
          {(step === "otp" || step === "ready") && (
            <div className="pt-5 border-t border-white/10">
              <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mb-3">
                Step 2 — Verify &amp; Start
              </p>
              <p className="text-white/45 text-xs mb-4 leading-relaxed">
                A one-time code has been sent to{" "}
                <span className="text-white/75 font-semibold">{email}</span>.
                Enter it below to continue.
              </p>

              <div className="flex items-center gap-3 flex-wrap">
                <input
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                    setOtpError("");
                  }}
                  placeholder="6-digit code"
                  maxLength={6}
                  disabled={step === "ready"}
                  className={`w-40 px-3 py-2.5 rounded-lg bg-white/10 border text-white text-sm text-center
                    tracking-[0.35em] placeholder-white/30 focus:outline-none transition-colors
                    ${step === "ready"
                      ? "border-[#02D99D]/40 opacity-60 cursor-not-allowed"
                      : "border-white/20 focus:border-[#A380F6]"}`}
                />

                {step === "otp" && (
                  <button
                    onClick={handleVerify}
                    className="px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
                    style={{ backgroundColor: "#A380F6" }}
                  >
                    Verify
                  </button>
                )}

                {step === "ready" && (
                  <button
                    onClick={handleStartInterview}
                    className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.97] flex items-center gap-2"
                    style={{ backgroundColor: "#02D99D" }}
                  >
                    <span
                      className="inline-block w-2 h-2 rounded-full bg-white animate-pulse flex-shrink-0"
                    />
                    Start Interview
                  </button>
                )}
              </div>

              {otpError && (
                <p className="text-red-400 text-[10px] mt-2 font-semibold">{otpError}</p>
              )}

              {step === "ready" && (
                <p className="text-[#02D99D]/70 text-xs mt-2 font-semibold">
                  ✓ Verified — click Start Interview when you are ready.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
