"use client";

import { useState, useRef } from "react";

export default function InterpretPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    if (!file && !text.trim()) return;
    setLoading(true);
    setError("");
    setInterpretation("");

    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      if (text.trim()) formData.append("text", text.trim());

      const res = await fetch("/api/interpret", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) setError(data.error || "Something went wrong");
      else setInterpretation(data.interpretation);
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) setFile(f);
  };

  const isEmergency = interpretation.toLowerCase().includes("call 911") || interpretation.toLowerCase().includes("emergency room");

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-sage-light/30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <svg viewBox="0 0 100 100" className="w-6 h-6">
              <path d="M48 10C28 10 10 28 10 50C10 72 28 90 48 90" fill="#4A6741" />
              <path d="M52 10C72 10 90 28 90 50C90 72 72 90 52 90" fill="#4A6741" />
            </svg>
            <span className="text-lg font-bold tracking-tight text-bark">co-op.care</span>
          </a>
          <span className="text-sm font-medium text-sage-dark">Sage Interpreter</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-24 pb-16">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-bark leading-tight">
            Upload anything.<br />Get Sage&apos;s best reading.
          </h1>
          <p className="mt-4 text-bark-light text-lg leading-relaxed max-w-xl mx-auto">
            Lab results, MRI reports, discharge papers, a photo of a pill bottle,
            a confusing letter from the insurance company — drop it here.
          </p>
        </div>

        {/* 911 Banner */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm text-red-800">
            <strong>If this is an emergency, call 911 now.</strong> Chest pain, trouble breathing, stroke symptoms, severe bleeding, or loss of consciousness — don&apos;t wait for an AI. Call 911.
          </p>
        </div>

        {/* Upload Card */}
        <div className="bg-white rounded-2xl border border-sage-light/30 shadow-sm p-6 sm:p-8">
          {/* Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
              dragActive ? "border-sage bg-sage-50" : file ? "border-sage-light bg-sage-50/30" : "border-sage-light/40 hover:border-sage-light hover:bg-cream"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.txt,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="hidden"
            />

            {file ? (
              <div className="flex flex-col items-center gap-2">
                <svg className="w-10 h-10 text-sage-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold text-bark">{file.name}</p>
                <p className="text-sm text-bark-light">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                <button onClick={(e) => { e.stopPropagation(); setFile(null); }} className="text-sm text-red-500 hover:text-red-700 mt-1">Remove</button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <svg className="w-12 h-12 text-sage-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                <p className="font-semibold text-bark">Drop your document here</p>
                <p className="text-sm text-bark-light">Photos of reports work too. Take a picture with your phone.</p>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-sage-light/30" />
            <span className="text-sm text-bark-light/50 font-medium">or paste text</span>
            <div className="flex-1 h-px bg-sage-light/30" />
          </div>

          {/* Text Area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your report here, or just describe what's going on. &quot;My mom's doctor said her A1C is 7.2 and I don't know what that means...&quot;"
            className="w-full h-36 p-4 border border-sage-light/30 rounded-xl text-bark placeholder-bark-light/40 resize-none focus:outline-none focus:ring-2 focus:ring-sage-dark/30 focus:border-sage text-sm leading-relaxed bg-cream/50"
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || (!file && !text.trim())}
            className="mt-6 w-full py-4 rounded-xl text-white font-bold text-lg transition-all hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 bg-sage-dark hover:bg-bark"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sage is reading...
              </>
            ) : (
              "Ask Sage"
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
          )}
        </div>

        {/* Results */}
        {interpretation && (
          <div className={`mt-8 bg-white rounded-2xl border shadow-sm p-6 sm:p-8 ${isEmergency ? "border-red-300" : "border-sage-light/30"}`}>
            {isEmergency && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-xl">
                <p className="text-red-900 font-bold text-lg text-center">If you haven&apos;t already, call 911 now.</p>
                <p className="text-red-800 text-center mt-1">
                  <a href="tel:911" className="underline font-bold text-xl">Tap here to call 911</a>
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-sage-light/20">
              <div className="w-10 h-10 rounded-lg bg-sage-dark flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-bark">Sage&apos;s Reading</h2>
                <p className="text-sm text-bark-light">co-op.care AI assistant</p>
              </div>
            </div>

            <div className="prose prose-gray max-w-none text-bark text-sm leading-relaxed whitespace-pre-wrap">
              {interpretation}
            </div>

            {/* Disclaimer */}
            <div className="mt-8 p-4 bg-cream rounded-xl border border-sage-light/20">
              <p className="text-xs text-bark-light">
                This is Sage&apos;s best reading — not a diagnosis. Always share results with your healthcare provider.
                co-op.care is a worker-owned cooperative in Boulder, CO. Physician-supervised by Josh Emdur, DO.
              </p>
            </div>

            {/* Pathway CTAs */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href="/#services" className="py-3 rounded-xl bg-sage-dark text-white font-semibold text-center text-sm hover:bg-bark transition-colors">
                Explore cooperative services
              </a>
              <a href="https://www.surgeonvalue.com" target="_blank" rel="noopener noreferrer" className="py-3 rounded-xl border border-sage-light text-bark font-semibold text-center text-sm hover:border-sage transition-colors">
                Find a specialist
              </a>
              <a href="https://www.comfortcard.org" target="_blank" rel="noopener noreferrer" className="py-3 rounded-xl border border-sage-light text-bark font-semibold text-center text-sm hover:border-sage transition-colors">
                Check HSA/FSA eligibility
              </a>
              <a href="/#join" className="py-3 rounded-xl border border-sage-light text-bark font-semibold text-center text-sm hover:border-sage transition-colors">
                Join the cooperative — $59/mo
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
