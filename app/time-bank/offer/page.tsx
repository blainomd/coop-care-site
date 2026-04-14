"use client";

import { useState } from "react";

const DISCLAIMER =
  "Care Hours are not a substitute for licensed medical care. Hands-on personal care requires co-op.care licensed caregivers.";

const TIER1_SERVICES = [
  {
    id: "companionship",
    name: "Companionship visit",
    description: "In-person visits, conversation, and presence for a family member.",
    requiresBackgroundCheck: true,
  },
  {
    id: "transportation",
    name: "Transportation",
    description: "Driving to medical appointments, errands, or community activities.",
    requiresBackgroundCheck: true,
  },
  {
    id: "meals",
    name: "Meal preparation",
    description: "Cooking and preparing meals at someone's home.",
    requiresBackgroundCheck: false,
  },
  {
    id: "errands",
    name: "Grocery shopping / errands",
    description: "Shopping for groceries or running errands on someone's behalf.",
    requiresBackgroundCheck: false,
  },
  {
    id: "tech",
    name: "Technology assistance",
    description: "Helping with smartphones, video calls, tablets, or computer setup.",
    requiresBackgroundCheck: false,
  },
  {
    id: "housekeeping",
    name: "Light housekeeping",
    description: "Tidying, laundry, dishes — non-hands-on household tasks.",
    requiresBackgroundCheck: false,
  },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TIMES = ["Morning (8am–12pm)", "Afternoon (12pm–5pm)", "Evening (5pm–8pm)"];

type Step = "service" | "availability" | "location" | "confirm";

export default function OfferHelpPage() {
  const [step, setStep] = useState<Step>("service");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [zip, setZip] = useState("");
  const [radiusMiles, setRadiusMiles] = useState(5);
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function toggleService(id: string) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  function toggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function toggleTime(time: string) {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  }

  const needsBackgroundCheck = selectedServices.some((id) =>
    TIER1_SERVICES.find((s) => s.id === id)?.requiresBackgroundCheck
  );

  async function handleSubmit() {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/time-bank/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "offer_profile",
          services_offered: selectedServices,
          availability: {
            days: selectedDays,
            times: selectedTimes,
          },
          location_zip: zip,
          max_travel_miles: radiusMiles,
          bio,
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
            <h1 className="text-3xl font-bold text-[#292524] mb-4">You&apos;re on the helper roster.</h1>
            <p className="text-lg text-[#57534E] mb-8">
              When a neighbor in Boulder needs the kind of help you&apos;re offering, Sage will reach out. Thank you for showing up for your community.
            </p>
            {needsBackgroundCheck && (
              <div className="bg-[#F5F0EB] border border-[#C5D4B5] rounded-xl p-5 mb-6 text-left">
                <p className="text-sm font-semibold text-[#292524] mb-1">Background check required</p>
                <p className="text-sm text-[#57534E]">
                  One or more services you selected (companionship visits, transportation) require a Colorado Bureau of Investigation (CBI) background check before your first in-person exchange. Our team will contact you with next steps — we cover the cost for founding members.
                </p>
              </div>
            )}
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

          {/* Header */}
          <div className="mb-8">
            <a href="/time-bank" className="text-sm text-[#4A6741] hover:underline mb-4 inline-block">&larr; Care Hours dashboard</a>
            <h1 className="text-3xl font-bold text-[#292524] mb-2">Offer help to a neighbor</h1>
            <p className="text-[#57534E]">
              Choose what you&apos;re comfortable doing, when you&apos;re available, and where you are in Boulder. When a family needs your kind of help, Sage will reach out.
            </p>
          </div>

          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {(["service", "availability", "location", "confirm"] as Step[]).map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  ["service", "availability", "location", "confirm"].indexOf(step) >= i
                    ? "bg-[#4A6741]"
                    : "bg-[#C5D4B5]/40"
                }`}
              />
            ))}
          </div>

          {/* Step: Service selection */}
          {step === "service" && (
            <div>
              <h2 className="text-lg font-bold text-[#292524] mb-4">What can you offer?</h2>
              <p className="text-sm text-[#57534E] mb-6">
                Select all that apply. Only Tier 1 services are available through the time bank — non-hands-on help that neighbors can provide without a home care license.
              </p>
              <div className="grid gap-3 mb-6">
                {TIER1_SERVICES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                      selectedServices.includes(service.id)
                        ? "border-[#4A6741] bg-[#4A6741]/5"
                        : "border-[#C5D4B5]/60 bg-white hover:border-[#4A6741]/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-[#292524] text-sm">{service.name}</p>
                        <p className="text-xs text-[#57534E] mt-0.5">{service.description}</p>
                        {service.requiresBackgroundCheck && (
                          <p className="text-xs text-[#4A6741] mt-1 font-medium">Background check required</p>
                        )}
                      </div>
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${
                        selectedServices.includes(service.id)
                          ? "border-[#4A6741] bg-[#4A6741]"
                          : "border-[#C5D4B5]"
                      }`}>
                        {selectedServices.includes(service.id) && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Tier 2 notice */}
              <div className="bg-[#F5F0EB] rounded-xl p-4 mb-6">
                <p className="text-sm font-semibold text-[#292524] mb-1">Hands-on care is not available through the time bank</p>
                <p className="text-sm text-[#57534E]">
                  Bathing assistance, transfers, medication management, and wound care require our licensed co-op.care caregivers. If your family needs hands-on care, start with a free assessment and we will match you with the right caregiver.
                </p>
              </div>

              <button
                onClick={() => setStep("availability")}
                disabled={selectedServices.length === 0}
                className="w-full py-3.5 bg-[#4A6741] text-white rounded-full font-medium hover:bg-[#292524] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue &rarr;
              </button>
            </div>
          )}

          {/* Step: Availability */}
          {step === "availability" && (
            <div>
              <h2 className="text-lg font-bold text-[#292524] mb-4">When are you available?</h2>
              <p className="text-sm text-[#57534E] mb-6">Select the days and times that generally work for you. You can always adjust when a specific request comes in.</p>
              <div className="mb-6">
                <p className="text-sm font-semibold text-[#292524] mb-3">Days of the week</p>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map((day) => (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                        selectedDays.includes(day)
                          ? "bg-[#4A6741] text-white border-[#4A6741]"
                          : "bg-white text-[#57534E] border-[#C5D4B5]/60 hover:border-[#4A6741]/40"
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-8">
                <p className="text-sm font-semibold text-[#292524] mb-3">Time of day</p>
                <div className="grid gap-2">
                  {TIMES.map((time) => (
                    <button
                      key={time}
                      onClick={() => toggleTime(time)}
                      className={`text-left px-4 py-3 rounded-xl text-sm border transition-colors ${
                        selectedTimes.includes(time)
                          ? "bg-[#4A6741]/5 border-[#4A6741] text-[#292524] font-medium"
                          : "bg-white text-[#57534E] border-[#C5D4B5]/60 hover:border-[#4A6741]/40"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("service")}
                  className="flex-1 py-3.5 border border-[#C5D4B5] text-[#57534E] rounded-full font-medium hover:border-[#4A6741] transition-colors"
                >
                  &larr; Back
                </button>
                <button
                  onClick={() => setStep("location")}
                  disabled={selectedDays.length === 0 || selectedTimes.length === 0}
                  className="flex-1 py-3.5 bg-[#4A6741] text-white rounded-full font-medium hover:bg-[#292524] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Step: Location */}
          {step === "location" && (
            <div>
              <h2 className="text-lg font-bold text-[#292524] mb-4">Where are you in Boulder?</h2>
              <p className="text-sm text-[#57534E] mb-6">We only match within your comfort zone. Your exact address is never shared — only your neighborhood.</p>
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#292524] mb-2">ZIP code</label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value.slice(0, 5))}
                  placeholder="80302"
                  className="w-full px-4 py-3 rounded-xl border border-[#C5D4B5] bg-white text-[#292524] placeholder-[#A8A29E] focus:outline-none focus:border-[#4A6741] text-sm"
                />
              </div>
              <div className="mb-5">
                <label className="block text-sm font-medium text-[#292524] mb-2">
                  How far will you travel? <span className="text-[#4A6741] font-bold">{radiusMiles} miles</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={1}
                  value={radiusMiles}
                  onChange={(e) => setRadiusMiles(Number(e.target.value))}
                  className="w-full h-2 bg-[#C5D4B5]/40 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#4A6741]"
                />
                <div className="flex justify-between text-xs text-[#A8A29E] mt-1">
                  <span>1 mi</span>
                  <span>15 mi</span>
                </div>
              </div>
              <div className="mb-8">
                <label className="block text-sm font-medium text-[#292524] mb-2">
                  A few words about yourself <span className="text-[#A8A29E] font-normal">(optional)</span>
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="I grew up helping my grandmother and understand how much a familiar face matters. Happy to drive to Boulder Community or just sit and talk."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-[#C5D4B5] bg-white text-[#292524] placeholder-[#A8A29E] focus:outline-none focus:border-[#4A6741] text-sm resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("availability")}
                  className="flex-1 py-3.5 border border-[#C5D4B5] text-[#57534E] rounded-full font-medium hover:border-[#4A6741] transition-colors"
                >
                  &larr; Back
                </button>
                <button
                  onClick={() => setStep("confirm")}
                  disabled={!zip || zip.length < 5}
                  className="flex-1 py-3.5 bg-[#4A6741] text-white rounded-full font-medium hover:bg-[#292524] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Review &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Step: Confirm */}
          {step === "confirm" && (
            <div>
              <h2 className="text-lg font-bold text-[#292524] mb-4">Review your offer</h2>
              <div className="bg-[#F5F0EB] rounded-2xl p-6 mb-6 space-y-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1">Services offered</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedServices.map((id) => (
                      <span key={id} className="text-sm px-3 py-1 bg-[#4A6741]/10 text-[#4A6741] rounded-full font-medium">
                        {TIER1_SERVICES.find((s) => s.id === id)?.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1">Availability</p>
                  <p className="text-sm text-[#292524]">
                    {selectedDays.join(", ")} &middot; {selectedTimes.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1">Location</p>
                  <p className="text-sm text-[#292524]">ZIP {zip} &middot; within {radiusMiles} miles</p>
                </div>
                {bio && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#57534E] mb-1">About you</p>
                    <p className="text-sm text-[#292524]">{bio}</p>
                  </div>
                )}
              </div>

              {needsBackgroundCheck && (
                <div className="bg-[#4A6741]/5 border border-[#C5D4B5] rounded-xl p-4 mb-6">
                  <p className="text-sm font-semibold text-[#292524] mb-1">A background check is required before your first exchange</p>
                  <p className="text-sm text-[#57534E]">
                    Companionship visits and transportation require a Colorado Bureau of Investigation (CBI) check. We will reach out to coordinate this — founding members pay nothing. You will be marked &ldquo;Pending Verification&rdquo; until cleared.
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep("location")}
                  className="flex-1 py-3.5 border border-[#C5D4B5] text-[#57534E] rounded-full font-medium hover:border-[#4A6741] transition-colors"
                >
                  &larr; Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 py-3.5 bg-[#4A6741] text-white rounded-full font-medium hover:bg-[#292524] transition-colors disabled:opacity-60"
                >
                  {submitting ? "Saving..." : "Join the helper roster"}
                </button>
              </div>
            </div>
          )}

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
