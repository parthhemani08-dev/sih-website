"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, ArrowUpRight, BarChart3, Clock3, Target } from "lucide-react";
import { getLearningActivity, subscribeToLearningActivity, type LearningActivity } from "@/lib/learning-activity";

const conceptNames = ["Qubits", "Superposition", "Measurement", "Quantum Gates", "Entanglement", "Quantum Algorithms"];

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function activityLabel(activity: LearningActivity) {
  switch (activity.activityType) {
    case "concept_completed": return "Completed concept";
    case "concept_started": return "Studied concept";
    case "experiment_completed": return "Completed experiment";
    case "experiment_started": return "Started experiment";
    case "circuit_run": return "Ran a circuit";
    case "ai_tutor_question": return "Asked AI Tutor";
  }
}

export default function DashboardPage() {
  const [activities, setActivities] = useState<LearningActivity[]>([]);

  useEffect(() => {
    const refresh = () => setActivities(getLearningActivity());
    refresh();
    return subscribeToLearningActivity(refresh);
  }, []);

  const metrics = useMemo(() => {
    const completedConcepts = new Set(activities.filter((item) => item.activityType === "concept_completed").map((item) => item.entityId ?? item.entityName));
    const circuits = activities.filter((item) => item.activityType === "circuit_run");
    const completedExperiments = new Set(activities.filter((item) => item.activityType === "experiment_completed").map((item) => item.entityId ?? item.entityName));
    const quizResults = activities.filter((item) => item.activityType === "concept_completed" && typeof item.metadata?.quizScore === "number" && typeof item.metadata?.quizTotal === "number");
    const quizPoints = quizResults.reduce((total, item) => total + Number(item.metadata?.quizScore ?? 0), 0);
    const quizQuestions = quizResults.reduce((total, item) => total + Number(item.metadata?.quizTotal ?? 0), 0);
    return {
      conceptsCompleted: completedConcepts.size,
      circuits: circuits.length,
      experiments: completedExperiments.size,
      startedConcepts: new Set(activities.filter((item) => item.activityType === "concept_started").map((item) => item.entityId ?? item.entityName)),
      quizAttempts: quizResults.length,
      quizAccuracy: quizQuestions ? Math.round((quizPoints / quizQuestions) * 100) : null,
    };
  }, [activities]);

  const mastery = conceptNames.map((name) => {
    const started = activities.some((item) => item.activityType === "concept_started" && item.entityName === name);
    const results = activities.filter((item) => item.activityType === "concept_completed" && item.entityName === name && typeof item.metadata?.quizScore === "number" && typeof item.metadata?.quizTotal === "number");
    const best = results.reduce((score, item) => Math.max(score, Math.round((Number(item.metadata?.quizScore ?? 0) / Number(item.metadata?.quizTotal ?? 1)) * 100)), 0);
    const completed = activities.some((item) => item.activityType === "concept_completed" && item.entityName === name);
    return { name, value: results.length ? best : completed ? 100 : started ? 50 : 0 };
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:py-10">
      <section className="glass rounded-[28px] p-5 sm:p-7">
        <p className="eyebrow">Your workspace</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] text-white sm:text-4xl">Learning dashboard</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">A live view of the concepts, experiments, and circuits you have explored.</p>
      </section>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Circuits Built", value: metrics.circuits ? String(metrics.circuits) : "—", detail: metrics.circuits ? "Successful circuit runs" : "Run a circuit to begin" },
          { label: "Concepts Completed", value: `${metrics.conceptsCompleted} / ${conceptNames.length}`, detail: metrics.conceptsCompleted ? `${Math.round((metrics.conceptsCompleted / conceptNames.length) * 100)}% of concepts` : "Complete a concept to begin", accent: true },
          { label: "Experiments Completed", value: metrics.experiments ? String(metrics.experiments) : "—", detail: metrics.experiments ? "Completed in Circuit Lab" : "Complete an experiment to begin" },
          { label: "Quiz Accuracy", value: metrics.quizAccuracy === null ? "—" : `${metrics.quizAccuracy}%`, detail: metrics.quizAttempts ? `${metrics.quizAttempts} recorded attempt${metrics.quizAttempts === 1 ? "" : "s"}` : "Complete a concept quiz", accent: true },
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
              <h2 className="text-xl font-semibold text-white">Concept mastery</h2>
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">Based on concepts viewed and completed</p>
            </div>
            <BarChart3 size={18} className="text-[#9fe7b7]" />
          </div>
          <div className="mt-7 space-y-5">
            {mastery.map(({ name, value }) => (
              <div key={name}>
                <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.14em] text-slate-400">
                  <span>{name}</span><span>{value ? `${value}%` : "Not started"}</span>
                </div>
                <div className="h-2 rounded-full bg-[#0d141a]"><div className="h-full rounded-full bg-[#9fe7b7] transition-all" style={{ width: `${value}%` }} /></div>
              </div>
            ))}
          </div>
        </section>

        <section className="glass rounded-[24px] p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-white">Progress signals</h2>
            <Target size={18} className="text-[#9fe7b7]" />
          </div>
          <div className="mt-7 space-y-4 text-sm text-slate-400">
            <p><span className="font-semibold text-white">{metrics.startedConcepts.size}</span> concepts started</p>
            <p><span className="font-semibold text-white">{metrics.experiments}</span> experiments completed</p>
            <p><span className="font-semibold text-white">{metrics.quizAttempts}</span> quiz attempts recorded</p>
            <p><span className="font-semibold text-white">{activities.filter((item) => item.activityType === "ai_tutor_question").length}</span> tutor questions asked</p>
          </div>
        </section>
      </div>

      <section className="glass mt-6 rounded-[24px] p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div><h2 className="text-xl font-semibold text-white">Recent activity</h2><p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-500">Latest progress</p></div>
          <Activity size={18} className="text-[#9fe7b7]" />
        </div>
        {activities.length === 0 ? (
          <div className="border-t border-slate-800 pt-5 text-sm text-slate-400">No activity yet. Start a concept, experiment, or circuit to begin.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {activities.slice(0, 12).map((item) => (
              <div key={item.id} className="flex flex-wrap items-center gap-3 py-4 first:pt-0 last:pb-0">
                <span className="h-2.5 w-2.5 rounded-full bg-[#9fe7b7]" />
                <div className="flex-1"><p className="text-sm text-slate-200">{activityLabel(item)} <span className="text-slate-500">· {item.entityName}</span></p></div>
                <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-slate-500"><Clock3 size={12} /> {formatTime(item.createdAt)}</span>
                <ArrowUpRight size={15} className="text-slate-500" />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
