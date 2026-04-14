"use client";

import { useState } from "react";

const DISCLAIMER =
  "Care Hours are not a substitute for licensed medical care. Hands-on personal care requires co-op.care licensed caregivers.";

const TIER1_SERVICES = [
  { id: "companionship", name: "Companionship visit", description: "A neighbor to sit with, talk, and be present." },
  { id: "transportation", name: "Transportation", description: "A ride to a medical appointment or errand." },
  { id: "meals", name: "Meal preparation", description: "Someone to cook a meal at home." },
  { id: "errands", name: "Grocery shopping / errands", description: "Help with groceries or running errands." },
  { id: "tech", name: "Technology assistance", description: "Help with a phone, tablet, or computer." },
  { id: "housekeeping", name: "Light housekeeping", description: "Tidying, laundry, or dishes." },
];

const URGENCY_OPTIONS = [
  { id: "today", label: "Today", description: "I need help as soon as today." },
  { id: "this_week", label: "This week", description: "Sometime in the next few days." },
  { id: "this_month", label: "This month", description: "Within the next few weeks — planning ahead." },
];

export default function RequestHelpPage() {
  const [selectedService, setSelectedService] = useState("");
  const [urgency, setUrgency] = useState("this_week");
  const [description, setDescription] = useState("");
  const [estimatedHours, setEstimatedHours] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = selectedService && description.trim().length > 10;

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/time-bank/transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "match_request",
          service_type: selectedService,
          urgency,
          description: description.trim(),
          estimated_hours: estimatedHours,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#FEFCF6] flex flex-col">
        <Nav />
        <main className="flex-1 pt-24 pb-24 px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 bg-[#4A6741]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-[#4A6741]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#292524] mb-4">Your request is in.</h1>
            <p className="text-lg text-[#57534E] mb-3">
              Our team reviews every request to find the right neighbor match. We will reach out once we have found someone.
            </p>
            <p className="text-sm text-[#57534E] mb-8">
              For urgent needs today, please call or text us at{" "}
              <span className="font-semibold text-[#292524]">(720) 555-0199</span> — we will do our best to move quickly.
            </p>
            <a
              href="/time-bank"
              className="inline-block text-sm px-6 py-3 bg-[#4A6741] text-white rounded-full hover:bg-[#292524] transition-colors font-medium"
            >
              Back to your Care Hours dashboard
            </a>
          </div>
        </main>
        <DisclaimerBar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFCF6] flex flex-col">
      <Nav />
      <main className="flex-1 pt-24 pb-24 px-6">
        <div className="max-w-2xl mx-auto">

          <div className="mb-8">
            <a href="/time-bank" className="text-sm text-[#4A6741] hover:underline mb-4 inline-block">&larr; Care Hours dashboard</a>
            <h1 className="text-3xl font-bold text-[#292524] mb-2">Request help from a neighbor</h1>
            <p className="text-[#57534E]">
              Describe what you need. Our team will find a neighbor who can help and connect you. Your Care Hours are only deducted after the exchange is confirmed by both of you.
            </p>
          </div>

          {/* Hands-on care notice */}
          <div className="bg-[#F5F0EB] border border-[#C5D4B5] rounded-xl p-4 mb-8">
            <p className="text-sm font-semibold text-[#292524] mb-1">Need hands-on personal care?</p>
            <p className="text-sm text-[#57534E]">
              Bathing assistance, transfers, medication management, and wound care require our licensed co-op.care caregivers and cannot be requested through the time bank.{" "}
              <a href="/assess" className="text-[#4A6741] font-medium hover:underline">Start a free assessment</a>{" "}
              to be matched with a licensed caregiver.
            </p>
          </div>

          {/* Service type */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#292524] mb-4">What kind of help do you need?</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {TIER1_SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-colors ${
                    selectedService === service.id
                      ? "border-[#4A6741] bg-[#4A6741]/5"
                      : "border-[#C5D4B5]/60 bg-white hover:border-[#4A6741]/40"
                  }`}
                >
                  <p className="font-medium text-[#292524] text-sm">{service.name}</p>
                  <p className="text-xs text-[#57534E] mt-0.5">{service.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Describe the need */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#292524] mb-2">Describe what you need</h2>
            <p className="text-sm text-[#57534E] mb-4">
              The more context you provide, the better we can match you with the right neighbor. Include any relevant details — day, location in Boulder, special considerations.
            </p>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="My mother lives off Baseline Road and has a cardiology appointment at Boulder Community Hospital on Thursday morning. She needs someone to drive her there and wait about 90 minutes."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-[#C5D4B5] bg-white text-[#292524] placeholder-[#A8A29E] focus:outline-none focus:border-[#4A6741] text-sm resize-none"
            />
            <p className="text-xs text-[#A8A29E] mt-1.5">{description.length} characters. More detail helps us find the right match.</p>
          </div>

          {/* Urgency */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#292524] mb-4">How soon do you need this?</h2>
            <div className="grid gap-3">
              {URGENCY_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setUrgency(option.id)}
                  className={`text-left p-4 rounded-xl border-2 transition-colors ${
                    urgency === option.id
                      ? "border-[#4A6741] bg-[#4A6741]/5"
                      : "border-[#C5D4B5]/60 bg-white hover:border-[#4A6741]/40"
                  }`}
                >
                  <p className="font-medium text-[#292524] text-sm">{option.label}</p>
                  <p className="text-xs text-[#57534E] mt-0.5">{option.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Estimated hours */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#292524] mb-2">
              Estimated hours needed{" "}
              <span className="text-[#4A6741]">{estimatedHours} {estimatedHours === 1 ? "hour" : "hours"}</span>
            </h2>
            <p className="text-sm text-[#57534E] mb-4">
              This is an estimate — the actual Care Hours deducted will reflect the real time confirmed by both of you after the exchange.
            </p>
            <input
              type="range"
              min={0.5}
              max={8}
              step={0.5}
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(Number(e.target.value))}
              className="w-full h-2 bg-[#C5D4B5]/40 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4A6741]"
            />
            <div className="flex justify-between text-xs text-[#A8A29E] mt-1.5">
              <span>30 min</span>
              <span>8 hours</span>
            </div>
            <div className="mt-4 bg-[#F5F0EB] rounded-xl px-4 py-3">
              <p className="text-sm text-[#57534E]">
                Estimated cost: <span className="font-semibold text-[#292524]">{estimatedHours} Care {estimatedHours === 1 ? "Hour" : "Hours"}</span> from your balance.
                Your current balance will be confirmed at checkout.
              </p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full py-3.5 bg-[#4A6741] text-white rounded-full font-medium hover:bg-[#292524] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting your request..." : "Submit request for matching"}
          </button>

          <p className="text-xs text-[#A8A29E] text-center mt-4">
            Care Hours are only deducted after both you and your neighbor confirm the exchange is complete. All requests go to admin review for MVP matching.
          </p>

        </div>
      </main>
      <DisclaimerBar />
    </div>
  );
}

function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FEFCF6]/95 backdrop-blur-md border-b border-[#C5D4B5]/40">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <img src="/icon.svg" alt="co-op.care" className="w-8 h-8 rounded-lg" />
          <span className="text-base font-bold tracking-tight text-[#292524]">co-op.care</span>
        </a>
        <a href="/time-bank" className="text-sm text-[#57534E] hover:text-[#4A7C59] transition-colors">
          &larr; Care Hours
        </a>
      </div>
    </nav>
  );
}

function DisclaimerBar() {
  return (
    <div className="w-full bg-[#F5F0EB] border-t border-[#C5D4B5]/60 px-6 py-3">
      <p className="text-xs text-[#57534E] text-center max-w-3xl mx-auto">{DISCLAIMER}</p>
    </div>
  );
}
