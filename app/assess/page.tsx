"use client";

import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1
  careName: string;
  relationship: string;
  ageRange: string;
  // Step 2
  challenges: string[];
  additionalContext: string;
  // Step 3
  livingSituation: string;
  city: string;
  state: string;
  hasPCP: string;
  // Step 4
  yourName: string;
  email: string;
  phone: string;
  bestTime: string;
}

const TOTAL_STEPS = 4;

const RELATIONSHIP_OPTIONS = [
  { label: "Parent", value: "parent" },
  { label: "Spouse / Partner", value: "spouse" },
  { label: "Myself", value: "self" },
  { label: "Other", value: "other" },
];

const AGE_OPTIONS = [
  { label: "Under 65", value: "under-65" },
  { label: "65 – 75", value: "65-75" },
  { label: "75 – 85", value: "75-85" },
  { label: "85+", value: "85-plus" },
];

const CHALLENGE_OPTIONS = [
  { label: "Falls / mobility", value: "falls-mobility" },
  { label: "Memory / cognition", value: "memory-cognition" },
  { label: "Medication management", value: "medications" },
  { label: "Loneliness / isolation", value: "isolation" },
  { label: "Recovery from surgery", value: "surgery-recovery" },
  { label: "Daily activities (cooking, cleaning, bathing)", value: "daily-activities" },
  { label: "Transportation", value: "transportation" },
  { label: "Other", value: "other" },
];

const LIVING_OPTIONS = [
  { label: "Alone at home", value: "alone-at-home" },
  { label: "With family", value: "with-family" },
  { label: "Assisted living", value: "assisted-living" },
  { label: "Hospital / rehab", value: "hospital-rehab" },
];

const BEST_TIME_OPTIONS = [
  { label: "Morning", value: "morning" },
  { label: "Afternoon", value: "afternoon" },
  { label: "Evening", value: "evening" },
];

// ── Helpers ────────────────────────────────────────────────────────────────

function buildSagePrompt(data: FormData): string {
  const who = data.careName
    ? `${data.careName} (${data.relationship}, ${data.ageRange})`
    : `a ${data.relationship} (${data.ageRange})`;

  const challenges =
    data.challenges.length > 0
      ? data.challenges
          .map((c) => CHALLENGE_OPTIONS.find((o) => o.value === c)?.label ?? c)
          .join(", ")
      : "not specified";

  const living =
    LIVING_OPTIONS.find((o) => o.value === data.livingSituation)?.label ??
    data.livingSituation;

  const location = [data.city, data.state].filter(Boolean).join(", ") || "location not provided";

  return (
    `Hi Sage — I just completed the care assessment for ${who}. ` +
    `They are currently ${living.toLowerCase()} in ${location}. ` +
    `The biggest challenges right now are: ${challenges}. ` +
    (data.additionalContext
      ? `Additional context: "${data.additionalContext}". `
      : "") +
    `They ${data.hasPCP === "yes" ? "have" : "do not have"} a primary care physician. ` +
    `My name is ${data.yourName} and I would like to talk through next steps.`
  );
}

// ── Progress bar ───────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const pct = Math.round(((step - 1) / TOTAL_STEPS) * 100);
  return (
    <div className="mb-10 mt-6">
      <div className="flex justify-between text-xs text-[#57534E]/50 mb-2">
        <span>
          Step {step} of {TOTAL_STEPS}
        </span>
        <span>{pct}% complete</span>
      </div>
      <div className="h-1.5 bg-[#C5D4B5]/30 rounded-full">
        <div
          className="h-full bg-[#4A7C59] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ── Pill button for single-select ──────────────────────────────────────────

function OptionPill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left px-5 py-4 rounded-xl border-2 font-medium transition-all ${
        selected
          ? "border-[#4A7C59] bg-[#EEF5EE] text-[#292524]"
          : "border-[#C5D4B5]/40 bg-white text-[#292524] hover:border-[#4A7C59] hover:bg-[#EEF5EE]"
      }`}
    >
      {label}
    </button>
  );
}

// ── Checkbox option ────────────────────────────────────────────────────────

function CheckOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-start gap-3 px-5 py-4 rounded-xl border-2 cursor-pointer transition-all w-full bg-white hover:bg-[#EEF5EE] hover:border-[#4A7C59] border-[#C5D4B5]/40">
      <span
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          checked
            ? "bg-[#4A7C59] border-[#4A7C59]"
            : "border-[#C5D4B5] bg-white"
        }`}
      >
        {checked && (
          <svg
            width="11"
            height="9"
            viewBox="0 0 11 9"
            fill="none"
          >
            <path
              d="M1 4.5L4 7.5L10 1"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="font-medium text-[#292524]">{label}</span>
    </label>
  );
}

// ── Text input ─────────────────────────────────────────────────────────────

function TextInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#292524] mb-1.5">
        {label}
        {!required && (
          <span className="ml-1 font-normal text-[#57534E]/50">(optional)</span>
        )}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 rounded-xl border-2 border-[#C5D4B5]/40 focus:border-[#4A7C59] focus:outline-none text-[#292524] bg-white transition-colors placeholder:text-[#57534E]/30"
      />
    </div>
  );
}

// ── Confirmation screen ────────────────────────────────────────────────────

function Confirmation({
  data,
  assessmentId,
}: {
  data: FormData;
  assessmentId: string;
}) {
  const prompt = buildSagePrompt(data);
  const encodedPrompt = encodeURIComponent(prompt);

  return (
    <div className="py-8">
      <div className="w-14 h-14 rounded-full bg-[#EEF5EE] flex items-center justify-center mb-6">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6L9 17l-5-5"
            stroke="#4A7C59"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-[#292524] mb-3">
        Thank you, {data.yourName}.
      </h2>
      <p className="text-[#57534E] mb-2">
        Sage will review your assessment and follow up within 24 hours.
      </p>
      <p className="text-xs text-[#57534E]/50 mb-8">
        Assessment ID: {assessmentId}
      </p>

      <div className="bg-[#EEF5EE] border border-[#C5D4B5]/40 rounded-2xl p-5 mb-8">
        <p className="text-xs font-semibold text-[#4A7C59] uppercase tracking-wider mb-3">
          Start a conversation with Sage now
        </p>
        <p className="text-sm text-[#57534E] mb-4 leading-relaxed">
          Your assessment context is ready. Click below to open a pre-filled conversation with Sage.
        </p>
        <a
          href={`https://claude.ai/new?q=${encodedPrompt}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-5 py-3 rounded-xl bg-[#4A7C59] text-white font-semibold text-sm hover:bg-[#3a6349] transition-colors"
        >
          Talk to Sage about next steps
        </a>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/membership"
          className="px-6 py-3 rounded-full bg-[#4A7C59] text-white font-medium text-sm text-center hover:bg-[#3a6349] transition-colors"
        >
          See $59/mo membership
        </a>
        <a
          href="/"
          className="px-6 py-3 rounded-full bg-[#F0F5EE] text-[#292524] font-medium text-sm text-center hover:bg-[#C5D4B5]/30 transition-colors"
        >
          Back to home
        </a>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function AssessPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [assessmentId, setAssessmentId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [data, setData] = useState<FormData>({
    careName: "",
    relationship: "",
    ageRange: "",
    challenges: [],
    additionalContext: "",
    livingSituation: "",
    city: "",
    state: "",
    hasPCP: "",
    yourName: "",
    email: "",
    phone: "",
    bestTime: "",
  });

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function toggleChallenge(value: string) {
    setData((prev) => ({
      ...prev,
      challenges: prev.challenges.includes(value)
        ? prev.challenges.filter((c) => c !== value)
        : [...prev.challenges, value],
    }));
  }

  function canAdvance(): boolean {
    if (step === 1) return !!data.relationship && !!data.ageRange;
    if (step === 2) return data.challenges.length > 0;
    if (step === 3) return !!data.livingSituation && !!data.hasPCP;
    if (step === 4) return !!data.yourName && !!data.email;
    return false;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canAdvance()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/assess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Submission failed");
      const json = await res.json();
      setAssessmentId(json.assessmentId ?? "");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FEFCF6]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FEFCF6]/95 backdrop-blur-md border-b border-[#C5D4B5]/40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/icon.svg" alt="co-op.care" className="w-8 h-8 rounded-lg" />
            <span className="text-base font-bold tracking-tight text-[#292524]">
              co-op.care
            </span>
          </a>
          <span className="text-sm text-[#57534E]">Free assessment</span>
        </div>
      </nav>

      <div className="pt-20 pb-16 px-6">
        <div className="max-w-xl mx-auto">
          {submitted ? (
            <Confirmation data={data} assessmentId={assessmentId} />
          ) : (
            <>
              <ProgressBar step={step} />

              {/* ── Step 1: Who needs care ──────────────────────────────── */}
              {step === 1 && (
                <div>
                  <p className="text-xs font-semibold text-[#4A7C59] tracking-wider uppercase mb-4">
                    Step 1 — Who needs care
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#292524] mb-8 leading-snug">
                    Who are you looking for care for?
                  </h2>

                  <div className="space-y-4 mb-6">
                    <TextInput
                      label="Their name"
                      placeholder="Mom, Dad, Robert…"
                      value={data.careName}
                      onChange={(v) => update("careName", v)}
                    />
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-[#292524] mb-2">
                      Relationship
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {RELATIONSHIP_OPTIONS.map((o) => (
                        <OptionPill
                          key={o.value}
                          label={o.label}
                          selected={data.relationship === o.value}
                          onClick={() => update("relationship", o.value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-sm font-semibold text-[#292524] mb-2">
                      Age range
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {AGE_OPTIONS.map((o) => (
                        <OptionPill
                          key={o.value}
                          label={o.label}
                          selected={data.ageRange === o.value}
                          onClick={() => update("ageRange", o.value)}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!canAdvance()}
                    onClick={() => setStep(2)}
                    className="w-full py-4 rounded-xl bg-[#4A7C59] text-white font-bold text-base hover:bg-[#3a6349] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              )}

              {/* ── Step 2: Biggest challenge ───────────────────────────── */}
              {step === 2 && (
                <div>
                  <p className="text-xs font-semibold text-[#4A7C59] tracking-wider uppercase mb-4">
                    Step 2 — Current challenges
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#292524] mb-3 leading-snug">
                    What&apos;s the biggest challenge right now?
                  </h2>
                  <p className="text-sm text-[#57534E] mb-6">
                    Select all that apply.
                  </p>

                  <div className="space-y-2 mb-6">
                    {CHALLENGE_OPTIONS.map((o) => (
                      <CheckOption
                        key={o.value}
                        label={o.label}
                        checked={data.challenges.includes(o.value)}
                        onChange={() => toggleChallenge(o.value)}
                      />
                    ))}
                  </div>

                  <div className="mb-8">
                    <label className="block text-sm font-semibold text-[#292524] mb-1.5">
                      Anything else we should know?{" "}
                      <span className="font-normal text-[#57534E]/50">
                        (optional)
                      </span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share as much or as little as you like…"
                      value={data.additionalContext}
                      onChange={(e) =>
                        update("additionalContext", e.target.value)
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-[#C5D4B5]/40 focus:border-[#4A7C59] focus:outline-none text-[#292524] bg-white transition-colors resize-none placeholder:text-[#57534E]/30"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-4 rounded-xl border-2 border-[#C5D4B5]/40 text-[#57534E] font-semibold hover:border-[#4A7C59] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={!canAdvance()}
                      onClick={() => setStep(3)}
                      className="flex-1 py-4 rounded-xl bg-[#4A7C59] text-white font-bold text-base hover:bg-[#3a6349] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 3: Where are they now ──────────────────────────── */}
              {step === 3 && (
                <div>
                  <p className="text-xs font-semibold text-[#4A7C59] tracking-wider uppercase mb-4">
                    Step 3 — Where they are
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#292524] mb-8 leading-snug">
                    Where are they living right now?
                  </h2>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-[#292524] mb-2">
                      Living situation
                    </p>
                    <div className="space-y-2">
                      {LIVING_OPTIONS.map((o) => (
                        <OptionPill
                          key={o.value}
                          label={o.label}
                          selected={data.livingSituation === o.value}
                          onClick={() => update("livingSituation", o.value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-[#292524] mb-2">
                      Location{" "}
                      <span className="font-normal text-[#57534E]/50">
                        (optional)
                      </span>
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        value={data.city}
                        onChange={(e) => update("city", e.target.value)}
                        className="px-4 py-3 rounded-xl border-2 border-[#C5D4B5]/40 focus:border-[#4A7C59] focus:outline-none text-[#292524] bg-white transition-colors placeholder:text-[#57534E]/30"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={data.state}
                        onChange={(e) => update("state", e.target.value)}
                        className="px-4 py-3 rounded-xl border-2 border-[#C5D4B5]/40 focus:border-[#4A7C59] focus:outline-none text-[#292524] bg-white transition-colors placeholder:text-[#57534E]/30"
                      />
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-sm font-semibold text-[#292524] mb-2">
                      Do they have a primary care physician?
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Yes", value: "yes" },
                        { label: "No", value: "no" },
                      ].map((o) => (
                        <OptionPill
                          key={o.value}
                          label={o.label}
                          selected={data.hasPCP === o.value}
                          onClick={() => update("hasPCP", o.value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="px-6 py-4 rounded-xl border-2 border-[#C5D4B5]/40 text-[#57534E] font-semibold hover:border-[#4A7C59] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={!canAdvance()}
                      onClick={() => setStep(4)}
                      className="flex-1 py-4 rounded-xl bg-[#4A7C59] text-white font-bold text-base hover:bg-[#3a6349] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* ── Step 4: Contact info ────────────────────────────────── */}
              {step === 4 && (
                <form onSubmit={handleSubmit}>
                  <p className="text-xs font-semibold text-[#4A7C59] tracking-wider uppercase mb-4">
                    Step 4 — How to reach you
                  </p>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#292524] mb-3 leading-snug">
                    How can we reach you?
                  </h2>
                  <p className="text-sm text-[#57534E] mb-8">
                    Sage will review your assessment and follow up within 24 hours.
                    No spam. No sales calls.
                  </p>

                  <div className="space-y-4 mb-6">
                    <TextInput
                      label="Your name"
                      placeholder="Sarah"
                      value={data.yourName}
                      onChange={(v) => update("yourName", v)}
                      required
                    />
                    <TextInput
                      label="Email"
                      type="email"
                      placeholder="sarah@example.com"
                      value={data.email}
                      onChange={(v) => update("email", v)}
                      required
                    />
                    <TextInput
                      label="Phone"
                      type="tel"
                      placeholder="(303) 555-0100"
                      value={data.phone}
                      onChange={(v) => update("phone", v)}
                    />
                  </div>

                  <div className="mb-8">
                    <p className="text-sm font-semibold text-[#292524] mb-2">
                      Best time to call{" "}
                      <span className="font-normal text-[#57534E]/50">
                        (optional)
                      </span>
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {BEST_TIME_OPTIONS.map((o) => (
                        <OptionPill
                          key={o.value}
                          label={o.label}
                          selected={data.bestTime === o.value}
                          onClick={() => update("bestTime", o.value)}
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 mb-4">{error}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="px-6 py-4 rounded-xl border-2 border-[#C5D4B5]/40 text-[#57534E] font-semibold hover:border-[#4A7C59] transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={!canAdvance() || submitting}
                      className="flex-1 py-4 rounded-xl bg-[#4A7C59] text-white font-bold text-base hover:bg-[#3a6349] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Sending…" : "Talk to Sage about next steps"}
                    </button>
                  </div>

                  <p className="text-center text-xs text-[#57534E]/40 mt-4">
                    Your information is private. HIPAA-compliant. Never sold.
                  </p>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* Trust footer */}
      {!submitted && (
        <div className="py-8 px-6 bg-[#EEF5EE] border-t border-[#C5D4B5]/30">
          <div className="max-w-xl mx-auto">
            <div className="grid grid-cols-3 gap-4 text-center text-xs text-[#57534E]/60">
              <div>
                <div className="font-semibold text-[#4A7C59] text-sm mb-0.5">
                  Free
                </div>
                <div>No cost, ever</div>
              </div>
              <div>
                <div className="font-semibold text-[#4A7C59] text-sm mb-0.5">
                  Private
                </div>
                <div>HIPAA-compliant</div>
              </div>
              <div>
                <div className="font-semibold text-[#4A7C59] text-sm mb-0.5">
                  Physician-reviewed
                </div>
                <div>Josh Emdur DO</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
