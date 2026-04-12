"use client";

import { useState, useEffect, useRef } from "react";

type VisitState = "not-started" | "active" | "ended";

type Assessment = {
  wellness: string;
  activity: string;
  mood: string;
  appetite: string;
  mobility: string;
  pain: string;
};

const CARE_TASKS = [
  { id: "medication-reminder", label: "Medication reminder" },
  { id: "meal-prep", label: "Meal preparation" },
  { id: "housekeeping", label: "Light housekeeping" },
  { id: "companionship", label: "Companionship / conversation" },
  { id: "exercise", label: "Exercise / walking" },
  { id: "personal-care", label: "Personal care" },
  { id: "transportation", label: "Transportation" },
  { id: "other", label: "Other" },
];

const FLAGS = [
  { id: "fall-risk", label: "Fall risk observed" },
  { id: "medication-concern", label: "Medication concern" },
  { id: "behavioral-change", label: "Behavioral change" },
  { id: "pain-reported", label: "Pain reported" },
  { id: "needs-physician-review", label: "Needs physician review" },
];

function ScaleButtons({ field, options, selected, onSelect }: {
  field: string;
  options: string[];
  selected: string;
  onSelect: (field: string, val: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onSelect(field, opt)}
          className={`flex-1 min-w-0 py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
            selected === opt
              ? "bg-sage-dark border-sage-dark text-white font-bold"
              : "bg-white border-sage-light/30 text-bark-light hover:border-sage"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function FaceButton({ emoji, value, label, selected, onSelect }: {
  emoji: string; value: string; label: string; selected: string; onSelect: (v: string) => void;
}) {
  const isSelected = selected === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex-1 py-2.5 rounded-xl border-2 text-center transition-all ${
        isSelected ? "border-sage-dark bg-sage-50 scale-105" : "border-sage-light/20 bg-white hover:border-sage"
      }`}
    >
      <div className="text-2xl">{emoji}</div>
      <div className={`text-xs mt-1 ${isSelected ? "text-sage-dark font-semibold" : "text-bark-light/50"}`}>{label}</div>
    </button>
  );
}

export default function DocumentPage() {
  const [visitState, setVisitState] = useState<VisitState>("not-started");
  const [elapsed, setElapsed] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [assessment, setAssessment] = useState<Assessment>({
    wellness: "", activity: "", mood: "", appetite: "", mobility: "", pain: "",
  });
  const [checkedTasks, setCheckedTasks] = useState<Set<string>>(new Set());
  const [otherTask, setOtherTask] = useState("");
  const [notes, setNotes] = useState("");
  const [checkedFlags, setCheckedFlags] = useState<Set<string>>(new Set());
  const [storyRecorded, setStoryRecorded] = useState(false);
  const [dateStr, setDateStr] = useState("");

  const [patientName] = useState("Dorothy Warkentine");

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }));
  }, []);

  useEffect(() => {
    if (visitState === "active") {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [visitState]);

  function formatTime(secs: number) {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function startVisit() {
    setStartTime(new Date());
    setVisitState("active");
  }

  function endVisit() {
    setEndTime(new Date());
    setVisitState("ended");
  }

  function selectAssessment(field: string, val: string) {
    setAssessment((prev) => ({ ...prev, [field]: val }));
  }

  function toggleTask(id: string) {
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleFlag(id: string) {
    setCheckedFlags((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function recordStory() {
    setStoryRecorded(true);
    alert("Voice story recording would launch here in the full app.");
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAFAF7" }}>
      {/* Sticky header */}
      <header className="sticky top-0 z-50 text-white px-5 py-5" style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #2a3f6a 100%)" }}>
        <div className="text-xs opacity-60 mb-3">{dateStr}</div>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)" }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-7 8-7s8 3 8 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Today&apos;s Visit</h1>
            <div className="text-sm opacity-65">{patientName}</div>
          </div>
        </div>
      </header>

      <main className="px-4 py-4 max-w-lg mx-auto space-y-4 pb-16">

        {/* Clock in/out */}
        <section className="bg-white rounded-2xl border border-sage-light/20 p-5 text-center shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-bark-light/50 mb-4">Visit Timer</p>
          <div className={`inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-3 ${
            visitState === "not-started" ? "bg-sage-light/20 text-bark-light" :
            visitState === "active" ? "bg-sage-50 text-sage-dark animate-pulse" :
            "bg-bark/5 text-bark-light"
          }`}>
            {visitState === "not-started" ? "Not started" : visitState === "active" ? "Visit in progress" : "Visit ended"}
          </div>
          <div className="text-5xl font-light tabular-nums text-bark mb-1 tracking-wider">{formatTime(elapsed)}</div>
          <p className="text-xs text-bark-light/50 mb-4">
            {visitState === "not-started" && "Tap to start the visit"}
            {visitState === "active" && startTime && `Started at ${startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
            {visitState === "ended" && startTime && endTime && `${startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} → ${endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
          </p>
          {visitState === "not-started" && (
            <button onClick={startVisit} className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all active:scale-95" style={{ background: "#2E7D32" }}>
              Start Visit
            </button>
          )}
          {visitState === "active" && (
            <button onClick={endVisit} className="w-full py-4 rounded-xl font-bold text-lg text-white transition-all active:scale-95" style={{ background: "#C62828" }}>
              End Visit
            </button>
          )}
          {visitState === "ended" && (
            <div className="text-sage-dark font-semibold text-sm">Visit documented. Duration: {formatTime(elapsed)}</div>
          )}
        </section>

        {/* Quick Assessment */}
        <section className="bg-white rounded-2xl border border-sage-light/20 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-bark-light/50 mb-5">Quick Assessment</p>

          <div className="mb-5">
            <p className="text-sm font-semibold text-bark mb-3">How is {patientName.split(" ")[0]} today?</p>
            <div className="flex gap-2">
              {[
                { emoji: "😟", value: "1", label: "1" },
                { emoji: "😕", value: "2", label: "2" },
                { emoji: "😐", value: "3", label: "3" },
                { emoji: "🙂", value: "4", label: "4" },
                { emoji: "😁", value: "5", label: "5" },
              ].map((f) => (
                <FaceButton key={f.value} {...f} selected={assessment.wellness} onSelect={(v) => selectAssessment("wellness", v)} />
              ))}
            </div>
          </div>

          <div className="mb-5">
            <p className="text-sm font-semibold text-bark mb-3">Activity Level</p>
            <ScaleButtons field="activity" options={["Low", "Moderate", "Good", "Very Active"]} selected={assessment.activity} onSelect={selectAssessment} />
          </div>

          <div className="mb-5">
            <p className="text-sm font-semibold text-bark mb-3">Mood</p>
            <ScaleButtons field="mood" options={["Anxious", "Calm", "Happy", "Engaged"]} selected={assessment.mood} onSelect={selectAssessment} />
          </div>

          <div className="mb-5">
            <p className="text-sm font-semibold text-bark mb-3">Appetite</p>
            <ScaleButtons field="appetite" options={["Poor", "Fair", "Good"]} selected={assessment.appetite} onSelect={selectAssessment} />
          </div>

          <div className="mb-5">
            <p className="text-sm font-semibold text-bark mb-3">Mobility</p>
            <ScaleButtons field="mobility" options={["Needs help", "With aid", "Independent"]} selected={assessment.mobility} onSelect={selectAssessment} />
          </div>

          <div className="mb-2">
            <p className="text-sm font-semibold text-bark mb-3">Pain</p>
            <ScaleButtons field="pain" options={["None", "Mild", "Moderate", "Severe"]} selected={assessment.pain} onSelect={selectAssessment} />
          </div>

          <div className="mt-5 flex items-center gap-2 text-xs text-bark-light/40 pt-4 border-t border-sage-light/20">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
            Maps to Omaha System → FHIR R4
          </div>
        </section>

        {/* Care Tasks */}
        <section className="bg-white rounded-2xl border border-sage-light/20 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-bark-light/50 mb-4">Care Tasks</p>
          <div className="divide-y divide-sage-light/20">
            {CARE_TASKS.map((task) => {
              const checked = checkedTasks.has(task.id);
              return (
                <div key={task.id}>
                  <div
                    onClick={() => toggleTask(task.id)}
                    className="flex items-center gap-3 py-3.5 cursor-pointer select-none"
                  >
                    <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                      checked ? "bg-sage-dark border-sage-dark" : "bg-white border-sage-light/40"
                    }`}>
                      {checked && (
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-base font-medium ${checked ? "text-sage-dark" : "text-bark"}`}>{task.label}</span>
                  </div>
                  {task.id === "other" && checked && (
                    <input
                      type="text"
                      placeholder="Describe the task..."
                      maxLength={200}
                      value={otherTask}
                      onChange={(e) => setOtherTask(e.target.value)}
                      className="w-full px-3 py-2.5 mb-3 rounded-xl border-2 border-sage-light/40 focus:border-sage-dark focus:outline-none text-sm text-bark bg-cream"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Notes */}
        <section className="bg-white rounded-2xl border border-sage-light/20 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest text-bark-light/50 mb-3">Notes</p>
          <p className="text-xs text-bark-light/50 mb-3">Anything to share with the family or care team?</p>
          <textarea
            className="w-full min-h-24 px-4 py-3 rounded-xl border-2 border-sage-light/40 focus:border-sage-dark focus:outline-none text-sm text-bark bg-cream resize-y transition-colors"
            placeholder="Observations, conversations, things to remember..."
            maxLength={2000}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </section>

        {/* Story Capture */}
        <section className="bg-white rounded-2xl border border-sage-light/20 p-5 shadow-sm text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-bark-light/50 mb-3">Story Capture</p>
          <p className="text-sm text-bark-light mb-4">Did {patientName.split(" ")[0]} share a story today?</p>
          {storyRecorded ? (
            <div className="text-sage-dark font-semibold text-sm">Story recorded.</div>
          ) : (
            <button
              onClick={recordStory}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-900 font-semibold text-sm hover:bg-amber-100 transition-all active:scale-95"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
              Record a Story
            </button>
          )}
        </section>

        {/* Flags */}
        <section className="bg-white rounded-2xl border border-red-100 p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#C62828" }}>Flags — Important</p>
          <div className="divide-y divide-sage-light/20">
            {FLAGS.map((flag) => {
              const checked = checkedFlags.has(flag.id);
              return (
                <div
                  key={flag.id}
                  onClick={() => toggleFlag(flag.id)}
                  className="flex items-center gap-3 py-3.5 cursor-pointer select-none"
                >
                  <div className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                    checked ? "border-red-600 bg-red-600" : "border-red-200 bg-white"
                  }`}>
                    {checked && (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="white" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                  <span className={`text-base font-medium ${checked ? "text-red-700" : "text-bark"}`}>{flag.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Submit */}
        {visitState === "ended" && (
          <section className="bg-sage-dark rounded-2xl p-5 text-center">
            <p className="text-white font-bold mb-1">Ready to submit?</p>
            <p className="text-sage-light text-sm mb-4">Documentation will be reviewed by the care team.</p>
            <button className="w-full py-4 rounded-xl bg-white text-sage-dark font-bold text-base hover:bg-sage-50 transition-colors">
              Submit Visit Documentation
            </button>
          </section>
        )}

        {/* Footer */}
        <div className="text-center pt-4 pb-8">
          <a href="/" className="text-xs text-bark-light/30 hover:text-bark-light transition-colors">co-op.care</a>
          <span className="text-xs text-bark-light/20 mx-2">·</span>
          <a href="/caregiver" className="text-xs text-bark-light/30 hover:text-bark-light transition-colors">Caregiver Portal</a>
        </div>
      </main>
    </div>
  );
}
