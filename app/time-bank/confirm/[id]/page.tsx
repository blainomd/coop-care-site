"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const DISCLAIMER =
  "Care Hours are not a substitute for licensed medical care. Hands-on personal care requires co-op.care licensed caregivers.";

// Mock transaction data — replace with Supabase fetch in production
const MOCK_TRANSACTION = {
  id: "tx-demo-001",
  service_type: "Transportation",
  hours: 2.0,
  helper_name: "A Boulder neighbor",
  receiver_name: "Your family",
  date: "April 13, 2026",
  notes: "Drive to Boulder Community Hospital for cardiology appointment.",
  helper_confirmed: false,
  receiver_confirmed: false,
  status: "pending",
};

export default function ConfirmTransactionPage() {
  const params = useParams();
  const id = params?.id as string;

  const [transaction] = useState(MOCK_TRANSACTION);
  const [rating, setRating] = useState(0);
  const [ratingNote, setRatingNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [awaitingOther, setAwaitingOther] = useState(false);
  const [error, setError] = useState("");

  // Placeholder: in production, fetch real transaction by id from Supabase
  useEffect(() => {
    // fetch(`/api/time-bank/confirm?id=${id}`) — would hydrate transaction state
    void id;
  }, [id]);

  async function handleConfirm() {
    setConfirming(true);
    setError("");
    try {
      const res = await fetch("/api/time-bank/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_id: id || transaction.id,
          rating: rating || null,
          rating_note: ratingNote.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else if (data.status === "awaiting_other_confirmation") {
        setAwaitingOther(true);
      } else {
        setConfirmed(true);
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setConfirming(false);
    }
  }

  if (confirmed) {
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
            <h1 className="text-3xl font-bold text-[#292524] mb-4">Exchange confirmed.</h1>
            <p className="text-lg text-[#57534E] mb-3">
              <span className="font-semibold text-[#4A6741]">{transaction.hours.toFixed(1)} Care {transaction.hours === 1 ? "Hour" : "Hours"}</span> have been transferred.
            </p>
            <p className="text-sm text-[#57534E] mb-8">
              The helper&apos;s balance has been credited. The recipient&apos;s balance has been updated. Thank you for completing this exchange in good faith.
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

  if (awaitingOther) {
    return (
      <div className="min-h-screen bg-[#FEFCF6] flex flex-col">
        <Nav />
        <main className="flex-1 pt-24 pb-24 px-6">
          <div className="max-w-xl mx-auto text-center">
            <div className="w-16 h-16 bg-[#F5F0EB] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-[#57534E]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-[#292524] mb-4">Your confirmation is in.</h1>
            <p className="text-lg text-[#57534E] mb-3">
              Waiting for the other party to confirm. Once they do, the Care Hours will transfer automatically.
            </p>
            <p className="text-sm text-[#A8A29E] mb-8">
              Both parties must confirm within 48 hours of the exchange date. If the other party doesn&apos;t confirm, the transaction will expire and no hours will be deducted.
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
        <div className="max-w-xl mx-auto">

          <div className="mb-8">
            <a href="/time-bank" className="text-sm text-[#4A6741] hover:underline mb-4 inline-block">&larr; Care Hours dashboard</a>
            <h1 className="text-3xl font-bold text-[#292524] mb-2">Confirm this exchange</h1>
            <p className="text-[#57534E]">
              Both the helper and the recipient must confirm the exchange before Care Hours are transferred. This protects everyone.
            </p>
          </div>

          {/* Exchange summary */}
          <div className="bg-[#F5F0EB] rounded-2xl p-6 mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#57534E] mb-4">Exchange summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-[#57534E]">Service</span>
                <span className="text-sm font-medium text-[#292524]">{transaction.service_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#57534E]">Date</span>
                <span className="text-sm font-medium text-[#292524]">{transaction.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#57534E]">Helper</span>
                <span className="text-sm font-medium text-[#292524]">{transaction.helper_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-[#57534E]">Recipient</span>
                <span className="text-sm font-medium text-[#292524]">{transaction.receiver_name}</span>
              </div>
              {transaction.notes && (
                <div>
                  <span className="text-sm text-[#57534E] block mb-1">Notes</span>
                  <span className="text-sm text-[#292524]">{transaction.notes}</span>
                </div>
              )}
              <div className="border-t border-[#C5D4B5]/60 pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-[#292524]">Care Hours</span>
                <span className="text-xl font-bold text-[#4A6741]">
                  {transaction.hours.toFixed(1)} CH
                </span>
              </div>
            </div>
          </div>

          {/* Confirmation status */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className={`rounded-xl p-4 text-center border-2 ${
              transaction.helper_confirmed
                ? "border-[#4A6741] bg-[#4A6741]/5"
                : "border-[#C5D4B5]/60 bg-white"
            }`}>
              <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                transaction.helper_confirmed ? "bg-[#4A6741]" : "bg-[#C5D4B5]/40"
              }`}>
                {transaction.helper_confirmed ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-[#A8A29E]" />
                )}
              </div>
              <p className="text-xs font-medium text-[#292524]">Helper</p>
              <p className="text-xs text-[#57534E] mt-0.5">
                {transaction.helper_confirmed ? "Confirmed" : "Pending"}
              </p>
            </div>
            <div className={`rounded-xl p-4 text-center border-2 ${
              transaction.receiver_confirmed
                ? "border-[#4A6741] bg-[#4A6741]/5"
                : "border-[#C5D4B5]/60 bg-white"
            }`}>
              <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${
                transaction.receiver_confirmed ? "bg-[#4A6741]" : "bg-[#C5D4B5]/40"
              }`}>
                {transaction.receiver_confirmed ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-[#A8A29E]" />
                )}
              </div>
              <p className="text-xs font-medium text-[#292524]">Recipient</p>
              <p className="text-xs text-[#57534E] mt-0.5">
                {transaction.receiver_confirmed ? "Confirmed" : "Pending"}
              </p>
            </div>
          </div>

          {/* Rating (optional, shown to receiver) */}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#292524] mb-2">
              Rate this exchange <span className="text-sm font-normal text-[#A8A29E]">(optional)</span>
            </h2>
            <p className="text-sm text-[#57534E] mb-4">
              Your rating helps us recognize great neighbors and flag issues early. It is shared with the co-op admin, not publicly displayed.
            </p>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star === rating ? 0 : star)}
                  className="focus:outline-none"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill={star <= rating ? "#4A6741" : "none"}
                    stroke={star <= rating ? "#4A6741" : "#C5D4B5"}
                    strokeWidth="1.5"
                    className="w-8 h-8 transition-colors"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                </button>
              ))}
            </div>
            {rating > 0 && (
              <textarea
                value={ratingNote}
                onChange={(e) => setRatingNote(e.target.value)}
                placeholder="Anything you want to share about how this exchange went..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[#C5D4B5] bg-white text-[#292524] placeholder-[#A8A29E] focus:outline-none focus:border-[#4A6741] text-sm resize-none"
              />
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={confirming}
            className="w-full py-4 bg-[#4A6741] text-white rounded-full font-semibold text-base hover:bg-[#292524] transition-colors disabled:opacity-60"
          >
            {confirming ? "Confirming..." : `Confirm — ${transaction.hours.toFixed(1)} Care ${transaction.hours === 1 ? "Hour" : "Hours"} transferred`}
          </button>

          <p className="text-xs text-[#A8A29E] text-center mt-4">
            By confirming, you attest that this exchange took place as described. Both parties must confirm within 48 hours.
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
