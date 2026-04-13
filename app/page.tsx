"use client";

import { useState } from "react";

function HSACalculator() {
  const [monthlySpend, setMonthlySpend] = useState(500);
  const taxRate = 0.32;
  const annualSavings = Math.round(monthlySpend * 12 * taxRate);
  const monthlySavings = Math.round(monthlySpend * taxRate);

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <label className="block text-sm font-medium text-white/60 mb-3">
          Monthly care spend
        </label>
        <input
          type="range"
          min={100}
          max={3000}
          step={50}
          value={monthlySpend}
          onChange={(e) => setMonthlySpend(Number(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C5D4B5]"
        />
        <div className="flex justify-between text-xs text-white/30 mt-2">
          <span>$100/mo</span>
          <span className="text-white font-semibold text-lg">${monthlySpend}/mo</span>
          <span>$3,000/mo</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white/5 rounded-xl p-5 text-center border border-white/10">
          <div className="text-3xl font-bold text-[#C5D4B5]">${monthlySavings}</div>
          <div className="text-xs text-white/40 mt-1">saved per month</div>
        </div>
        <div className="bg-white/5 rounded-xl p-5 text-center border border-white/10">
          <div className="text-3xl font-bold text-[#C5D4B5]">${annualSavings.toLocaleString()}</div>
          <div className="text-xs text-white/40 mt-1">saved per year</div>
        </div>
      </div>
      <p className="text-center text-white/30 text-xs">
        Based on 32% combined tax rate. HSA/FSA pays with pre-tax dollars — you keep the difference.
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FEFCF6]">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FEFCF6]/95 backdrop-blur-md border-b border-[#C5D4B5]/40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/icon.svg" alt="co-op.care" className="w-8 h-8 rounded-lg" />
            <span className="text-base font-bold tracking-tight text-[#292524]">co-op.care</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/membership" className="hidden sm:block text-sm text-[#57534E] hover:text-[#4A7C59] transition-colors">Membership</a>
            <a href="/caregiver" className="hidden sm:block text-sm text-[#57534E] hover:text-[#4A7C59] transition-colors">Become a Caregiver</a>
            <a
              href="/assess"
              className="text-sm px-4 py-2 bg-[#4A6741] text-white rounded-full hover:bg-[#292524] transition-colors font-medium"
            >
              Free Assessment
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-[#4A6741] font-semibold mb-5">
            Boulder, CO &nbsp;·&nbsp; Worker-Owned &nbsp;·&nbsp; Physician-Supervised
          </p>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#292524] leading-[1.05] mb-6">
            The app that comes<br />
            <span className="text-[#4A6741]">with a caregiver.</span>
          </h1>
          <p className="text-xl text-[#57534E] leading-relaxed max-w-2xl mx-auto mb-10">
            $59/month membership. Pays for itself — save $936/year using HSA/FSA pre-tax dollars.
            When you need care, the caregiver already knows your name.
          </p>
          <a
            href="/assess"
            className="inline-block px-9 py-4 rounded-full text-base font-semibold bg-[#4A6741] text-white hover:bg-[#292524] transition-colors shadow-sm"
          >
            Talk to Sage about your family&apos;s care
          </a>
          <div className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#57534E]/60">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A6741] inline-block"></span>
              Free assessment
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A6741] inline-block"></span>
              HSA/FSA eligible
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A6741] inline-block"></span>
              No forms
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A6741] inline-block"></span>
              50-state physician oversight
            </span>
          </div>
        </div>
      </section>

      {/* The Story — 4-step journey */}
      <section className="py-20 px-6 bg-white border-y border-[#C5D4B5]/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase text-[#4A6741] font-semibold text-center mb-3">How it works</p>
          <h2 className="text-3xl font-bold text-[#292524] text-center mb-14">One conversation. Everything flows.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                n: "01",
                title: "Talk to Sage",
                desc: "No forms. Sage has a real conversation — learns about your mom, your schedule, what keeps you up at night."
              },
              {
                n: "02",
                title: "Get assessed",
                desc: "Free care needs assessment. Physician-reviewed. 10 minutes. Sage builds your family's living care profile."
              },
              {
                n: "03",
                title: "Get your LMN",
                desc: "Josh Emdur DO signs your Letter of Medical Necessity. Your HSA/FSA unlocks. Care costs 32% less immediately."
              },
              {
                n: "04",
                title: "Meet your caregiver",
                desc: "Matched from your neighborhood. She already knows the context. She earns equity for staying — and she stays."
              }
            ].map((step) => (
              <div key={step.n} className="bg-[#FEFCF6] rounded-2xl p-6 border border-[#C5D4B5]/30">
                <div className="text-3xl font-bold text-[#C5D4B5] mb-4 font-mono">{step.n}</div>
                <h3 className="font-bold text-[#292524] mb-2">{step.title}</h3>
                <p className="text-sm text-[#57534E] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Stack */}
      <section className="py-16 px-6 bg-[#F0F5EE]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase text-[#4A6741] font-semibold text-center mb-10">What $59/month gets you</p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#C5D4B5]/40 text-center">
              <div className="text-2xl font-bold text-[#4A6741] mb-1">$199</div>
              <div className="font-semibold text-[#292524] text-sm mb-2">LMN for HSA/FSA</div>
              <div className="text-xs text-[#57534E] leading-relaxed">
                Physician-signed Letter of Medical Necessity. Unlocks pre-tax savings on care you&apos;re already paying for.
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#C5D4B5]/40 text-center">
              <div className="text-2xl font-bold text-[#4A6741] mb-1">$400–12K/mo</div>
              <div className="font-semibold text-[#292524] text-sm mb-2">Companion Care</div>
              <div className="text-xs text-[#57534E] leading-relaxed">
                W-2 caregivers earning $25–28/hr plus equity. Physician-supervised. From your neighborhood.
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#C5D4B5]/40 text-center">
              <div className="text-2xl font-bold text-[#4A6741] mb-1">$936/yr</div>
              <div className="font-semibold text-[#292524] text-sm mb-2">Average HSA Savings</div>
              <div className="text-xs text-[#57534E] leading-relaxed">
                Pay for care with pre-tax dollars. The $59/mo membership pays for itself many times over.
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <a
              href="/membership"
              className="inline-block text-sm font-medium text-[#4A6741] hover:text-[#292524] transition-colors underline underline-offset-4"
            >
              See full membership breakdown
            </a>
          </div>
        </div>
      </section>

      {/* The Cooperative Difference */}
      <section className="py-20 px-6 bg-[#4A6741] text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.25em] uppercase text-[#C5D4B5] font-semibold mb-3">The cooperative difference</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Caregivers stay because they own it.</h2>
            <p className="text-[#C5D4B5] text-lg max-w-xl mx-auto">
              Home care has 77% annual turnover. Families lose caregivers constantly.
              We built a different structure — one where staying is in everyone&apos;s interest.
            </p>
          </div>

          {/* Turnover stat */}
          <div className="bg-white/10 rounded-2xl p-6 text-center mb-10 max-w-sm mx-auto border border-white/20">
            <div className="text-xs text-[#C5D4B5] mb-3 uppercase tracking-wider">Industry turnover</div>
            <div className="flex items-center justify-center gap-6">
              <div>
                <div className="text-4xl font-bold text-white/40 line-through">77%</div>
                <div className="text-xs text-white/40 mt-1">traditional agency</div>
              </div>
              <div className="text-[#C5D4B5] text-xl">→</div>
              <div>
                <div className="text-4xl font-bold text-[#C5D4B5]">35–40%</div>
                <div className="text-xs text-[#C5D4B5] mt-1">co-op.care</div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-white/8 rounded-2xl p-6 border border-white/15">
              <div className="mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#C5D4B5]">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-white mb-2">Worker-owned</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Caregivers earn $25–28/hr W-2 with cooperative equity. Every hour builds their ownership stake. After 90 days, they vote on how the cooperative runs.
              </p>
            </div>
            <div className="bg-white/8 rounded-2xl p-6 border border-white/15">
              <div className="mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#C5D4B5]">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-white mb-2">Physician-supervised</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Josh Emdur DO — licensed in all 50 states, BCH hospitalist since 2008 — reviews every clinical output before delivery. AI drafts. He decides.
              </p>
            </div>
            <div className="bg-white/8 rounded-2xl p-6 border border-white/15">
              <div className="mb-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#C5D4B5]">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-white mb-2">PE-proof structure</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Colorado Limited Cooperative Association. 51% patron voting enforced by law. Cannot be acquired. Cannot be flipped. Cannot extract.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HSA Savings Calculator */}
      <section className="py-20 px-6 bg-[#292524] text-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.25em] uppercase text-[#C5D4B5] font-semibold mb-3">HSA/FSA Calculator</p>
            <h2 className="text-3xl font-bold mb-4">See what you save.</h2>
            <p className="text-white/50 text-lg">
              Care through co-op.care is HSA/FSA eligible. Pay with pre-tax dollars and keep 28–36% instantly.
            </p>
          </div>
          <HSACalculator />
          <div className="text-center mt-10">
            <a
              href="/assess"
              className="inline-block px-8 py-4 rounded-full bg-[#4A6741] text-white font-semibold hover:bg-[#4A7C59] transition-colors"
            >
              Get your free LMN assessment
            </a>
          </div>
        </div>
      </section>

      {/* The Story — Dorothy */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs tracking-[0.25em] uppercase text-[#4A6741] font-semibold mb-3">A real family</p>
          <h2 className="text-3xl font-bold text-[#292524] mb-8">
            Sarah was worried about her mom.<br />
            <span className="text-[#4A6741]">She found co-op.care.</span>
          </h2>
          <div className="space-y-6 text-[#57534E] leading-relaxed">
            <p className="text-lg">
              Her mother was 79, living alone in Boulder. Falls risk. Cognitive decline starting.
              Sarah was flying in from Chicago every few months, losing sleep in between.
            </p>
            <p>
              She talked to Sage. No forms — just a real conversation about her mom&apos;s situation.
              Within a week, her mom had a care assessment, a physician-signed LMN unlocking her HSA,
              and a caregiver named Maria who lived four blocks away.
            </p>
            <p>
              Maria had been a caregiver-owner for six months. She knew the neighborhood. She had equity
              in the cooperative. She wasn&apos;t going anywhere.
            </p>
            <p className="font-semibold text-[#292524]">
              Sarah still calls weekly. But she sleeps through the night now.
            </p>
          </div>
          <div className="mt-10">
            <a
              href="/assess"
              className="inline-block px-8 py-4 rounded-full bg-[#4A6741] text-white font-semibold hover:bg-[#292524] transition-colors"
            >
              Start with a free assessment
            </a>
          </div>
        </div>
      </section>

      {/* What gets recorded */}
      <section className="py-20 px-6 bg-[#F0F5EE]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.25em] uppercase text-[#4A6741] font-semibold mb-3">The living profile</p>
            <h2 className="text-3xl font-bold text-[#292524] mb-4">Her stories get recorded. Her wishes are documented.</h2>
            <p className="text-[#57534E] text-lg max-w-2xl mx-auto">
              CareGoals and ComfortCard work together. Your family&apos;s care preferences, advance directive,
              and emergency profile — all built from natural conversations with Sage.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-6 border border-[#C5D4B5]/40">
              <div className="mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#4A6741]">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="14 2 14 8 20 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-[#292524] mb-2">Advance directive</h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                The advance directive writes itself — from conversations with Sage about what matters to her.
                Physician-reviewed. Legally binding.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#C5D4B5]/40">
              <div className="mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#4A6741]">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-[#292524] mb-2">Stories preserved</h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                Sage captures stories during care visits. Her recipes, her memories, her values.
                Living archive for family — not just a medical record.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#C5D4B5]/40">
              <div className="mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-[#4A6741]">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 10h.01M12 10h.01M8 10h.01M16 14h.01M12 14h.01M8 14h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-[#292524] mb-2">ComfortCard</h3>
              <p className="text-sm text-[#57534E] leading-relaxed">
                QR + NFC emergency profile. Every first responder sees her allergies, medications,
                healthcare proxy, and wishes — instantly, from her wallet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA + Join */}
      <section id="join" className="py-20 px-6 bg-[#292524] text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Start with a conversation.</h2>
          <p className="text-white/50 text-lg mb-10">
            Boulder, CO. Launching 2026. $59/month. Your first assessment is always free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <a
              href="/assess"
              className="px-8 py-4 rounded-full font-semibold bg-[#4A6741] text-white hover:bg-[#4A7C59] transition-colors"
            >
              Free assessment — no forms
            </a>
            <a
              href="/membership"
              className="px-8 py-4 rounded-full font-semibold bg-white/10 text-white border border-white/20 hover:border-white/50 transition-colors"
            >
              See $59/mo membership
            </a>
            <a
              href="/caregiver"
              className="px-8 py-4 rounded-full font-semibold bg-white/10 text-white border border-white/20 hover:border-white/50 transition-colors"
            >
              Become a caregiver-owner
            </a>
          </div>
          <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold">$59</div>
              <div className="text-white/30 text-xs mt-1">per month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">1</div>
              <div className="text-white/30 text-xs mt-1">vote per member</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">50</div>
              <div className="text-white/30 text-xs mt-1">states covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem footer strip */}
      <section className="py-10 px-6 bg-[#1a1715]">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/20 text-xs text-center tracking-widest uppercase mb-5">Part of the SolvingHealth ecosystem</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {[
              { label: "solvinghealth.com", href: "https://solvinghealth.com" },
              { label: "comfortcard.org", href: "https://comfortcard.org" },
              { label: "caregoals.com", href: "https://caregoals.com" },
              { label: "hsaletter.com", href: "https://hsaletter.com" },
              { label: "altru.care", href: "https://altru.care" },
              { label: "surgeonvalue.com", href: "https://surgeonvalue.com" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/20 hover:text-white/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <p className="text-center text-white/10 text-xs mt-6">
            co-op.care Technologies LLC — Boulder, Colorado. Worker-owned. Physician-supervised.
          </p>
        </div>
      </section>

    </div>
  );
}
