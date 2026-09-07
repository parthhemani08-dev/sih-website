import { Activity, ArrowUpRight, BarChart3, Clock3, Target } from "lucide-react";

const chart = [32, 48, 44, 68, 60, 82, 74, 93];

export default function DashboardPage() {
return (
  <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
    <section className="glass rounded-[28px] p-5 sm:p-7">
      <p className="eyebrow">Your workspace</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-white sm:text-4xl">Learning dashboard</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">A quick view of your momentum, practice, and the concepts you have explored.</p>
    </section>

    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: "Circuits Built", value: "12", detail: "+3 this week" },
        { label: "Lessons Completed", value: "8 / 20", detail: "40% of foundations", accent: true },
        { label: "Accuracy Score", value: "86%", detail: "+6% from last week" },
        { label: "Time Spent", value: "4h 32m", detail: "Across 9 sessions", accent: true },
      ].map(({ label, value, detail, accent }) => (
        <div key={label} className="glass rounded-[22px] p-5">
          <div className={`mb-5 h-1.5 w-10 rounded-full ${accent ? "bg-[#9fe7b7]" : "bg-slate-700"}`} />
          <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-2 text-sm text-slate-400">{detail}</p>
        </div>
      ))}
    </div>

    <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
      <section className="glass rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Learning progress</h2>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">Concept mastery over 8 sessions</p>
          </div>
          <BarChart3 size={18} className="text-[#9fe7b7]" />
        </div>

        <div className="mt-8 flex h-48 items-end gap-2 sm:gap-3">
          {chart.map((value, index) => (
            <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
              <div className="w-full rounded-t-xl bg-gradient-to-t from-[#9fe7b7] via-[#8fe3ff] to-[#d9f99d]" style={{ height: `${value}%` }} />
              <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500">S{index + 1}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="glass rounded-[24px] p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-white">Focus areas</h2>
          <Target size={18} className="text-[#9fe7b7]" />
        </div>

        <div className="mt-7 space-y-5">
          {[ ["Superposition", 72], ["Quantum Gates", 58], ["Entanglement", 36] ].map(([label, value]) => (
            <div key={label as string}>
              <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-400">
                <span>{label}</span>
                <span>{value}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#0d141a]">
                <div className="h-full rounded-full bg-[#9fe7b7]" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>

    <section className="glass mt-6 rounded-[24px] p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Recent activity</h2>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">Latest progress</p>
        </div>
        <Activity size={18} className="text-[#9fe7b7]" />
      </div>

      <div className="divide-y divide-slate-800">
        {[
          ["Completed lesson", "Superposition", "Today, 10:42 AM", "bg-[#9fe7b7]"],
          ["Built a circuit", "Bell state experiment", "Yesterday, 4:18 PM", "bg-[#8fe3ff]"],
          ["Asked AI Tutor", "Understanding phase", "Yesterday, 3:04 PM", "bg-[#d9f99d]"]
        ].map(([action, item, time, color]) => (
          <div key={item as string} className="flex flex-wrap items-center gap-3 py-4 first:pt-0 last:pb-0">
            <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
            <div className="flex-1">
              <p className="text-sm text-slate-200">{action} <span className="text-slate-500">· {item}</span></p>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-slate-500">
              <Clock3 size={12} /> {time}
            </span>
            <ArrowUpRight size={15} className="text-slate-500" />
          </div>
        ))}
      </div>
    </section>
  </div>
);
}
