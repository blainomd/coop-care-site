import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Membership — co-op.care | $59/month",
  description: "Everything $59/month gets you: free assessment, LMN for HSA/FSA, companion care access, physician oversight, cooperative equity.",
};

const INCLUDED = [
  {
    category: "Physician platform",
    items: [
      { name: "Free care needs assessment", detail: "Sage conversation → physician-reviewed care plan. Delivered within 1 business day." },
      { name: "Letter of Medical Necessity (LMN)", detail: "Josh Emdur DO signs your LMN. Unlocks HSA/FSA for companion care, home health, and more. $199 value — included in membership." },
      { name: "50-state physician oversight", detail: "Every clinical output — assessments, LMNs, care summaries — reviewed by a licensed physician before delivery." },
      { name: "Annual re-assessment", detail: "Needs change. Sage checks in. Your care plan stays current." },
    ],
  },
  {
    category: "Companion care",
    items: [
      { name: "Caregiver matching", detail: "AI matches you with a caregiver from your neighborhood based on skills, schedule, and proximity." },
      { name: "W-2 caregiver network", detail: "$25–28/hr caregivers with cooperative equity. They stay because they own it." },
      { name: "Companion care access", detail: "$400–12,000/month depending on hours. Companion, homemaker, and personal care services. HSA/FSA eligible via your LMN." },
      { name: "Caregiver continuity guarantee", detail: "Your caregiver doesn't change unless you ask. Relationship first." },
    ],
  },
  {
    category: "Living profile",
    items: [
      { name: "CareGoals conversations", detail: "Sage builds your advance care preferences from natural conversation. Your values, your wishes, your words." },
      { name: "ComfortCard emergency profile", detail: "QR + NFC emergency identity. Medications, allergies, healthcare proxy, DNR — available to any first responder in seconds." },
      { name: "Story archive", detail: "Sage captures stories during care visits. Recipes, memories, family history — preserved, not just documented." },
      { name: "Advance directive drafting", detail: "Physician-reviewed. Legally binding. Built from your conversations with Sage, not a form you fill out alone." },
    ],
  },
  {
    category: "Financial",
    items: [
      { name: "HSA/FSA savings calculator", detail: "See exactly how much pre-tax dollars save on your specific care plan before you commit." },
      { name: "Cooperative equity", detail: "3% of every transaction flows back as cooperative equity. You own what you use." },
      { name: "Member pricing on all services", detail: "30%+ below market on companion care, lawn, handyman, tech support, and more." },
    ],
  },
];

const TIERS = [
  {
    name: "Assessment only",
    price: "Free",
    desc: "Talk to Sage. Get a care assessment. No commitment.",
    items: ["Sage care conversation", "Care needs assessment", "Physician-reviewed summary"],
    cta: "Start free",
    href: "/assess",
    highlight: false,
  },
  {
    name: "Member",
    price: "$59/mo",
    desc: "Everything — LMN, care access, living profile, cooperative membership.",
    items: [
      "Everything in free assessment",
      "LMN for HSA/FSA ($199 value)",
      "Caregiver matching + access",
      "CareGoals + ComfortCard",
      "Advance directive drafting",
      "Cooperative equity (3%/transaction)",
      "Member pricing on all services",
    ],
    cta: "Join the cooperative",
    href: "/assess",
    highlight: true,
  },
  {
    name: "Founding Member",
    price: "$499/yr",
    desc: "Locked rate for 3 years. For Boulder families who want to shape the cooperative.",
    items: [
      "Everything in Member",
      "Locked rate — 3 years",
      "Founding member recognition",
      "Priority caregiver matching",
      "Direct line to Sage (priority)",
    ],
    cta: "Reserve founding spot",
    href: "/assess",
    highlight: false,
  },
];

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-[#FEFCF6]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FEFCF6]/95 backdrop-blur-md border-b border-[#C5D4B5]/40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/icon.svg" alt="co-op.care" className="w-8 h-8 rounded-lg" />
            <span className="text-base font-bold tracking-tight text-[#292524]">co-op.care</span>
          </a>
          <a
            href="/assess"
            className="text-sm px-4 py-2 bg-[#4A6741] text-white rounded-full hover:bg-[#292524] transition-colors font-medium"
          >
            Free Assessment
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 bg-white border-b border-[#C5D4B5]/30">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-[#4A6741] font-semibold mb-4">Membership</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#292524] tracking-tight leading-tight mb-5">
            $59/month.<br />
            <span className="text-[#4A6741]">Pays for itself the first month.</span>
          </h1>
          <p className="text-xl text-[#57534E] leading-relaxed max-w-2xl mx-auto mb-8">
            The LMN alone ($199 value) is included in your first month. Unlock HSA/FSA pre-tax savings
            and get a caregiver who stays — because she owns part of the company.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-[#57534E]">
              <span className="w-2 h-2 rounded-full bg-[#4A6741] inline-block"></span>
              Cancel any time
            </div>
            <div className="flex items-center gap-2 text-[#57534E]">
              <span className="w-2 h-2 rounded-full bg-[#4A6741] inline-block"></span>
              First assessment always free
            </div>
            <div className="flex items-center gap-2 text-[#57534E]">
              <span className="w-2 h-2 rounded-full bg-[#4A6741] inline-block"></span>
              No long-term contract
            </div>
          </div>
        </div>
      </section>

      {/* Pricing tiers */}
      <section className="py-20 px-6 bg-[#F0F5EE]">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-5">
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-7 flex flex-col ${
                  tier.highlight
                    ? "bg-[#4A6741] text-white border-2 border-[#4A6741] shadow-lg"
                    : "bg-white border-2 border-[#C5D4B5]/40"
                }`}
              >
                {tier.highlight && (
                  <span className="inline-block text-xs font-bold tracking-wider uppercase bg-white/20 text-white px-3 py-1 rounded-full mb-4 w-fit">
                    Most popular
                  </span>
                )}
                <div className="mb-1">
                  <span className={`text-xs font-semibold tracking-wider uppercase ${tier.highlight ? "text-[#C5D4B5]" : "text-[#4A6741]"}`}>
                    {tier.name}
                  </span>
                </div>
                <div className={`text-4xl font-bold mb-2 ${tier.highlight ? "text-white" : "text-[#292524]"}`}>
                  {tier.price}
                </div>
                <p className={`text-sm mb-6 leading-relaxed ${tier.highlight ? "text-white/70" : "text-[#57534E]"}`}>
                  {tier.desc}
                </p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`shrink-0 mt-0.5 ${tier.highlight ? "text-[#C5D4B5]" : "text-[#4A6741]"}`}
                      >
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className={tier.highlight ? "text-white/80" : "text-[#57534E]"}>{item}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={tier.href}
                  className={`block text-center py-3.5 rounded-full font-semibold transition-colors ${
                    tier.highlight
                      ? "bg-white text-[#4A6741] hover:bg-[#F0F5EE]"
                      : "bg-[#4A6741] text-white hover:bg-[#292524]"
                  }`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full what's included */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#292524] mb-12">Everything that comes with membership.</h2>
          <div className="space-y-12">
            {INCLUDED.map((group) => (
              <div key={group.category}>
                <h3 className="text-xs font-bold tracking-[0.25em] uppercase text-[#4A6741] mb-5">
                  {group.category}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {group.items.map((item) => (
                    <div key={item.name} className="bg-[#FEFCF6] rounded-xl p-5 border border-[#C5D4B5]/30">
                      <div className="font-semibold text-[#292524] mb-1.5">{item.name}</div>
                      <div className="text-sm text-[#57534E] leading-relaxed">{item.detail}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HSA math */}
      <section className="py-20 px-6 bg-[#292524] text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">The math on HSA savings.</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-start py-4 border-b border-white/10">
              <div>
                <div className="font-semibold">Monthly membership</div>
                <div className="text-sm text-white/40">12 months</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-white/60">$708/yr</div>
              </div>
            </div>
            <div className="flex justify-between items-start py-4 border-b border-white/10">
              <div>
                <div className="font-semibold">LMN value (included)</div>
                <div className="text-sm text-white/40">Physician-signed, 1x/year</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#C5D4B5]">-$199</div>
              </div>
            </div>
            <div className="flex justify-between items-start py-4 border-b border-white/10">
              <div>
                <div className="font-semibold">HSA/FSA tax savings</div>
                <div className="text-sm text-white/40">32% on $500/mo care spend</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-[#C5D4B5]">-$1,920/yr</div>
              </div>
            </div>
            <div className="flex justify-between items-start pt-4">
              <div className="font-bold text-lg">Net cost of membership</div>
              <div className="text-right">
                <div className="font-bold text-2xl text-[#C5D4B5]">-$1,411/yr</div>
                <div className="text-xs text-white/30">You come out ahead</div>
              </div>
            </div>
          </div>
          <p className="mt-8 text-white/30 text-xs">
            Assumes 32% combined federal + state tax rate and $500/month care spend.
            Actual savings depend on your tax situation. Not tax advice — consult your accountant.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#F0F5EE] text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-bold text-[#292524] mb-4">Ready to start?</h2>
          <p className="text-[#57534E] mb-8">
            Your first assessment is free. No credit card. No commitment.
            Sage will reach out within one business day.
          </p>
          <a
            href="/assess"
            className="inline-block px-9 py-4 rounded-full bg-[#4A6741] text-white font-semibold hover:bg-[#292524] transition-colors text-base"
          >
            Start free — talk to Sage
          </a>
          <p className="mt-4 text-sm text-[#57534E]/40">
            Already a member?{" "}
            <a href="https://app.co-op.care" className="text-[#4A6741] hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 bg-[#292524]">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm mb-4">
          <a href="/" className="text-white/30 hover:text-white/60 transition-colors">Home</a>
          <a href="/assess" className="text-white/30 hover:text-white/60 transition-colors">Free Assessment</a>
          <a href="/caregiver" className="text-white/30 hover:text-white/60 transition-colors">Become a Caregiver</a>
          <a href="https://comfortcard.org" target="_blank" rel="noopener noreferrer" className="text-white/30 hover:text-white/60 transition-colors">ComfortCard</a>
        </div>
        <p className="text-center text-white/10 text-xs">co-op.care Technologies LLC — Boulder, Colorado. Worker-owned. Physician-supervised.</p>
      </footer>
    </div>
  );
}
