"use client";

import { useState } from "react";

const COMPARISON = [
  { label: "Pay", agency: "$12–15/hr", coop: "$25–28/hr" },
  { label: "Benefits", agency: "None", coop: "W-2 + health insurance" },
  { label: "Equity", agency: "0%", coop: "Cooperative ownership" },
  { label: "Turnover", agency: "77% leave every year", coop: "You stay because you own it" },
  { label: "Schedule", agency: "Their choice", coop: "Your choice" },
  { label: "Voice", agency: "None", coop: "You vote on how we run" },
];

const STEPS = [
  { n: 1, title: "Apply", desc: "Fill out the form below. Name, zip code, availability — that's it.", time: "5 minutes" },
  { n: 2, title: "Background check + training", desc: "We run a standard background check and pair you with a mentor for hands-on training.", time: "1–2 weeks" },
  { n: 3, title: "Get matched", desc: "Our AI matches you with families in your neighborhood based on skills, schedule, and proximity.", time: "Your area, your hours" },
  { n: 4, title: "Start earning + building equity", desc: "Every hour you work, you earn pay AND ownership. This is your company now.", time: "Day 1" },
];

const EQUITY_MILESTONES = [
  { title: "Start earning", desc: "First check arrives within 2 weeks. $25–28/hr, W-2, every shift." },
  { title: "Earn your vote", desc: "After 90 days, you become a full patron member. One vote. No exceptions." },
  { title: "Full member-owner", desc: "Quarterly equity distributions. Your share of the cooperative grows every year you stay." },
];

const FAQS = [
  { q: "Do I need caregiving experience?", a: "No. We train you. If you've cared for a family member, that counts. What matters is showing up reliably and treating people with dignity." },
  { q: "What does 'worker-owned' actually mean?", a: "You get equity. Every hour you work builds your ownership stake. After 90 days, you can vote on cooperative decisions — pay rates, provider partnerships, how profits are distributed." },
  { q: "Is this W-2 or 1099?", a: "W-2. Always. You get a real paycheck, taxes withheld, and you're eligible for our health insurance after 60 days." },
  { q: "What's the pay timeline?", a: "Direct deposit every two weeks. First check within 14 days of your first shift." },
  { q: "Where do I work?", a: "Boulder, CO and surrounding areas. We match you with families within a reasonable distance of your zip code." },
  { q: "What if I already have another job?", a: "Many of our caregivers work part-time. You set your availability. Minimum 10 hours/week to qualify for health insurance." },
];

export default function CaregiverPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", zip: "",
    experience: "", languages: "",
    availability: [] as string[],
    certs: [] as string[],
    why: "",
  });

  function handleCheck(field: "availability" | "certs", value: string) {
    setFormData((prev) => {
      const arr = prev[field];
      return {
        ...prev,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production, POST to API route
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
          <div className="flex items-center gap-3">
            <a href="/" className="hidden sm:block text-sm text-[#57534E] hover:text-[#4A6741] transition-colors">For families</a>
            <a href="#apply" className="text-sm px-4 py-2 bg-[#4A6741] text-white rounded-full hover:bg-[#292524] transition-colors font-medium">Apply Now</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block bg-sage-50 text-sage-dark text-xs font-semibold px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase">Now hiring in Boulder, CO</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-bark leading-[1.1]">
            Earn $27/hr +<br />
            <span className="text-sage-dark">own part of the company.</span>
          </h1>
          <p className="mt-6 text-xl text-bark-light leading-relaxed max-w-2xl mx-auto">
            co-op.care is a worker-owned home care cooperative. You&apos;re not an employee — you&apos;re an owner.
            Help families in your neighborhood and build equity every hour you work.
          </p>
          <a href="#apply" className="mt-10 inline-block px-8 py-4 rounded-full text-base font-bold bg-sage-dark text-white hover:bg-bark transition-colors shadow-md">
            Apply in 5 minutes
          </a>
          <p className="mt-4 text-sm text-bark-light/50">No experience required. W-2 employment. Health insurance included.</p>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-6 bg-cream">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-sage-dark mb-3 font-semibold">Why co-op.care</p>
          <h2 className="text-3xl font-bold text-bark mb-3">What you get vs. a traditional agency</h2>
          <p className="text-bark-light mb-10">Home care has a 77% annual turnover rate. We built something different.</p>

          <div className="overflow-x-auto rounded-2xl shadow-sm border border-sage-light/30">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="bg-bark-light/10 text-bark-light font-semibold text-left px-5 py-3"></th>
                  <th className="bg-bark text-white/60 font-semibold text-left px-5 py-3">Traditional Agency</th>
                  <th className="bg-sage-dark text-white font-semibold text-left px-5 py-3">co-op.care</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-cream"}>
                    <td className="px-5 py-4 font-semibold text-bark">{row.label}</td>
                    <td className="px-5 py-4 text-bark-light">{row.agency}</td>
                    <td className="px-5 py-4 text-sage-dark font-semibold">{row.coop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-sage-dark mb-3 font-semibold">How it works</p>
          <h2 className="text-3xl font-bold text-bark mb-12">From neighbor to owner in 4 steps</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div key={step.n} className="bg-cream rounded-2xl p-6 text-center border border-sage-light/20 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-full bg-sage-50 text-sage-dark flex items-center justify-center text-xl font-bold mx-auto mb-4">{step.n}</div>
                <h3 className="font-bold text-bark mb-2">{step.title}</h3>
                <p className="text-sm text-bark-light">{step.desc}</p>
                <span className="inline-block mt-3 text-xs font-semibold text-sage-dark bg-sage-50 px-3 py-1 rounded-full">{step.time}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-20 px-6 bg-cream">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.3em] uppercase text-sage-dark mb-3 font-semibold">Apply now</p>
          <h2 className="text-3xl font-bold text-bark mb-2">Join your neighborhood care team</h2>
          <p className="text-bark-light mb-10">Takes about 5 minutes. No resume needed.</p>

          <div className="bg-white rounded-2xl p-8 border border-sage-light/20 shadow-sm">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-sage-50 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-sage-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-bark mb-3">Application received!</h3>
                <p className="text-bark-light">Thank you for your interest in becoming a caregiver-owner. We&apos;ll be in touch within 48 hours to talk next steps.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-bark mb-1.5">First name</label>
                    <input
                      type="text" required placeholder="Maria"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-sage-light/40 focus:border-sage-dark focus:outline-none text-bark bg-cream transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-bark mb-1.5">Last name</label>
                    <input
                      type="text" required placeholder="Garcia"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-sage-light/40 focus:border-sage-dark focus:outline-none text-bark bg-cream transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-bark mb-1.5">Email</label>
                  <input
                    type="email" required placeholder="maria@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-sage-light/40 focus:border-sage-dark focus:outline-none text-bark bg-cream transition-colors"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-bark mb-1.5">Phone</label>
                    <input
                      type="tel" required placeholder="(303) 555-1234"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-sage-light/40 focus:border-sage-dark focus:outline-none text-bark bg-cream transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-bark mb-1.5">Zip code</label>
                    <input
                      type="text" required placeholder="80302" pattern="[0-9]{5}" maxLength={5}
                      value={formData.zip}
                      onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-sage-light/40 focus:border-sage-dark focus:outline-none text-bark bg-cream transition-colors"
                    />
                    <p className="text-xs text-bark-light/50 mt-1">For matching you with nearby families</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-bark mb-1.5">Experience level</label>
                  <select
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-sage-light/40 focus:border-sage-dark focus:outline-none text-bark bg-cream transition-colors"
                  >
                    <option value="" disabled>Select one</option>
                    <option value="none">No caregiving experience — that&apos;s okay!</option>
                    <option value="informal">Informal (cared for a family member)</option>
                    <option value="some">Some professional experience (1–3 years)</option>
                    <option value="experienced">Experienced professional (3+ years)</option>
                  </select>
                </div>

                <div>
                  <p className="text-sm font-semibold text-bark mb-2">Availability</p>
                  <div className="flex flex-wrap gap-2">
                    {["Weekday mornings", "Weekday afternoons", "Evenings", "Weekends", "Overnights", "Flexible"].map((slot) => {
                      const val = slot.toLowerCase().replace(" ", "-");
                      const checked = formData.availability.includes(val);
                      return (
                        <label key={val} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-full border-2 cursor-pointer transition-all ${checked ? "border-sage-dark bg-sage-50 text-sage-dark font-semibold" : "border-sage-light/30 text-bark-light"}`}>
                          <input type="checkbox" className="sr-only" checked={checked} onChange={() => handleCheck("availability", val)} />
                          {slot}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-bark mb-1.5">Languages spoken</label>
                  <input
                    type="text" placeholder="English, Spanish"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-sage-light/40 focus:border-sage-dark focus:outline-none text-bark bg-cream transition-colors"
                  />
                  <p className="text-xs text-bark-light/50 mt-1">Comma-separated</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-bark mb-2">Certifications (optional)</p>
                  <div className="flex flex-wrap gap-2">
                    {["CNA", "HHA", "CPR/First Aid", "Other"].map((cert) => {
                      const val = cert.toLowerCase().replace("/", "-");
                      const checked = formData.certs.includes(val);
                      return (
                        <label key={val} className={`flex items-center gap-2 text-sm px-3 py-2 rounded-full border-2 cursor-pointer transition-all ${checked ? "border-sage-dark bg-sage-50 text-sage-dark font-semibold" : "border-sage-light/30 text-bark-light"}`}>
                          <input type="checkbox" className="sr-only" checked={checked} onChange={() => handleCheck("certs", val)} />
                          {cert}
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-bark mb-1.5">What draws you to caregiving?</label>
                  <textarea
                    rows={4}
                    placeholder="My grandmother lived with us growing up. I saw how much it meant to her to stay in her own home..."
                    value={formData.why}
                    onChange={(e) => setFormData({ ...formData, why: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-sage-light/40 focus:border-sage-dark focus:outline-none text-bark bg-cream transition-colors resize-y"
                  />
                </div>

                <button type="submit" className="w-full py-4 rounded-xl bg-sage-dark text-white font-bold text-base hover:bg-bark transition-colors">
                  Submit Application
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Equity milestones */}
      <section className="py-20 px-6 bg-bark text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">This isn&apos;t a gig — it&apos;s YOUR company.</h2>
          <p className="text-white/40 mb-12">Ownership is structural. It&apos;s in the bylaws.</p>
          <div className="grid sm:grid-cols-3 gap-6">
            {EQUITY_MILESTONES.map((m) => (
              <div key={m.title} className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-white mb-2">{m.title}</h3>
                <p className="text-sm text-white/50">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-bark mb-12">Common questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <div key={faq.q} className="bg-cream rounded-2xl p-6 border border-sage-light/20">
                <h3 className="font-bold text-bark mb-2">{faq.q}</h3>
                <p className="text-sm text-bark-light">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-sage-dark text-white text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to own your work?</h2>
          <p className="text-sage-light mb-8">Join Boulder&apos;s first worker-owned home care cooperative.</p>
          <a href="#apply" className="inline-block px-8 py-4 rounded-full bg-white text-sage-dark font-bold hover:bg-sage-50 transition-colors">
            Apply Now — 5 minutes
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-bark">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mb-4">
            <a href="/" className="text-white/30 hover:text-white/60 transition-colors">co-op.care</a>
            <a href="/caregiver" className="text-white/60 hover:text-white transition-colors font-medium">Become a Caregiver</a>
            <a href="/document" className="text-white/30 hover:text-white/60 transition-colors">Visit Documentation</a>
            <a href="https://comfortcard.org" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors">ComfortCard</a>
          </div>
          <p className="text-white/20 text-xs">The health system that works for you — instead of you working for it.</p>
          <p className="text-white/10 text-xs mt-2">Physician-governed AI. HIPAA compliant. co-op.care Technologies LLC.</p>
        </div>
      </footer>
    </div>
  );
}
