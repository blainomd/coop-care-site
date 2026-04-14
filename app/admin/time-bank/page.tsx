"use client";

import { useState, useEffect, useCallback } from "react";

// Admin dashboard for the co-op.care Time Bank.
// Access: requires TIME_BANK_ADMIN_SECRET env var as password.
// This page fetches data directly from the local JSON API routes.
// In production, replace with Supabase queries using the service_role key.

const DISCLAIMER =
  "Care Hours are not a substitute for licensed medical care. Hands-on personal care requires co-op.care licensed caregivers.";

interface Account {
  id: string;
  user_id: string;
  display_name?: string;
  balance: number;
  tier: string;
  lifetime_earned: number;
  lifetime_spent: number;
  suspended: boolean;
  created_at: string;
}

interface Transaction {
  id: string;
  from_user_id: string;
  to_user_id: string;
  service_type: string;
  hours: number;
  status: string;
  helper_confirmed: boolean;
  receiver_confirmed: boolean;
  admin_flagged: boolean;
  created_at: string;
}

interface MatchRequest {
  id: string;
  service_type: string;
  urgency: string;
  description: string;
  estimated_hours: number;
  status: string;
  matched_helper_id: string | null;
  created_at: string;
}

interface HelperProfile {
  user_id: string;
  display_name?: string;
  services_offered: string[];
  location_zip: string;
  verification_status: string;
  needs_background_check: boolean;
}

type AdminTab = "overview" | "accounts" | "transactions" | "requests" | "helpers";

export default function AdminTimeBankPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [matchRequests, setMatchRequests] = useState<MatchRequest[]>([]);
  const [helperProfiles, setHelperProfiles] = useState<HelperProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminSecret, setAdminSecret] = useState("");

  const [matchingRequestId, setMatchingRequestId] = useState("");
  const [matchingHelperId, setMatchingHelperId] = useState("");
  const [matchingNotes, setMatchingNotes] = useState("");
  const [matchResult, setMatchResult] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    // Simple client-side gate — real auth is server-side via API Bearer token
    if (password.length > 6) {
      setAdminSecret(password);
      setAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Invalid password.");
    }
  }

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${adminSecret}` };

      const [acctRes, txRes, reqRes, helperRes] = await Promise.all([
        fetch("/api/time-bank/account", { headers }),
        fetch("/api/time-bank/transaction", { headers }),
        fetch("/api/time-bank/match", { headers }),
        fetch("/api/time-bank/account?role=helper", { headers }),
      ]);

      if (acctRes.ok) {
        const d = await acctRes.json();
        setAccounts(d.accounts || []);
      }
      if (txRes.ok) {
        const d = await txRes.json();
        setTransactions(d.transactions || []);
      }
      if (reqRes.ok) {
        const d = await reqRes.json();
        setMatchRequests(d.open_requests || []);
      }
      if (helperRes.ok) {
        const d = await helperRes.json();
        setHelperProfiles(d.helpers || []);
      }
    } catch (err) {
      console.error("Admin data load error:", err);
    } finally {
      setLoading(false);
    }
  }, [adminSecret]);

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
  }, [authenticated, loadData]);

  async function handleMatch(e: React.FormEvent) {
    e.preventDefault();
    setMatchResult("");
    try {
      const res = await fetch("/api/time-bank/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify({
          request_id: matchingRequestId,
          helper_user_id: matchingHelperId,
          admin_notes: matchingNotes,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMatchResult("Matched successfully.");
        setMatchingRequestId("");
        setMatchingHelperId("");
        setMatchingNotes("");
        loadData();
      } else {
        setMatchResult(data.error || "Match failed.");
      }
    } catch {
      setMatchResult("Could not reach the server.");
    }
  }

  async function handleConfirmTransaction(txId: string) {
    try {
      const res = await fetch("/api/time-bank/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminSecret}`,
        },
        body: JSON.stringify({ transaction_id: txId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Transaction ${data.status}: ${data.hours || ""} CH`);
        loadData();
      } else {
        alert(data.error || "Confirmation failed.");
      }
    } catch {
      alert("Could not reach the server.");
    }
  }

  const pendingTx = transactions.filter((t) => t.status === "pending");
  const flaggedTx = transactions.filter((t) => t.admin_flagged);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#292524] flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2.5 mb-8 justify-center">
            <img src="/icon.svg" alt="co-op.care" className="w-8 h-8 rounded-lg" />
            <span className="text-base font-bold tracking-tight text-white">co-op.care Admin</span>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Time Bank Admin</h1>
          <p className="text-sm text-white/40 text-center mb-8">Enter the admin password to continue.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-[#C5D4B5]"
            />
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-[#4A6741] text-white rounded-full font-medium hover:bg-[#C5D4B5] hover:text-[#292524] transition-colors"
            >
              Sign in
            </button>
          </form>
          <p className="text-xs text-white/20 text-center mt-6">{DISCLAIMER}</p>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview" },
    { id: "accounts", label: "Accounts", count: accounts.length },
    { id: "transactions", label: "Transactions", count: pendingTx.length },
    { id: "requests", label: "Match Requests", count: matchRequests.length },
    { id: "helpers", label: "Helper Roster", count: helperProfiles.length },
  ];

  return (
    <div className="min-h-screen bg-[#FEFCF6]">
      {/* Admin Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#292524] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/icon.svg" alt="co-op.care" className="w-7 h-7 rounded-lg" />
            <span className="text-sm font-bold text-white">co-op.care</span>
            <span className="text-white/30 text-sm">/</span>
            <span className="text-sm text-white/60">Time Bank Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={loadData}
              className="text-xs text-white/50 hover:text-white transition-colors"
            >
              {loading ? "Loading..." : "Refresh"}
            </button>
            <a href="/time-bank" className="text-xs text-white/50 hover:text-white transition-colors">
              View time bank
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-14">
        {/* Tabs */}
        <div className="bg-white border-b border-[#C5D4B5]/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-0 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-[#4A6741] text-[#4A6741]"
                      : "border-transparent text-[#57534E] hover:text-[#292524]"
                  }`}
                >
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      activeTab === tab.id
                        ? "bg-[#4A6741]/10 text-[#4A6741]"
                        : "bg-[#F5F0EB] text-[#57534E]"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">

          {/* Overview */}
          {activeTab === "overview" && (
            <div>
              <h1 className="text-2xl font-bold text-[#292524] mb-6">Time Bank Overview</h1>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total accounts" value={accounts.length} />
                <StatCard label="Pending transactions" value={pendingTx.length} />
                <StatCard label="Flagged transactions" value={flaggedTx.length} alert={flaggedTx.length > 0} />
                <StatCard label="Open match requests" value={matchRequests.length} />
              </div>

              {flaggedTx.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <p className="text-sm font-semibold text-amber-800 mb-1">
                    {flaggedTx.length} flagged {flaggedTx.length === 1 ? "transaction" : "transactions"} require review
                  </p>
                  <p className="text-sm text-amber-700">
                    Flags are triggered when a single transaction exceeds 4 hours or when a member receives a low rating. Review in the Transactions tab.
                  </p>
                </div>
              )}

              {/* Internal note */}
              <div className="bg-[#F5F0EB] rounded-xl p-5">
                <p className="text-sm font-semibold text-[#292524] mb-2">Internal conversion rate (not public)</p>
                <p className="text-sm text-[#57534E]">
                  1 Care Hour = $10 of credit toward the $59/month subscription. Maximum 6 CH redeemable per member per month ($60 cap). This rate is internal only and should not appear in any member-facing copy.
                </p>
              </div>
            </div>
          )}

          {/* Accounts */}
          {activeTab === "accounts" && (
            <div>
              <h2 className="text-xl font-bold text-[#292524] mb-6">All Accounts</h2>
              {accounts.length === 0 ? (
                <p className="text-[#57534E]">No accounts yet.</p>
              ) : (
                <div className="bg-white border border-[#C5D4B5]/40 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#C5D4B5]/40 bg-[#F5F0EB]">
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">User ID</th>
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">Tier</th>
                        <th className="text-right px-4 py-3 font-semibold text-[#292524]">Balance</th>
                        <th className="text-right px-4 py-3 font-semibold text-[#292524]">Earned</th>
                        <th className="text-right px-4 py-3 font-semibold text-[#292524]">Spent</th>
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">Status</th>
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.map((acct, i) => (
                        <tr key={acct.id} className={`border-b border-[#C5D4B5]/20 ${i % 2 === 0 ? "" : "bg-[#F5F0EB]/30"}`}>
                          <td className="px-4 py-3 font-mono text-xs text-[#57534E]">{acct.user_id.slice(0, 12)}...</td>
                          <td className="px-4 py-3 text-[#292524]">{acct.tier}</td>
                          <td className="px-4 py-3 text-right font-bold text-[#4A6741]">{acct.balance?.toFixed(1)} CH</td>
                          <td className="px-4 py-3 text-right text-[#292524]">{acct.lifetime_earned?.toFixed(1)}</td>
                          <td className="px-4 py-3 text-right text-[#292524]">{acct.lifetime_spent?.toFixed(1)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${acct.suspended ? "bg-red-100 text-red-700" : "bg-[#4A6741]/10 text-[#4A6741]"}`}>
                              {acct.suspended ? "Suspended" : "Active"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-[#57534E]">{new Date(acct.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Transactions */}
          {activeTab === "transactions" && (
            <div>
              <h2 className="text-xl font-bold text-[#292524] mb-6">Transactions</h2>
              {transactions.length === 0 ? (
                <p className="text-[#57534E]">No transactions yet.</p>
              ) : (
                <div className="bg-white border border-[#C5D4B5]/40 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#C5D4B5]/40 bg-[#F5F0EB]">
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">ID</th>
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">Service</th>
                        <th className="text-right px-4 py-3 font-semibold text-[#292524]">Hours</th>
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">Status</th>
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">Confirmed</th>
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">Date</th>
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx, i) => (
                        <tr key={tx.id} className={`border-b border-[#C5D4B5]/20 ${tx.admin_flagged ? "bg-amber-50" : i % 2 === 0 ? "" : "bg-[#F5F0EB]/30"}`}>
                          <td className="px-4 py-3 font-mono text-xs text-[#57534E]">{tx.id.slice(0, 8)}...</td>
                          <td className="px-4 py-3 text-[#292524]">{tx.service_type}</td>
                          <td className="px-4 py-3 text-right font-semibold text-[#4A6741]">{tx.hours} CH</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              tx.status === "confirmed" ? "bg-[#4A6741]/10 text-[#4A6741]" :
                              tx.status === "pending" ? "bg-amber-100 text-amber-700" :
                              "bg-[#F5F0EB] text-[#57534E]"
                            }`}>{tx.status}</span>
                            {tx.admin_flagged && (
                              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">Flagged</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-[#57534E]">
                            H:{tx.helper_confirmed ? "Y" : "N"} / R:{tx.receiver_confirmed ? "Y" : "N"}
                          </td>
                          <td className="px-4 py-3 text-xs text-[#57534E]">{new Date(tx.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            {tx.status === "pending" && (
                              <button
                                onClick={() => handleConfirmTransaction(tx.id)}
                                className="text-xs px-3 py-1 bg-[#4A6741] text-white rounded-full hover:bg-[#292524] transition-colors"
                              >
                                Admin confirm
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Match Requests */}
          {activeTab === "requests" && (
            <div>
              <h2 className="text-xl font-bold text-[#292524] mb-6">Open Match Requests</h2>
              {matchRequests.length === 0 ? (
                <p className="text-[#57534E]">No open match requests.</p>
              ) : (
                <div className="space-y-4 mb-10">
                  {matchRequests.map((req) => (
                    <div key={req.id} className="bg-white border border-[#C5D4B5]/40 rounded-xl p-5">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#4A6741]">{req.service_type}</span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                            req.urgency === "today" ? "bg-red-100 text-red-700" :
                            req.urgency === "this_week" ? "bg-amber-100 text-amber-700" :
                            "bg-[#F5F0EB] text-[#57534E]"
                          }`}>{req.urgency.replace("_", " ")}</span>
                        </div>
                        <span className="text-sm font-semibold text-[#292524]">{req.estimated_hours} hrs</span>
                      </div>
                      <p className="text-sm text-[#57534E] mb-2">{req.description}</p>
                      <p className="text-xs text-[#A8A29E]">Submitted {new Date(req.created_at).toLocaleDateString()} &middot; ID: {req.id.slice(0, 8)}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Manual match form */}
              <div className="bg-[#F5F0EB] rounded-xl p-6">
                <h3 className="text-lg font-bold text-[#292524] mb-4">Assign a helper</h3>
                <form onSubmit={handleMatch} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#292524] mb-1">Match Request ID</label>
                    <input
                      type="text"
                      value={matchingRequestId}
                      onChange={(e) => setMatchingRequestId(e.target.value)}
                      placeholder="Paste the request ID"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#C5D4B5] bg-white text-sm text-[#292524] focus:outline-none focus:border-[#4A6741]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#292524] mb-1">Helper User ID</label>
                    <input
                      type="text"
                      value={matchingHelperId}
                      onChange={(e) => setMatchingHelperId(e.target.value)}
                      placeholder="Paste the helper's user ID"
                      className="w-full px-4 py-2.5 rounded-lg border border-[#C5D4B5] bg-white text-sm text-[#292524] focus:outline-none focus:border-[#4A6741]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#292524] mb-1">Admin notes (optional)</label>
                    <textarea
                      value={matchingNotes}
                      onChange={(e) => setMatchingNotes(e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#C5D4B5] bg-white text-sm text-[#292524] focus:outline-none focus:border-[#4A6741] resize-none"
                    />
                  </div>
                  {matchResult && (
                    <p className={`text-sm ${matchResult.includes("success") ? "text-[#4A6741]" : "text-red-600"}`}>
                      {matchResult}
                    </p>
                  )}
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#4A6741] text-white rounded-full text-sm font-medium hover:bg-[#292524] transition-colors"
                  >
                    Assign match
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Helper Roster */}
          {activeTab === "helpers" && (
            <div>
              <h2 className="text-xl font-bold text-[#292524] mb-6">Helper Roster</h2>
              {helperProfiles.length === 0 ? (
                <p className="text-[#57534E]">No helpers have signed up yet.</p>
              ) : (
                <div className="bg-white border border-[#C5D4B5]/40 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#C5D4B5]/40 bg-[#F5F0EB]">
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">User ID</th>
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">ZIP</th>
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">Services</th>
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">Verification</th>
                        <th className="text-left px-4 py-3 font-semibold text-[#292524]">Background check</th>
                      </tr>
                    </thead>
                    <tbody>
                      {helperProfiles.map((h, i) => (
                        <tr key={h.user_id} className={`border-b border-[#C5D4B5]/20 ${i % 2 === 0 ? "" : "bg-[#F5F0EB]/30"}`}>
                          <td className="px-4 py-3 font-mono text-xs text-[#57534E]">{h.user_id.slice(0, 12)}...</td>
                          <td className="px-4 py-3 text-[#292524]">{h.location_zip}</td>
                          <td className="px-4 py-3 text-xs text-[#57534E]">{h.services_offered?.join(", ")}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              h.verification_status === "verified" ? "bg-[#4A6741]/10 text-[#4A6741]" : "bg-amber-100 text-amber-700"
                            }`}>{h.verification_status}</span>
                          </td>
                          <td className="px-4 py-3">
                            {h.needs_background_check ? (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Required</span>
                            ) : (
                              <span className="text-xs text-[#A8A29E]">Not required</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Disclaimer */}
      <div className="w-full bg-[#F5F0EB] border-t border-[#C5D4B5]/60 px-6 py-3">
        <p className="text-xs text-[#57534E] text-center max-w-3xl mx-auto">{DISCLAIMER}</p>
      </div>
    </div>
  );
}

function StatCard({ label, value, alert }: { label: string; value: number; alert?: boolean }) {
  return (
    <div className={`rounded-xl p-5 border ${alert ? "bg-amber-50 border-amber-200" : "bg-white border-[#C5D4B5]/40"}`}>
      <div className={`text-3xl font-bold mb-1 ${alert ? "text-amber-700" : "text-[#4A6741]"}`}>{value}</div>
      <div className="text-sm text-[#57534E]">{label}</div>
    </div>
  );
}
