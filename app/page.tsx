"use client";

import { useState } from "react";

function HSACalculator() {
  const [monthlySpend, setMonthlySpend] = useState(500);
  const taxRate = 0.32;
  const annualSpend = monthlySpend * 12;
  const annualSavings = Math.round(annualSpend * taxRate);
  const monthlySavings = Math.round(monthlySpend * taxRate);

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-8">
        <label className="block text-sm font-medium text-white/60 mb-3">Monthly care spend</label>
        <input
          type="range"
          min={100}
          max={3000}
          step={50}
          value={monthlySpend}
          onChange={(e) => setMonthlySpend(Number(e.target.value))}
          className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sage-light"
        />
        <div className="flex justify-between text-xs text-white/30 mt-2">
          <span>$100/mo</span>
          <span className="text-white font-medium text-lg">${monthlySpend}/mo</span>
          <span>$3,000/mo</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-sage-light">${monthlySavings}</div>
          <div className="text-xs text-white/40 mt-1">saved per month</div>
        </div>
        <div className="bg-white/5 rounded-xl p-5 text-center">
          <div className="text-3xl font-bold text-sage-light">${annualSavings.toLocaleString()}</div>
          <div className="text-xs text-white/40 mt-1">saved per year</div>
        </div>
      </div>
      <p className="text-center text-white/30 text-xs mt-4">Based on 32% combined tax rate. HSA/FSA pays with pre-tax dollars — you keep the difference.</p>
    </div>
  );
}

const ENTRY_POINTS = [
  { q: "Does your back hurt?", a: "$10/month yoga in a neighbor's backyard", link: "https://www.doesyourbackhurt.com", color: "bg-[#0D9488]" },
  { q: "Tired of $5 kombucha?", a: "$2.50 from a garage tap. Zero waste.", link: "https://www.fillforward.com", color: "bg-[#D97706]" },
  { q: "Want to grow your own food?", a: "$89 mushroom incubator. Harvest in 25 days.", link: "https://www.sh-room.com", color: "bg-[#7A9166]" },
  { q: "HSA covers more than you think?", a: "Save 28-36% on care with ComfortCard.", link: "https://www.comfortcard.org", color: "bg-[#8B6914]" },
  { q: "Hip won't stop hurting?", a: "Free AI assessment. No login. Just answers.", link: "https://www.hippain.help", color: "bg-[#4A6741]" },
  { q: "Worried about falling?", a: "Free fall risk assessment. Stay independent.", link: "https://www.fallprevention.help", color: "bg-[#DC2626]" },
  { q: "Memory slipping?", a: "Free cognitive screening. Know where you stand.", link: "https://www.memoryloss.help", color: "bg-[#6B4C8A]" },
  { q: "Dog walker cancelled again?", a: "$12/walk. Same cooperative. Same trust.", link: "#services", color: "bg-sage-dark" },
  { q: "Want to earn $28/hr with equity?", a: "Become a caregiver-owner.", link: "#join", color: "bg-[#1B2A4A]" },
];

const SERVICES = [
  { name: "Companion Care", price: "$35/hr", note: "W-2 caregivers, physician-supervised" },
  { name: "Backyard Yoga", price: "$10/mo", note: "3x/week, ACCESS MSK eligible" },
  { name: "Kombucha Refill", price: "$2.50/pint", note: "Garage tap, zero waste" },
  { name: "Lawn Care", price: "$25/visit", note: "40-70% below market" },
  { name: "Snow Removal", price: "$30/visit", note: "Same workers, year-round" },
  { name: "Dog Walking", price: "$12/walk", note: "Same neighborhood, same trust" },
  { name: "Handyman", price: "$45/hr", note: "Vetted co-op members" },
  { name: "Grocery Run", price: "$18/trip", note: "Bulk buying for 5 families at once" },
  { name: "Tech Support", price: "$25/visit", note: "iPad setup, WiFi, telehealth" },
  { name: "Meal Delivery", price: "Included", note: "Community kitchen, during care visits" },
  { name: "Advance Directive", price: "Included", note: "CareGoals + physician review" },
  { name: "Emergency Profile", price: "Free", note: "ComfortCard NFC/QR, always" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-cream/90 backdrop-blur-md border-b border-sage-light/30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="co-op.care" className="w-8 h-8 rounded-md" />
            <span className="text-lg font-bold tracking-tight text-bark">co-op.care</span>
          </div>
          <a href="#join" className="text-sm px-4 py-2 bg-sage-dark text-white rounded-full hover:bg-bark transition-colors">Join the Cooperative</a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-bark leading-[1.1]">
            Nobody joins for
            <br /><span className="text-sage-dark">home care.</span>
          </h1>
          <p className="mt-6 text-xl text-bark-light leading-relaxed max-w-2xl mx-auto">
            They join because their back hurts. Because the kombucha is cheaper.
            Because Tuesday was lonely. The care is already there when they need it.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/interpret" className="px-6 py-3 rounded-full text-sm font-medium bg-sage-dark text-white hover:bg-bark transition-colors">Upload a report. Get answers.</a>
            <a href="#services" className="px-6 py-3 rounded-full text-sm font-medium bg-white text-bark border border-sage-light hover:border-sage transition-colors">Explore Services</a>
          </div>
          <p className="mt-3 text-xs text-bark-light/50">Boulder, CO. Worker-owned. Physician-supervised.</p>
        </div>
      </section>

      {/* Entry Points */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-bark text-center mb-4">Every front door leads here.</h2>
          <p className="text-bark-light text-center mb-12 max-w-lg mx-auto">25 websites. 25 pain points. One cooperative. Which one brought you?</p>
          <div className="grid sm:grid-cols-3 gap-3">
            {ENTRY_POINTS.map((ep) => (
              <a key={ep.q} href={ep.link} target={ep.link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                className="group p-5 rounded-2xl border border-sage-light/20 hover:border-sage/40 hover:shadow-lg transition-all bg-cream">
                <p className="font-semibold text-bark text-sm mb-2 group-hover:text-sage-dark transition-colors">{ep.q}</p>
                <p className="text-xs text-bark-light">{ep.a}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* The Spectrum */}
      <section className="py-20 px-6 bg-sage-dark text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">One person. One neighborhood. One health system.</h2>
          <p className="text-sage-light text-lg leading-relaxed mb-12">co-op.care works at every scale. The same infrastructure that serves one family serves an entire health system&apos;s discharge population.</p>

          <div className="flex flex-col gap-0 max-w-md mx-auto text-left">
            {[
              { scale: "You", desc: "Download the app. Have a conversation. Get a ComfortCard." },
              { scale: "Your family", desc: "Join for $59/mo. Yoga, kombucha, caregiver access, HSA savings." },
              { scale: "Your block", desc: "10 neighbors share a garage node. Refills, services, community." },
              { scale: "Your neighborhood", desc: "200 families. 10 garage nodes. $167K/year through the cooperative." },
              { scale: "Your health system", desc: "Reduced readmissions. Documented directives. Falls prevented. They partner because we produce the outcomes they're measured on." },
            ].map((item, i) => (
              <div key={item.scale} className="flex gap-4 py-5 border-b border-white/10">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-bold">{i + 1}</div>
                <div>
                  <div className="font-bold text-white">{item.scale}</div>
                  <div className="text-sage-light text-sm mt-1">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 px-6 bg-cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-bark text-center mb-4">Everything your neighborhood needs.</h2>
          <p className="text-bark-light text-center mb-12">All cooperative-owned. All 30%+ below market. All building equity.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SERVICES.map((s) => (
              <div key={s.name} className="bg-white rounded-xl p-5 border border-sage-light/20">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-semibold text-bark text-sm">{s.name}</span>
                  <span className="text-xs font-medium text-sage-dark">{s.price}</span>
                </div>
                <p className="text-xs text-bark-light">{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It's Different */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-bark text-center mb-12">Why this can&apos;t be bought.</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 bg-cream rounded-2xl">
              <h3 className="font-bold text-bark mb-2">Worker-owned</h3>
              <p className="text-sm text-bark-light">Caregivers earn $25-28/hr W-2 with equity. Industry average: $16/hr, 1099, no benefits. Our turnover target: 15%. Industry: 77%.</p>
            </div>
            <div className="p-6 bg-cream rounded-2xl">
              <h3 className="font-bold text-bark mb-2">Physician-supervised</h3>
              <p className="text-sm text-bark-light">Josh Emdur DO, 50-state licensed hospitalist. Every clinical output reviewed through ClinicalSwipe. AI drafts, physician decides.</p>
            </div>
            <div className="p-6 bg-cream rounded-2xl">
              <h3 className="font-bold text-bark mb-2">PE-proof</h3>
              <p className="text-sm text-bark-light">Colorado Limited Cooperative Association. 51% patron voting enforced by law. Can&apos;t be acquired. Can&apos;t be flipped. Can&apos;t extract.</p>
            </div>
            <div className="p-6 bg-cream rounded-2xl">
              <h3 className="font-bold text-bark mb-2">CMS-aligned</h3>
              <p className="text-sm text-bark-light">ACCESS MSK, LEAD, TEAM, BALANCE. Every major CMS innovation model points at the home. We built the home infrastructure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ComfortCard + Wallet */}
      <section className="py-20 px-6 bg-bark text-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">One card. Everything flows through it.</h2>
            <p className="text-white/50">ComfortCard is your care identity, your HSA/FSA payment, your cooperative equity, and your emergency profile.</p>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 sm:p-8 font-mono text-sm max-w-md mx-auto">
            <div className="text-white/30 text-xs mb-4">ComfortCard Wallet</div>
            <div className="space-y-2 mb-6">
              <div className="flex justify-between"><span className="text-white/50">HSA Balance</span><span>$3,240</span></div>
              <div className="flex justify-between"><span className="text-white/50">FSA Balance</span><span>$1,100</span></div>
              <div className="flex justify-between"><span className="text-white/50">Cooperative Equity</span><span className="text-sage-light">$847</span></div>
              <div className="flex justify-between"><span className="text-white/50">Time Bank</span><span>14 hrs</span></div>
              <div className="flex justify-between"><span className="text-white/50">This Month&apos;s Savings</span><span className="text-sage-light">$312</span></div>
            </div>
            <div className="border-t border-white/10 pt-4 space-y-1.5 text-xs">
              <div className="text-white/30 mb-2">Recent</div>
              <div className="flex justify-between"><span className="text-white/40">Tue: Yoga</span><span>$10 (HSA) +$0.30 eq</span></div>
              <div className="flex justify-between"><span className="text-white/40">Tue: Kombucha</span><span>$5.00 +$0.15 eq</span></div>
              <div className="flex justify-between"><span className="text-white/40">Wed: Lawn</span><span>$25 (HSA) +$0.75 eq</span></div>
              <div className="flex justify-between"><span className="text-white/40">Fri: Caregiver 4hrs</span><span>$140 (HSA) +$4.20 eq</span></div>
              <div className="flex justify-between"><span className="text-white/40">Sat: Time Bank</span><span>+2 hrs (tech support)</span></div>
            </div>
            <div className="border-t border-white/10 pt-4 mt-4 text-xs">
              <div className="text-white/30 mb-2">Upcoming Votes</div>
              <div className="text-white/60">Add Upstart Kombucha as provider? (Apr 12)</div>
              <div className="text-white/60">Lease community Cybercab? (Apr 20)</div>
            </div>
          </div>

          <p className="text-center text-white/30 text-xs mt-6">3% equity on every transaction. You own what you use.</p>
        </div>
      </section>

      {/* HSA Savings Calculator */}
      <section className="py-20 px-6 bg-sage-dark text-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">See what you save with HSA/FSA.</h2>
            <p className="text-sage-light text-lg">Care through co-op.care is HSA/FSA eligible. That means you pay with pre-tax dollars and keep 28-36% instantly.</p>
          </div>
          <HSACalculator />
        </div>
      </section>

      {/* The Mission */}
      <section id="community" className="py-20 px-6 bg-sage-50">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-sage-dark mb-4">The Mission</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-bark mb-6">Care and family are the mission.</h2>
          <p className="text-bark-light text-lg leading-relaxed mb-4">
            Everything else is economic gravity. The kombucha, the yoga, the HSA savings,
            the surgeon billing — it pulls people into community.
          </p>
          <p className="text-bark-light text-lg leading-relaxed">
            When you need care, the caregiver already knows your name.
            Because she taught your yoga class and filled your growler last Tuesday.
          </p>
        </div>
      </section>

      {/* Join */}
      <section id="join" className="py-20 px-6 bg-sage-dark text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join the cooperative.</h2>
          <p className="text-sage-light mb-8">Boulder, CO. Launching 2026. 10 garages. 200 families. Care everywhere.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <a href="#services" className="px-6 py-3 rounded-full text-sm font-medium bg-white text-sage-dark hover:bg-sage-50 transition-colors">Explore Services</a>
            <a href="#connector" className="px-6 py-3 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20 hover:border-white/50 transition-colors">Get the Connector</a>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-12 max-w-sm mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold">$59</div>
              <div className="text-sage-light/50 text-xs">per month</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">3%</div>
              <div className="text-sage-light/50 text-xs">equity/transaction</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">1</div>
              <div className="text-sage-light/50 text-xs">vote per member</div>
            </div>
          </div>
        </div>
      </section>

      {/* Connector */}
      <section id="connector" className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-bark mb-4">
            Get the co-op.care connector
          </h2>
          <p className="text-bark-light text-lg mb-8 max-w-xl mx-auto">
            Add the SolvingHealth connector to Claude and get instant access to care tools, HSA savings estimates, caregiver matching, and cooperative services.
          </p>
          <div className="bg-cream rounded-2xl border border-sage-light/30 p-6 text-left max-w-lg mx-auto mb-8">
            <p className="text-xs font-medium text-bark-light/50 uppercase tracking-wider mb-3">Claude Desktop MCP Config</p>
            <pre className="text-sm text-bark overflow-x-auto whitespace-pre font-mono leading-relaxed">{`"coop-care": {
  "command": "npx",
  "args": ["-y", "@anthropic-ai/mcp-remote",
    "https://www.solvinghealth.com/mcp"]
}`}</pre>
          </div>
          <p className="text-bark-light text-sm">
            Don&apos;t have Claude? Get it free at{" "}
            <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-sage-dark font-medium hover:underline">claude.ai</a>
            {" "}or use the chat and voice widgets on this page.
          </p>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="py-12 px-6 bg-bark">
        <div className="max-w-4xl mx-auto">
          <p className="text-white/20 text-xs text-center tracking-widest uppercase mb-6">The Ecosystem</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            <a href="https://www.solvinghealth.com" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60 transition-colors">solvinghealth.com</a>
            <a href="https://www.surgeonvalue.com" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60 transition-colors">surgeonvalue.com</a>
            <a href="https://www.comfortcard.org" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60 transition-colors">comfortcard.org</a>
            <a href="https://www.mapofyou.com" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60 transition-colors">mapofyou.com</a>
            <a href="https://www.sh-room.com" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60 transition-colors">sh-room.com</a>
            <a href="https://www.fillforward.com" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60 transition-colors">fillforward.com</a>
            <a href="https://www.opusocial.com" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60 transition-colors">opusocial.com</a>
            <a href="https://www.hippain.help" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60 transition-colors">hippain.help</a>
            <a href="https://www.fallprevention.help" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60 transition-colors">fallprevention.help</a>
            <a href="https://www.memoryloss.help" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-white/60 transition-colors">memoryloss.help</a>
          </div>
          <p className="text-center text-white/10 text-xs mt-8">Built entirely by AI. Boulder, Colorado.</p>
        </div>
      </section>
    </div>
  );
}
