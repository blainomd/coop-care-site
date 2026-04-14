import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Care Hours — co-op.care Time Bank",
  description:
    "Give a neighbor an hour. Earn an hour back. The co-op.care time bank connects Boulder families through shared care — companionship, transportation, meals, errands, and more.",
};

const DISCLAIMER = "Care Hours are not a substitute for licensed medical care. Hands-on personal care requires co-op.care licensed caregivers.";

function DisclaimerBar() {
  return (
    <div className="w-full bg-[#F5F0EB] border-t border-[#C5D4B5]/60 px-6 py-3">
      <p className="text-xs text-[#57534E] text-center max-w-3xl mx-auto">
        {DISCLAIMER}
      </p>
    </div>
  );
}

// Mock data — replace with Supabase fetch via server component or API call
const MOCK_BALANCE = 4.5;
const MOCK_LIFETIME_EARNED = 12.0;
const MOCK_LIFETIME_SPENT = 7.5;
const MOCK_TRANSACTIONS = [
  {
    id: "1",
    type: "earned",
    description: "Companionship visit",
    counterpart: "A neighbor",
    hours: 2.0,
    date: "Apr 11, 2026",
    status: "confirmed",
  },
  {
    id: "2",
    type: "spent",
    description: "Transportation",
    counterpart: "A neighbor",
    hours: 1.5,
    date: "Apr 9, 2026",
    status: "confirmed",
  },
  {
    id: "3",
    type: "earned",
    description: "Grocery shopping / errands",
    counterpart: "A neighbor",
    hours: 1.0,
    date: "Apr 7, 2026",
    status: "confirmed",
  },
  {
    id: "4",
    type: "earned",
    description: "Technology assistance",
    counterpart: "A neighbor",
    hours: 1.0,
    date: "Apr 5, 2026",
    status: "pending",
  },
];

const MOCK_LEADERBOARD = [
  { name: "A Boulder neighbor", hours: 18.5 },
  { name: "A Boulder neighbor", hours: 14.0 },
  { name: "A Boulder neighbor", hours: 11.0 },
  { name: "A Boulder neighbor", hours: 9.5 },
  { name: "A Boulder neighbor", hours: 7.0 },
];

export default function TimeBankDashboard() {
  return (
    <div className="min-h-screen bg-[#FEFCF6] flex flex-col">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FEFCF6]/95 backdrop-blur-md border-b border-[#C5D4B5]/40">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <img src="/icon.svg" alt="co-op.care" className="w-8 h-8 rounded-lg" />
            <span className="text-base font-bold tracking-tight text-[#292524]">co-op.care</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/membership" className="hidden sm:block text-sm text-[#57534E] hover:text-[#4A7C59] transition-colors">Membership</a>
            <a
              href="/assess"
              className="text-sm px-4 py-2 bg-[#4A6741] text-white rounded-full hover:bg-[#292524] transition-colors font-medium"
            >
              Free Assessment
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-1 pt-24 pb-24 px-6">
        <div className="max-w-4xl mx-auto">

          {/* Hero */}
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.25em] uppercase text-[#4A6741] font-semibold mb-4">
              Care Hours &nbsp;·&nbsp; Time Bank &nbsp;·&nbsp; Boulder, CO
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[#292524] leading-tight mb-4">
              Your Care Hours
            </h1>
            <p className="text-lg text-[#57534E] max-w-xl mx-auto">
              Give a neighbor an hour. Earn an hour back. Every service is equal — one hour of driving is worth one hour of cooking is worth one hour of company.
            </p>
          </div>

          {/* Balance Card */}
          <div className="bg-[#4A6741] rounded-2xl p-8 mb-8 text-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div>
                <p className="text-sm text-white/60 mb-1 uppercase tracking-wider font-medium">Your balance</p>
                <div className="text-6xl font-bold tracking-tight">
                  {MOCK_BALANCE.toFixed(1)}
                  <span className="text-2xl font-normal text-white/60 ml-2">CH</span>
                </div>
                <p className="text-sm text-white/50 mt-2">Care Hours</p>
              </div>
              <div className="flex flex-col gap-4 sm:text-right">
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-0.5">Lifetime earned</p>
                  <p className="text-2xl font-semibold">{MOCK_LIFETIME_EARNED.toFixed(1)} CH</p>
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-wider mb-0.5">Lifetime spent</p>
                  <p className="text-2xl font-semibold">{MOCK_LIFETIME_SPENT.toFixed(1)} CH</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <a
              href="/time-bank/offer"
              className="group bg-[#FEFCF6] border-2 border-[#4A6741] rounded-2xl p-6 hover:bg-[#4A6741] transition-colors"
            >
              <div className="mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-[#4A6741] group-hover:text-white transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#292524] group-hover:text-white transition-colors mb-2">
                Offer help
              </h2>
              <p className="text-sm text-[#57534E] group-hover:text-white/80 transition-colors">
                Give your time to a neighbor. Earn Care Hours you can redeem for help when you need it.
              </p>
            </a>
            <a
              href="/time-bank/request"
              className="group bg-[#FEFCF6] border-2 border-[#C5D4B5] rounded-2xl p-6 hover:bg-[#4A6741] transition-colors"
            >
              <div className="mb-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-[#57534E] group-hover:text-white transition-colors">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#292524] group-hover:text-white transition-colors mb-2">
                Request help
              </h2>
              <p className="text-sm text-[#57534E] group-hover:text-white/80 transition-colors">
                Spend your Care Hours on a service from a neighbor. We will find a match for you.
              </p>
            </a>
          </div>

          {/* How it works */}
          <div className="bg-[#F5F0EB] rounded-2xl p-8 mb-10">
            <h2 className="text-xl font-bold text-[#292524] mb-6">How Care Hours work</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-[#4A6741] mb-2">1 CH = 1 hour</div>
                <p className="text-sm text-[#57534E]">
                  One hour of any contribution equals one Care Hour, regardless of the service. A ride to the doctor is worth the same as an hour of companionship. Every neighbor&apos;s time is equal.
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#4A6741] mb-2">Earn by giving</div>
                <p className="text-sm text-[#57534E]">
                  Help a neighbor with transportation, a meal, or a visit. Both parties confirm the exchange, and your balance is credited automatically.
                </p>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#4A6741] mb-2">Spend on care</div>
                <p className="text-sm text-[#57534E]">
                  Request help from a neighbor, or apply your Care Hours toward your co-op.care membership. Members with a paid subscription receive 5 bonus hours each month.
                </p>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#292524] mb-5">Recent exchanges</h2>
            {MOCK_TRANSACTIONS.length === 0 ? (
              <div className="bg-[#F5F0EB] rounded-xl p-8 text-center">
                <p className="text-[#57534E]">No exchanges yet. Offer help to your first neighbor and earn your first Care Hour.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#C5D4B5]/40">
                {MOCK_TRANSACTIONS.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                        tx.type === "earned" ? "bg-[#4A6741]/10" : "bg-[#F5F0EB]"
                      }`}>
                        {tx.type === "earned" ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#4A6741]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m-7 7l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-[#57534E]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#292524]">{tx.description}</p>
                        <p className="text-xs text-[#57534E]">{tx.counterpart} &middot; {tx.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${tx.type === "earned" ? "text-[#4A6741]" : "text-[#57534E]"}`}>
                        {tx.type === "earned" ? "+" : "-"}{tx.hours.toFixed(1)} CH
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        tx.status === "confirmed"
                          ? "bg-[#4A6741]/10 text-[#4A6741]"
                          : "bg-[#F5F0EB] text-[#57534E]"
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leaderboard */}
          <div className="bg-[#FEFCF6] border border-[#C5D4B5]/60 rounded-2xl p-8 mb-10">
            <h2 className="text-xl font-bold text-[#292524] mb-2">Top helpers this month</h2>
            <p className="text-sm text-[#57534E] mb-6">Names are anonymized to protect privacy. Thank you to everyone giving their time.</p>
            <div className="space-y-3">
              {MOCK_LEADERBOARD.map((entry, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[#4A6741] w-5">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-[#292524]">{entry.name}</span>
                      <span className="text-sm font-semibold text-[#4A6741]">{entry.hours.toFixed(1)} CH</span>
                    </div>
                    <div className="h-1.5 bg-[#C5D4B5]/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#4A6741] rounded-full"
                        style={{ width: `${(entry.hours / MOCK_LEADERBOARD[0].hours) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Membership bonus callout */}
          <div className="bg-[#4A6741]/5 border border-[#C5D4B5] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 justify-between">
            <div>
              <h3 className="font-bold text-[#292524] mb-1">Members receive 5 bonus hours each month</h3>
              <p className="text-sm text-[#57534E]">
                A $59/month co-op.care membership includes 5 Care Hours credited to your account every month — a head start on your care community balance.
              </p>
            </div>
            <a
              href="/membership"
              className="flex-shrink-0 text-sm px-5 py-2.5 bg-[#4A6741] text-white rounded-full hover:bg-[#292524] transition-colors font-medium whitespace-nowrap"
            >
              View membership
            </a>
          </div>

        </div>
      </main>

      <DisclaimerBar />
    </div>
  );
}
