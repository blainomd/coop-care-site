"use client";

import { useState } from "react";

const QUESTIONS = [
  {
    id: "who",
    question: "Who are you looking for care for?",
    options: [
      { label: "My parent or in-law", value: "parent" },
      { label: "My spouse or partner", value: "partner" },
      { label: "Myself", value: "self" },
      { label: "Someone else in my family", value: "other" },
    ],
  },
  {
    id: "urgency",
    question: "How soon do you need support?",
    options: [
      { label: "Right now — things are urgent", value: "urgent" },
      { label: "In the next few weeks", value: "soon" },
      { label: "Planning ahead for later this year", value: "planning" },
      { label: "Just exploring what's available", value: "exploring" },
    ],
  },
  {
    id: "challenge",
    question: "What's the biggest concern right now?",
    options: [
      { label: "Falls or safety at home", value: "falls" },
      { label: "Memory or cognitive changes", value: "memory" },
      { label: "Mobility and daily activities", value: "mobility" },
      { label: "Isolation and loneliness", value: "isolation" },
      { label: "Managing medications", value: "medications" },
      { label: "Caregiver burnout in the family", value: "burnout" },
    ],
  },
  {
    id: "hsa",
    question: "Do you have an HSA or FSA?",
    options: [
      { label: "Yes — through my employer", value: "employer-hsa" },
      { label: "Yes — I manage one myself", value: "self-hsa" },
      { label: "I think so, not sure", value: "unsure" },
      { label: "No", value: "no" },
    ],
  },
];

export default function AssessPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentQ = QUESTIONS[step];
  const progress = step / (QUESTIONS.length + 1);

  function handleOption(value: string) {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
    setTimeout(() => {
      setStep((s) => s + 1);
    }, 250);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#FEFCF6]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FEFCF6]/95 backdrop-blur-md border-b border-[#C5D4B5]/40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/icon.svg" alt="co-op.care" className="w-8 h-8 rounded-lg" />
            <span className="text-base font-bold tracking-tight text-[#292524]">co-op.care</span>
          </a>
          <span className="text-sm text-[#57534E]">Free assessment</span>
        </div>
      </nav>

      <div className="pt-20 pb-16 px-6">
        <div className="max-w-xl mx-auto">

          {/* Progress bar */}
          <div className="h-1 bg-[#C5D4B5]/30 rounded-full mb-12 mt-6">
            <div
              className="h-full bg-[#4A6741] rounded-full transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-[#F0F5EE] flex items-center justify-center mx-auto mb-6">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#4A6741]">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-[#292524] mb-3">Assessment received.</h2>
              <p className="text-[#57534E] mb-2">
                Thank you, {name}. We&apos;ll review your responses and have Sage reach out within one business day.
              </p>
              <p className="text-sm text-[#57534E]/60 mb-8">
                In the meantime, you can explore the membership or learn about becoming a caregiver-owner.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href="/membership"
                  className="px-6 py-3 rounded-full bg-[#4A6741] text-white font-medium hover:bg-[#292524] transition-colors"
                >
                  See $59/mo membership
                </a>
                <a
                  href="/"
                  className="px-6 py-3 rounded-full bg-[#F0F5EE] text-[#292524] font-medium hover:bg-[#C5D4B5]/30 transition-colors"
                >
                  Back to home
                </a>
              </div>
            </div>

          ) : step < QUESTIONS.length ? (
            <div>
              <p className="text-xs text-[#4A6741] font-semibold tracking-wider uppercase mb-6">
                Question {step + 1} of {QUESTIONS.length}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#292524] mb-8 leading-snug">
                {currentQ.question}
              </h2>
              <div className="space-y-3">
                {currentQ.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleOption(opt.value)}
                    className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all font-medium text-[#292524] hover:border-[#4A6741] hover:bg-[#F0F5EE] ${
                      answers[currentQ.id] === opt.value
                        ? "border-[#4A6741] bg-[#F0F5EE]"
                        : "border-[#C5D4B5]/40 bg-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

          ) : (
            <div>
              <p className="text-xs text-[#4A6741] font-semibold tracking-wider uppercase mb-4">One last thing</p>
              <h2 className="text-2xl font-bold text-[#292524] mb-2">Where should we send your care plan?</h2>
              <p className="text-[#57534E] mb-8">
                Sage will review your answers and prepare a personalized care assessment within one business day.
                No spam, no sales calls.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#292524] mb-1.5">First name</label>
                  <input
                    type="text"
                    required
                    placeholder="Sarah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#C5D4B5]/40 focus:border-[#4A6741] focus:outline-none text-[#292524] bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#292524] mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#C5D4B5]/40 focus:border-[#4A6741] focus:outline-none text-[#292524] bg-white transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#4A6741] text-white font-bold text-base hover:bg-[#292524] transition-colors"
                >
                  Send my free assessment
                </button>
                <p className="text-center text-xs text-[#57534E]/40">
                  Your information is private. HIPAA-compliant. Never sold.
                </p>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Trust footer */}
      {!submitted && (
        <div className="py-8 px-6 bg-[#F0F5EE] border-t border-[#C5D4B5]/30">
          <div className="max-w-xl mx-auto">
            <div className="grid grid-cols-3 gap-4 text-center text-xs text-[#57534E]/60">
              <div>
                <div className="font-semibold text-[#4A6741] text-sm mb-0.5">Free</div>
                <div>No cost, ever</div>
              </div>
              <div>
                <div className="font-semibold text-[#4A6741] text-sm mb-0.5">Private</div>
                <div>HIPAA-compliant</div>
              </div>
              <div>
                <div className="font-semibold text-[#4A6741] text-sm mb-0.5">Physician-reviewed</div>
                <div>Josh Emdur DO</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
