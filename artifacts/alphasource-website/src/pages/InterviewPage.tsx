import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Upload, FileText, Trash2, Check, ArrowRight, ChevronRight } from "lucide-react";

/* ── Checklist copy (verbatim) ───────────────────────────────────── */
const CHECKLIST = [
  "Current resume in PDF, DOC, or DOCX format",
  "Stable internet connection",
  "3 uninterrupted minutes to complete the interview",
  "Quiet environment free of background conversations and distractions",
  "The interviewer is not mobile optimized yet; please complete this interview on a computer.",
  "You may complete only one interview per role. Once submitted, the interview cannot be retaken.",
];

type Step = "info" | "otp" | "ready" | "live";

/* ── Step progress bar ───────────────────────────────────────────── */
const STEPS = [
  { id: "info",  label: "Your Info" },
  { id: "otp",  label: "Verify"    },
  { id: "ready", label: "Start"    },
];

function StepIndicator({ current }: { current: Step }) {
  const idx = STEPS.findIndex((s) => s.id === current);
  const active = idx === -1 ? 2 : idx; // "ready" is index 2

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((s, i) => {
        const done    = i < active;
        const current = i === active;
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300"
                style={{
                  backgroundColor: done || current ? "#A380F6" : "transparent",
                  border: done || current ? "none" : "2px solid #D1D5DB",
                  color: done || current ? "#fff" : "#9CA3AF",
                }}
              >
                {done ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className="text-[10px] font-bold tracking-wide whitespace-nowrap"
                style={{ color: current ? "#A380F6" : done ? "#0A1547" : "#9CA3AF" }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="w-16 h-[2px] mx-1 mb-5 rounded-full transition-all duration-300"
                style={{ backgroundColor: done ? "#A380F6" : "#E5E7EB" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Shared card wrapper ─────────────────────────────────────────── */
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="bg-white rounded-2xl p-8 w-full max-w-md"
      style={{
        border: "1px solid rgba(10,21,71,0.07)",
        boxShadow: "0 4px 24px rgba(10,21,71,0.08)",
      }}
    >
      {children}
    </div>
  );
}

/* ── Shared input style ──────────────────────────────────────────── */
const inputCls =
  "w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#0A1547] text-sm " +
  "placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A380F6]/20 " +
  "focus:border-[#A380F6] transition-all";

const errorCls = "text-red-500 text-[10px] mt-1 font-semibold";
const isValidPhone = (value: string) => /^(\d{10}|\(\d{3}\)\s?\d{3}-\d{4}|\d{3}-\d{3}-\d{4}|\d{3}\.\d{3}\.\d{4})$/.test(String(value || "").trim());
const isValidResumeFile = (file: File | null | undefined) =>
  Boolean(file && /\.(pdf|doc|docx)$/i.test(String(file.name || "")));

const env = (
  typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : {}
) as Record<string, string | undefined>;

function trimTrailingSlashes(value: string): string {
  return String(value || "").trim().replace(/\/+$/, "");
}

function firstBase(...values: Array<string | undefined>): string {
  for (const value of values) {
    const normalized = trimTrailingSlashes(value || "");
    if (normalized) return normalized;
  }
  return "";
}

const backendBase = firstBase(
  env.VITE_BACKEND_URL,
  env.VITE_API_URL,
  env.VITE_PUBLIC_BACKEND_URL,
  env.PUBLIC_BACKEND_URL,
  env.BACKEND_URL,
);

function joinUrl(base: string, path: string): string {
  if (!base) return path;
  if (base.endsWith("/") && path.startsWith("/")) return `${base.slice(0, -1)}${path}`;
  if (!base.endsWith("/") && !path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}

function readRoleToken(): string {
  if (typeof window === "undefined") return "";
  try {
    const path = String(window.location.pathname || "");
    const pathMatch = path.match(/^\/interview\/([^/?#]+)/);
    if (pathMatch?.[1]) return decodeURIComponent(pathMatch[1]).trim();

    const url = new URL(window.location.href);
    return (
      String(url.searchParams.get("role_token") || "").trim() ||
      String(url.searchParams.get("role") || "").trim() ||
      String(url.searchParams.get("token") || "").trim()
    );
  } catch {
    return "";
  }
}

export default function InterviewPage() {
  const [, setLocation] = useLocation();

  /* ── Terms modal ─────────────────────────────────────────────── */
  const [termsOpen, setTermsOpen]     = useState(true);
  const [understood, setUnderstood]   = useState(false);

  /* ── Workflow step ───────────────────────────────────────────── */
  const [step, setStep] = useState<Step>("info");

  /* ── Step 1 fields ───────────────────────────────────────────── */
  const [firstName, setFirstName]     = useState("");
  const [lastName, setLastName]       = useState("");
  const [email, setEmail]             = useState("");
  const [phone, setPhone]             = useState("");
  const [resumeFile, setResumeFile]   = useState<File | null>(null);
  const [dragging, setDragging]       = useState(false);
  const [errors, setErrors]           = useState<Record<string, string>>({});
  const fileRef                       = useRef<HTMLInputElement>(null);

  /* ── Step 2 fields ───────────────────────────────────────────── */
  const [otp, setOtp]         = useState("");
  const [otpError, setOtpError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [startLoading, setStartLoading] = useState(false);
  const [startError, setStartError] = useState("");
  const [interviewAuth, setInterviewAuth] = useState({
    candidate_id: "",
    role_id: "",
    email: "",
    role_token: readRoleToken(),
  });
  const [interviewStartState, setInterviewStartState] = useState<{
    interview_id: string;
    conversation_id: string;
    conversation_url: string;
    max_interview_minutes: number | null;
  }>({
    interview_id: "",
    conversation_id: "",
    conversation_url: "",
    max_interview_minutes: null,
  });

  /* ── Helpers ─────────────────────────────────────────────────── */
  function handleFile(file: File) {
    if (!isValidResumeFile(file)) {
      if (fileRef.current) fileRef.current.value = "";
      setErrors((e) => ({
        ...e,
        resume: "Resume must be a PDF, DOC, or DOCX file.",
      }));
      return;
    }
    setResumeFile(file);
    setErrors((e) => ({ ...e, resume: "", submit: "" }));
  }

  function validateStep1() {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = "Required";
    if (!lastName.trim())  e.lastName  = "Required";
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = "A valid email is required";
    if (!isValidPhone(phone)) e.phone = "Enter a valid phone number: XXXXXXXXXX, (XXX) XXX-XXXX, XXX-XXX-XXXX, or XXX.XXX.XXXX.";
    if (!resumeFile)       e.resume    = "Please upload your resume";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validateStep1()) return;

    const roleToken = String(interviewAuth.role_token || "").trim();
    if (!roleToken) {
      setErrors((e) => ({ ...e, submit: "Missing role link. Please use the interview URL you were sent." }));
      return;
    }
    if (!backendBase) {
      setErrors((e) => ({ ...e, submit: "Interview service is not configured. Please try again later." }));
      return;
    }

    setSubmitLoading(true);
    setErrors((e) => ({ ...e, submit: "" }));
    setOtpError("");

    try {
      const body = new FormData();
      body.append("first_name", firstName.trim());
      body.append("last_name", lastName.trim());
      body.append("email", email.trim());
      body.append("phone", String(phone || "").replace(/\D/g, ""));
      body.append("role_token", roleToken);
      if (resumeFile) body.append("resume", resumeFile);

      const resp = await fetch(joinUrl(backendBase, "/api/candidate/submit"), {
        method: "POST",
        body,
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const hint = String(data?.hint || "").trim();
        const detail = String(data?.detail || "").trim();
        const msg = detail || String(data?.error || "").trim() || "Could not submit your information.";
        setErrors((e) => ({ ...e, submit: hint ? `${msg} ${hint}` : msg }));
        return;
      }

      const verifiedEmail = String(data?.email || email).trim();
      setInterviewAuth({
        candidate_id: String(data?.candidate_id || "").trim(),
        role_id: String(data?.role_id || "").trim(),
        email: verifiedEmail,
        role_token: roleToken,
      });
      setEmail(verifiedEmail);
      setStep("otp");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors((e) => ({ ...e, submit: "Network error. Please try again." }));
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleVerify() {
    if (!/^\d{6}$/.test(otp)) {
      setOtpError("Please enter a valid 6-digit code.");
      return;
    }
    if (!backendBase) {
      setOtpError("Interview service is not configured. Please try again later.");
      return;
    }

    const verifyEmail = String(interviewAuth.email || email).trim().toLowerCase();
    if (!verifyEmail || !interviewAuth.candidate_id || !interviewAuth.role_id) {
      setOtpError("Missing interview session data. Please submit your information again.");
      return;
    }

    setVerifyLoading(true);
    setOtpError("");
    try {
      const resp = await fetch(joinUrl(backendBase, "/api/candidate/verify-otp"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: verifyEmail,
          code: otp.trim(),
          candidate_id: interviewAuth.candidate_id,
          role_id: interviewAuth.role_id,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const hint = String(data?.hint || "").trim();
        const detail = String(data?.detail || "").trim();
        const msg = detail || String(data?.error || "").trim() || "Verification failed.";
        setOtpError(hint ? `${msg} ${hint}` : msg);
        return;
      }

      const verifiedEmail = String(data?.email || verifyEmail).trim();
      setInterviewAuth((prev) => ({
        candidate_id: String(data?.candidate_id || prev.candidate_id).trim(),
        role_id: String(data?.role_id || prev.role_id).trim(),
        email: verifiedEmail,
        role_token: prev.role_token,
      }));
      setStartError("");
      setStep("ready");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setOtpError("Network error verifying code.");
    } finally {
      setVerifyLoading(false);
    }
  }

  async function handleStartInterview() {
    if (!backendBase) {
      setStartError("Interview service is not configured. Please try again later.");
      return;
    }

    const candidateId = String(interviewAuth.candidate_id || "").trim();
    const roleId = String(interviewAuth.role_id || "").trim();
    const candidateEmail = String(interviewAuth.email || email).trim();
    const roleToken = String(interviewAuth.role_token || "").trim();

    if (!candidateId || !roleId || !candidateEmail || !roleToken) {
      setStartError("Missing interview session data. Please submit and verify again.");
      return;
    }

    setStartLoading(true);
    setStartError("");

    try {
      const resp = await fetch(joinUrl(backendBase, "/create-tavus-interview"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate_id: candidateId,
          role_id: roleId,
          email: candidateEmail,
          roleToken,
          role_token: roleToken,
        }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        const hint = String(data?.hint || "").trim();
        const detail = String(data?.detail || "").trim();
        const msg = detail || String(data?.error || "").trim() || "Could not start interview.";
        setStartError(hint ? `${msg} ${hint}` : msg);
        return;
      }

      const conversationUrl = String(
        data?.conversation_url ||
        data?.video_url ||
        data?.redirect_url ||
        data?.url ||
        "",
      ).trim();
      const conversationId = String(data?.conversation_id || "").trim();
      const interviewId = String(data?.interview_id || "").trim();
      const maxInterviewMinutesRaw = Number(data?.max_interview_minutes);
      const maxInterviewMinutes = Number.isFinite(maxInterviewMinutesRaw) && maxInterviewMinutesRaw > 0
        ? Math.floor(maxInterviewMinutesRaw)
        : null;

      setInterviewStartState({
        interview_id: interviewId,
        conversation_id: conversationId,
        conversation_url: conversationUrl,
        max_interview_minutes: maxInterviewMinutes,
      });
      if (!conversationUrl) {
        setStartError("Interview room is initializing—try again in a moment.");
        return;
      }

      try {
        window.sessionStorage.setItem(
          "alphasource_interview_live_state",
          JSON.stringify({
            conversation_url: conversationUrl,
            conversation_id: conversationId,
            interview_id: interviewId,
            role_token: roleToken,
            max_interview_minutes: maxInterviewMinutes,
            email: candidateEmail,
            candidate_id: candidateId,
            role_id: roleId,
          }),
        );
      } catch {}

      setLocation("/interview-cvi");
    } catch {
      setStartError("Network error starting interview.");
    }
    finally {
      setStartLoading(false);
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     PAGE SHELL (all non-live steps)
  ═══════════════════════════════════════════════════════════════ */
  return (
    <div
      className="min-h-screen bg-[#F8F9FD] flex flex-col"
      style={{ fontFamily: "'Raleway', sans-serif" }}
    >
      {/* ── Terms modal ──────────────────────────────────────── */}
      {termsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div
            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
            style={{ border: "1px solid rgba(10,21,71,0.08)" }}
          >
            {/* Modal header */}
            <div
              className="px-7 pt-7 pb-5"
              style={{ borderBottom: "1px solid rgba(10,21,71,0.07)" }}
            >
              <div className="flex items-center gap-3 mb-1">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: "rgba(163,128,246,0.12)" }}
                >
                  <ChevronRight className="w-4 h-4" style={{ color: "#A380F6" }} />
                </div>
                <h2 className="text-lg font-black text-[#0A1547] leading-tight">
                  Before you start your interview
                </h2>
              </div>
            </div>

            {/* Modal body */}
            <div className="px-7 py-5">
              <p className="text-xs text-[#0A1547]/50 font-semibold mb-3">
                Please review this quick checklist before you begin:
              </p>
              <ul className="space-y-2 mb-5">
                {CHECKLIST.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span
                      className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "rgba(163,128,246,0.12)" }}
                    >
                      <Check className="w-2.5 h-2.5" style={{ color: "#A380F6" }} />
                    </span>
                    <span className="text-xs text-[#0A1547]/70 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              <div
                className="rounded-xl p-3.5 mb-5 text-xs text-[#0A1547]/60 leading-relaxed"
                style={{ backgroundColor: "rgba(163,128,246,0.06)", border: "1px solid rgba(163,128,246,0.15)" }}
              >
                Background conversations and noise can be picked up during the interview and may
                interfere with your responses.
              </div>

              <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                <div
                  className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    borderColor: understood ? "#A380F6" : "#D1D5DB",
                    backgroundColor: understood ? "#A380F6" : "transparent",
                  }}
                  onClick={() => setUnderstood((u) => !u)}
                >
                  {understood && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                />
                <span className="text-xs text-[#0A1547]/70 font-semibold">
                  I understand and I am in a quiet place.
                </span>
              </label>
            </div>

            {/* Modal footer */}
            <div
              className="px-7 py-5 flex justify-end"
              style={{ borderTop: "1px solid rgba(10,21,71,0.07)" }}
            >
              <button
                disabled={!understood}
                onClick={() => setTermsOpen(false)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all"
                style={{
                  backgroundColor: understood ? "#A380F6" : "rgba(163,128,246,0.30)",
                  cursor: understood ? "pointer" : "not-allowed",
                }}
              >
                Continue
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header ───────────────────────────────────────────── */}
      <header
        className="bg-white flex-shrink-0 flex items-center px-6 h-14"
        style={{ borderBottom: "1px solid rgba(10,21,71,0.07)" }}
      >
        <img src="/logo-dark-text.png" alt="AlphaSource AI" className="h-8 w-auto" />
      </header>

      {/* ── Centered workflow area ────────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">

        {/* Step indicator */}
        <StepIndicator current={step} />

        {/* ── STEP 1: Enter your information ─────────────────── */}
        {step === "info" && (
          <Card>
            <h1 className="text-xl font-black text-[#0A1547] mb-1">Enter your information</h1>
            <p className="text-xs text-[#0A1547]/45 font-semibold mb-6">
              All fields are required to proceed.
            </p>

            <div className="space-y-4">
              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 block mb-1.5">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); setErrors((er) => ({ ...er, firstName: "", submit: "" })); }}
                    placeholder="Jane"
                    className={inputCls}
                  />
                  {errors.firstName && <p className={errorCls}>{errors.firstName}</p>}
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 block mb-1.5">
                    Last Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={lastName}
                    onChange={(e) => { setLastName(e.target.value); setErrors((er) => ({ ...er, lastName: "", submit: "" })); }}
                    placeholder="Smith"
                    className={inputCls}
                  />
                  {errors.lastName && <p className={errorCls}>{errors.lastName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 block mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                  <input
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrors((er) => ({ ...er, email: "", submit: "" })); }}
                    placeholder="jane@example.com"
                    type="email"
                    className={inputCls}
                />
                {errors.email && <p className={errorCls}>{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 block mb-1.5">
                  Phone <span className="text-red-400">*</span>
                </label>
                  <input
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); setErrors((er) => ({ ...er, phone: "", submit: "" })); }}
                    placeholder="(555) 123-4567"
                    type="tel"
                    className={inputCls}
                />
                {errors.phone && <p className={errorCls}>{errors.phone}</p>}
              </div>

              {/* Resume upload */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 block mb-1.5">
                  Resume <span className="text-red-400">*</span>
                </label>
                <div
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all text-sm
                    ${dragging
                      ? "border-[#A380F6] bg-[#A380F6]/05"
                      : "border-gray-200 hover:border-[#A380F6]/50 hover:bg-gray-50"
                    }`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                    setErrors((er) => ({ ...er, submit: "" }));
                  }}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFile(e.target.files[0]);
                      setErrors((er) => ({ ...er, submit: "" }));
                    }}
                  />
                  {resumeFile ? (
                    <>
                      <FileText className="w-4 h-4 flex-shrink-0" style={{ color: "#A380F6" }} />
                      <span className="text-xs font-semibold text-[#0A1547] truncate flex-1">{resumeFile.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setResumeFile(null);
                          setErrors((er) => ({ ...er, submit: "" }));
                        }}
                        className="text-[#0A1547]/30 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 flex-shrink-0 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        PDF, DOC, or DOCX — drag here or click to browse
                      </span>
                    </>
                  )}
                </div>
                {errors.resume && <p className={errorCls}>{errors.resume}</p>}
                {errors.submit && <p className={errorCls}>{errors.submit}</p>}
              </div>
            </div>

            {/* Submit */}
            <div className="mt-7 flex items-center justify-between">
              <a
                href={
                  interviewAuth.role_token
                    ? `/accommodation-request/${encodeURIComponent(interviewAuth.role_token)}`
                    : "/accommodation-request"
                }
                className="text-xs text-[#A380F6] hover:underline transition-colors"
              >
                Need an accommodation?
              </a>
              <button
                onClick={handleSubmit}
                disabled={submitLoading}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
                style={{ backgroundColor: "#A380F6" }}
              >
                {submitLoading ? "Submitting..." : "Submit & Get OTP"}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        )}

        {/* ── STEP 2: Verify ─────────────────────────────────── */}
        {step === "otp" && (
          <Card>
            <h1 className="text-xl font-black text-[#0A1547] mb-1">Verify your identity</h1>
            <p className="text-xs text-[#0A1547]/45 font-semibold mb-6">
              A one-time code was sent to{" "}
              <span className="text-[#0A1547]/70">{interviewAuth.email || email}</span>.
            </p>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-[#0A1547]/40 block mb-1.5">
                One-Time Code <span className="text-red-400">*</span>
              </label>
              <input
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setOtpError("");
                }}
                onKeyDown={(e) => { if (e.key === "Enter") handleVerify(); }}
                placeholder="123456"
                maxLength={6}
                className={`${inputCls} text-center tracking-[0.5em] text-lg font-black`}
              />
              {otpError && <p className={errorCls}>{otpError}</p>}
            </div>

            <p className="text-[10px] text-[#0A1547]/35 mt-3 leading-relaxed">
              Didn't receive a code? Check your spam folder or contact{" "}
              <a href="mailto:info@alphasourceai.com" className="text-[#A380F6] hover:underline">
                info@alphasourceai.com
              </a>
              .
            </p>

            <button
              onClick={handleVerify}
              disabled={verifyLoading}
              className="mt-7 w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.97]"
              style={{ backgroundColor: "#A380F6" }}
            >
              {verifyLoading ? "Verifying..." : "Verify"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Card>
        )}

        {/* ── STEP 3: Start Interview ─────────────────────────── */}
        {step === "ready" && (
          <Card>
            {/* Success icon */}
            <div className="flex flex-col items-center text-center">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ backgroundColor: "rgba(2,217,157,0.12)", border: "1px solid rgba(2,217,157,0.2)" }}
              >
                <Check className="w-6 h-6" style={{ color: "#02D99D" }} />
              </div>

              <h1 className="text-xl font-black text-[#0A1547] mb-2">You're all set, {firstName}!</h1>
              <p className="text-xs text-[#0A1547]/45 font-semibold mb-2 leading-relaxed max-w-xs">
                Your identity has been verified. When you're ready, click the button below to begin
                your interview.
              </p>
              <p className="text-[10px] text-[#0A1547]/30 mb-8 leading-relaxed max-w-xs">
                Make sure you are in a quiet space with a stable internet connection before starting.
              </p>

              <button
                onClick={handleStartInterview}
                disabled={startLoading}
                className="flex items-center gap-2.5 px-8 py-3 rounded-full text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.97] shadow-lg"
                style={{ backgroundColor: "#02D99D", boxShadow: "0 4px 20px rgba(2,217,157,0.35)" }}
              >
                <span
                  className="w-2 h-2 rounded-full bg-white animate-pulse flex-shrink-0"
                />
                {startLoading ? "Starting..." : "Start Interview"}
              </button>
              {startError && <p className={errorCls}>{startError}</p>}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
